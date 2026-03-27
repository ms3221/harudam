import { NextResponse } from "next/server";
import { CoupangClient } from "@/lib/coupang";

export async function GET() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { ok: false, message: "API 키가 설정되지 않았습니다.", debug: { hasAccessKey: !!accessKey, hasSecretKey: !!secretKey } },
      { status: 500 }
    );
  }

  // 서명 디버그
  const { generateSignature } = await import("@/lib/coupang/auth");
  const testPath = "/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/37544";
  const testDatetime = "260327T071000Z";
  const testSig = generateSignature({ method: "GET", path: testPath, accessKey, secretKey, datetime: testDatetime });

  const client = new CoupangClient(accessKey, secretKey);
  const result = await client.healthCheck();

  return NextResponse.json({
    ...result,
    debug: {
      accessKeyPrefix: accessKey.slice(0, 8) + "...",
      secretKeyLength: secretKey.length,
      testSignature: testSig,
      runtime: typeof EdgeRuntime !== "undefined" ? "edge" : "nodejs",
    },
  }, { status: result.ok ? 200 : 401 });
}
