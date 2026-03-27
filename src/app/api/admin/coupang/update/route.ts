import { NextRequest, NextResponse } from "next/server";
import { CoupangClient, updateProduct, getProduct } from "@/lib/coupang";
import type { CoupangProductRequest } from "@/lib/coupang";
import { supabase } from "@/lib/supabase";

// contents를 수정 API 형식으로 변환 (contentsType/detailType은 반드시 "TEXT")
function convertContentsForUpdate(
  items: any[]
): any[] {
  return items.map((item) => {
    if (!item.contents || !Array.isArray(item.contents)) return item;

    return {
      ...item,
      contents: item.contents.map((c: any) => {
        // 이미 수정 API 형식(contentsType + contentDetails)인 경우
        if (c.contentsType) {
          return {
            contentsType: "TEXT",
            contentDetails: (c.contentDetails || []).map((d: any) => ({
              ...d,
              detailType: "TEXT",
            })),
          };
        }
        // 생성 API 형식(contentType + content)인 경우
        return {
          contentsType: "TEXT",
          contentDetails: [
            {
              content: c.content || "",
              detailType: "TEXT",
            },
          ],
        };
      }),
    };
  });
}

export async function POST(request: NextRequest) {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const body: { registeredProductId: string } & CoupangProductRequest =
      await request.json();
    const { registeredProductId, ...productData } = body;

    if (!registeredProductId) {
      return NextResponse.json(
        { error: "registeredProductId가 필요합니다." },
        { status: 400 }
      );
    }

    // registered_products에서 seller_product_id 조회
    const { data: regProduct, error: fetchError } = await supabase
      .from("registered_products")
      .select("seller_product_id")
      .eq("id", registeredProductId)
      .single();

    if (fetchError || !regProduct) {
      return NextResponse.json(
        { error: "등록된 상품을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const sellerProductId = regProduct.seller_product_id;
    const client = new CoupangClient(accessKey, secretKey);

    // 쿠팡에서 기존 상품 조회 → sellerProductItemId, vendorItemId 확보
    const existingProduct = await getProduct(client, sellerProductId);
    const existingItems = existingProduct.data?.items || [];

    // items에 sellerProductItemId, vendorItemId 삽입
    const updatedItems = convertContentsForUpdate(
      (productData.items || []).map((item: any, idx: number) => {
        const existingItem = existingItems[idx];
        return {
          ...item,
          // 기존 아이템의 ID를 삽입 (수정 시 필수)
          ...(existingItem
            ? {
                sellerProductItemId: existingItem.sellerProductItemId,
                vendorItemId: existingItem.vendorItemId,
              }
            : {}),
        };
      })
    );

    const finalProductData = {
      ...productData,
      items: updatedItems,
    } as CoupangProductRequest;

    // 디버그: 쿠팡에 전송할 최종 요청 데이터 로그
    console.log("=== 쿠팡 상품 수정 API 요청 데이터 ===");
    console.log("sellerProductId:", sellerProductId);
    console.log("기존 상품 조회 결과 items:", JSON.stringify(existingItems, null, 2));
    console.log("최종 전송 데이터:", JSON.stringify({ sellerProductId, ...finalProductData }, null, 2));

    // 쿠팡 수정 API 호출 (PUT /seller-products, body에 sellerProductId 포함)
    const result = await updateProduct(client, sellerProductId, finalProductData);

    console.log("=== 쿠팡 상품 수정 API 응답 ===");
    console.log(JSON.stringify(result, null, 2));

    // 수정 후 5초 대기 후 쿠팡에서 최신 상태 조회 (쿠팡 처리 시간 필요)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let coupangStatus = "임시저장";
    let latestData: any = productData;
    try {
      const detail = await getProduct(client, sellerProductId);
      coupangStatus = detail.data?.statusName || "임시저장";
      latestData = detail.data || productData;
    } catch {
      // 조회 실패 시 기본값 사용
    }

    const statusMap: Record<string, string> = {
      "승인완료": "approved", "부분승인완료": "approved",
      "승인반려": "rejected", "상품삭제": "deleted",
    };
    const dbStatus = statusMap[coupangStatus] || "registered";

    // DB 업데이트
    await supabase
      .from("registered_products")
      .update({
        request_data: latestData,
        product_name: productData.sellerProductName || "",
        sale_price: productData.items?.[0]?.salePrice || null,
        coupang_status: coupangStatus,
        status: dbStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", registeredProductId);

    return NextResponse.json({ ...result, coupangStatus });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "상품 수정 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
