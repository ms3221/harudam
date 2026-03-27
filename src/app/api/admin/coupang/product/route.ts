import { NextRequest, NextResponse } from "next/server";
import { CoupangClient, getProduct } from "@/lib/coupang";
import type { CoupangStatusName } from "@/lib/coupang";
import { supabase } from "@/lib/supabase";

function mapCoupangStatusToDbStatus(
  statusName: CoupangStatusName
): "registered" | "approved" | "rejected" | "deleted" {
  switch (statusName) {
    case "승인완료":
    case "부분승인완료":
      return "approved";
    case "승인반려":
      return "rejected";
    case "상품삭제":
      return "deleted";
    default:
      return "registered";
  }
}

export async function GET(request: NextRequest) {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sellerProductId = searchParams.get("sellerProductId");
  const registeredProductId = searchParams.get("registeredProductId");

  if (!sellerProductId) {
    return NextResponse.json(
      { error: "sellerProductId가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const client = new CoupangClient(accessKey, secretKey);
    const result = await getProduct(client, Number(sellerProductId));
    const detail = result.data;

    // registeredProductId가 있으면 registered_products DB 동기화
    if (registeredProductId) {
      const dbStatus = mapCoupangStatusToDbStatus(detail.statusName);
      await supabase
        .from("registered_products")
        .update({
          status: dbStatus,
          coupang_status: detail.statusName,
          request_data: detail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", registeredProductId);
    }

    return NextResponse.json(detail);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "상품 조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
