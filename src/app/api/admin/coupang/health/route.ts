import { NextResponse } from "next/server";
import { CoupangClient } from "@/lib/coupang";

export async function GET() {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;

  if (!accessKey || !secretKey) {
    return NextResponse.json(
      { ok: false, message: "API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const client = new CoupangClient(accessKey, secretKey);
  const result = await client.healthCheck();

  return NextResponse.json(result, { status: result.ok ? 200 : 401 });
}
