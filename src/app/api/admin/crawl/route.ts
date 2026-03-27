import { NextRequest, NextResponse } from "next/server";
import { crawlHot6, crawlProductDetail } from "@/lib/crawler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url } = body;

    if (type === "detail" && url) {
      const product = await crawlProductDetail(url);
      return NextResponse.json(product);
    }

    // 기본: HOT 6 크롤링
    const snapshot = await crawlHot6();
    return NextResponse.json(snapshot);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "크롤링에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
