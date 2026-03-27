import { NextRequest, NextResponse } from "next/server";
import { CoupangClient } from "@/lib/coupang";

function getClient() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return null;
  return new CoupangClient(accessKey, secretKey);
}

// 카테고리 메타정보 조회 (고시정보, 옵션, 인증정보 등)
export async function GET(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const categoryCode = request.nextUrl.searchParams.get("categoryCode");
  if (!categoryCode) {
    return NextResponse.json(
      { error: "categoryCode 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const result = await client.request(
      "GET",
      `/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/${categoryCode}`
    );
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "메타정보 조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
