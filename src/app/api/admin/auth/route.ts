import { NextRequest, NextResponse } from "next/server";
import { getSessionCookieConfig } from "@/lib/auth";
import { getSetting } from "@/lib/settings";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const adminPassword = await getSetting("admin_password");

  if (!adminPassword) {
    return NextResponse.json(
      { error: "관리자 비밀번호가 설정되지 않았습니다. DB settings 테이블을 확인하세요." },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });
  const cookie = getSessionCookieConfig();
  response.cookies.set(cookie);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
