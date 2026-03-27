import { NextRequest, NextResponse } from "next/server";
import { CoupangClient } from "@/lib/coupang";

function getClient() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) return null;
  return new CoupangClient(accessKey, secretKey);
}

// 카테고리 추천 API
export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return NextResponse.json(
      { error: "쿠팡 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { productName, brand } = body;

    if (!productName) {
      return NextResponse.json(
        { error: "상품명(productName)은 필수입니다." },
        { status: 400 }
      );
    }

    const requestBody = {
      productName: productName,
      ...(brand ? { brand } : {}),
    };

    const path = "/v2/providers/openapi/apis/api/v1/categorization/predict";
    const result = await client.request("POST", path, requestBody);

    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "카테고리 추천 실패";

    // 원본 에러를 함께 반환해서 디버깅
    return NextResponse.json(
      { error: msg, detail: String(error) },
      { status: 500 }
    );
  }
}
