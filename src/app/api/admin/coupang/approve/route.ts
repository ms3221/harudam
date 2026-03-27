import { NextRequest, NextResponse } from "next/server";
import { CoupangClient, approveProduct, getProduct, updateProduct } from "@/lib/coupang";
import type { CoupangProductRequest } from "@/lib/coupang";
import { supabase } from "@/lib/supabase";

async function updateDbStatus(sellerProductId: number, status: string, coupangStatus: string, draftId?: string) {
  if (draftId) {
    await supabase
      .from("draft_registrations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", draftId);
  }
  await supabase
    .from("registered_products")
    .update({ status, coupang_status: coupangStatus, updated_at: new Date().toISOString() })
    .eq("seller_product_id", sellerProductId);
}

export async function PUT(request: NextRequest) {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const { sellerProductId, draftId } = await request.json();
    if (!sellerProductId) {
      return NextResponse.json(
        { error: "sellerProductId가 필요합니다." },
        { status: 400 }
      );
    }

    const client = new CoupangClient(accessKey, secretKey);

    // 먼저 승인 요청 시도
    try {
      const approveResult = await approveProduct(client, sellerProductId);

      await updateDbStatus(sellerProductId, "approved", "승인완료", draftId);
      return NextResponse.json(approveResult);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "";

      // "임시저장 상태만 승인 가능" 에러 → 실제 상태 확인
      if (!errMsg.includes("임시저장")) {
        throw err;
      }

      const productResult = await getProduct(client, Number(sellerProductId));
      const statusName = productResult.data.statusName;

      // 이미 승인완료 상태
      if (statusName === "승인완료" || statusName === "부분승인완료") {
        await updateDbStatus(sellerProductId, "approved", statusName, draftId);
        return NextResponse.json({
          message: "이미 승인 처리된 상품입니다.",
          alreadyApproved: true,
          statusName,
        });
      }

      // 승인반려 → 수정 API로 임시저장 상태로 리셋 → 재승인
      if (statusName === "승인반려") {
        // registered_products에서 원본 등록 데이터 가져오기
        const { data: regProduct } = await supabase
          .from("registered_products")
          .select("request_data")
          .eq("seller_product_id", sellerProductId)
          .single();

        if (!regProduct?.request_data) {
          return NextResponse.json(
            { error: "원본 등록 데이터를 찾을 수 없어 수정 후 재승인이 불가합니다.", statusName },
            { status: 400 }
          );
        }

        // 1단계: 기존 상품에서 item ID 조회
        const existingItems = productResult.data?.items || [];

        // request_data의 items에 sellerProductItemId, vendorItemId 삽입 + contents 형식 변환
        const productData = regProduct.request_data as CoupangProductRequest & { items: any[] };
        const updatedItems = (productData.items || []).map((item: any, idx: number) => {
          const existingItem = existingItems[idx];
          // contents 형식 변환: 생성 형식 → 수정 형식
          const convertedContents = (item.contents || []).map((c: any) => {
            // 이미 수정 API 형식이면 그대로
            if (c.contentsType) return c;
            return {
              contentsType: c.contentType || "TEXT",
              contentDetails: [{ content: c.content || "", detailType: c.contentType || "TEXT" }],
            };
          });
          return {
            ...item,
            contents: convertedContents,
            ...(existingItem
              ? {
                  sellerProductItemId: existingItem.sellerProductItemId,
                  vendorItemId: existingItem.vendorItemId,
                }
              : {}),
          };
        });

        // 수정 API 호출 → 임시저장 상태로 리셋
        const finalProductData = { ...productData, items: updatedItems } as CoupangProductRequest;
        await updateProduct(client, Number(sellerProductId), finalProductData);

        // 2단계: 재승인 요청
        const reapproveResult = await approveProduct(client, sellerProductId);

        await updateDbStatus(sellerProductId, "registered", "심사중", draftId);
        return NextResponse.json({
          ...reapproveResult,
          reapproved: true,
          message: "승인반려 상품을 수정 후 재승인 요청했습니다.",
        });
      }

      // 심사중 등 다른 상태
      return NextResponse.json(
        { error: `현재 쿠팡 상태가 "${statusName}"이라 승인 요청할 수 없습니다.`, statusName },
        { status: 400 }
      );
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "승인 요청 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
