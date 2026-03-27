import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSettings } from "@/lib/settings";

// 전체 설정 조회
export async function GET() {
  try {
    const settings = await getAllSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "설정 조회 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 설정 저장
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    await setSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "설정 저장 실패";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
