import { NextRequest, NextResponse } from "next/server";
import { CoupangClient, createProduct, getProduct } from "@/lib/coupang";
import type { CoupangProductRequest } from "@/lib/coupang";
import { supabase } from "@/lib/supabase";

function getClient() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) {
    return null;
  }
  return new CoupangClient(accessKey, secretKey);
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const body: CoupangProductRequest & { draftId?: string } =
      await request.json();
    const { draftId, ...productData } = body;

    // 중복 등록 방지: 이미 등록된 draft면 거부
    if (draftId) {
      const { data: draft } = await supabase
        .from("draft_registrations")
        .select("status")
        .eq("id", draftId)
        .single();
      if (draft?.status === "registered") {
        return NextResponse.json(
          { error: "이미 등록 완료된 상품입니다." },
          { status: 409 }
        );
      }
    }

    // 디버그: 실제 전송 데이터 확인
    console.log("=== 쿠팡 상품 등록 요청 ===");
    console.log("requested 값:", productData.requested, typeof productData.requested);
    console.log("전체 요청:", JSON.stringify(productData, null, 2));

    const result = await createProduct(client, productData);

    console.log("=== 쿠팡 상품 등록 응답 ===");
    console.log(JSON.stringify(result, null, 2));

    // data가 직접 숫자(sellerProductId)이거나 객체일 수 있음
    const sellerProductId =
      typeof result.data === "number"
        ? result.data
        : result.data?.sellerProductId;

    // 등록 후 5초 대기 후 쿠팡에서 최신 상태 조회 (쿠팡 처리 시간 필요)
    await new Promise((resolve) => setTimeout(resolve, 5000));
    let coupangStatus = "임시저장";
    let latestData: any = productData;
    if (sellerProductId) {
      try {
        const detail = await getProduct(client, sellerProductId);
        coupangStatus = detail.data?.statusName || "임시저장";
        latestData = detail.data || productData;
      } catch {
        // 조회 실패 시 기본값 사용
      }
    }

    const statusMap: Record<string, string> = {
      "승인완료": "approved", "부분승인완료": "approved",
      "승인반려": "rejected", "상품삭제": "deleted",
    };
    const dbStatus = statusMap[coupangStatus] || "registered";

    // registered_products에 이력 저장
    await supabase.from("registered_products").insert({
      draft_id: draftId || null,
      seller_product_id: sellerProductId,
      product_name: productData.sellerProductName || "",
      sale_price: productData.items?.[0]?.salePrice || null,
      status: dbStatus,
      coupang_status: coupangStatus,
      request_data: latestData,
      response_data: result,
    });

    // draft 상태 업데이트
    if (draftId) {
      await supabase
        .from("draft_registrations")
        .update({
          status: "registered",
          coupang_product_id: sellerProductId?.toString() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", draftId);
    }

    // errorItems가 있으면 경고 포함하여 반환
    const response: Record<string, unknown> = { ...result, sellerProductId };
    if ((result as any).errorItems?.length > 0) {
      response.warnings = (result as any).errorItems;
      response.warningMessage = (result as any).details || (result as any).message;
    }

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "상품 등록 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
