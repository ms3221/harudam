import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface HotProduct {
  rank: number;
  code: string;
  name: string;
  originalPrice: number | null;
  salePrice: number | null;
  discountRate: string | null;
  image: string | null;
  detailUrl: string;
}

// 저장된 스냅샷 목록 조회
export async function GET() {
  const { data: snapshots, error } = await supabase
    .from("crawl_snapshots")
    .select("id, crawled_at, source, product_count")
    .order("crawled_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 각 스냅샷의 상품도 함께 조회
  const result = [];
  for (const snap of snapshots || []) {
    const { data: products } = await supabase
      .from("crawled_products")
      .select("*")
      .eq("snapshot_id", snap.id)
      .order("rank", { ascending: true });

    result.push({
      id: snap.id,
      crawledAt: snap.crawled_at,
      source: snap.source,
      products: (products || []).map((p) => ({
        rank: p.rank,
        code: p.code,
        name: p.name,
        originalPrice: p.original_price,
        salePrice: p.sale_price,
        discountRate: p.discount_rate,
        image: p.image,
        detailUrl: p.detail_url,
      })),
    });
  }

  return NextResponse.json(result);
}

// 새 스냅샷 저장
export async function POST(request: NextRequest) {
  const snapshot = await request.json();
  const crawledAt = snapshot.crawledAt || new Date().toISOString();
  const products: HotProduct[] = snapshot.products || [];

  // 같은 날짜에 이미 크롤링한 게 있으면 제거
  const today = new Date(crawledAt).toISOString().slice(0, 10);
  const { data: existing } = await supabase
    .from("crawl_snapshots")
    .select("id, crawled_at")
    .gte("crawled_at", `${today}T00:00:00`)
    .lte("crawled_at", `${today}T23:59:59`);

  if (existing && existing.length > 0) {
    for (const old of existing) {
      await supabase
        .from("crawled_products")
        .delete()
        .eq("snapshot_id", old.id);
      await supabase.from("crawl_snapshots").delete().eq("id", old.id);
    }
  }

  // 스냅샷 생성
  const { data: newSnap, error: snapError } = await supabase
    .from("crawl_snapshots")
    .insert({
      crawled_at: crawledAt,
      source: "hankyeong",
      product_count: products.length,
    })
    .select("id")
    .single();

  if (snapError || !newSnap) {
    return NextResponse.json(
      { error: snapError?.message || "스냅샷 생성 실패" },
      { status: 500 }
    );
  }

  // 상품 저장
  if (products.length > 0) {
    const rows = products.map((p) => ({
      snapshot_id: newSnap.id,
      rank: p.rank,
      code: p.code,
      name: p.name,
      original_price: p.originalPrice,
      sale_price: p.salePrice,
      discount_rate: p.discountRate,
      image: p.image,
      detail_url: p.detailUrl,
    }));

    const { error: prodError } = await supabase
      .from("crawled_products")
      .insert(rows);

    if (prodError) {
      return NextResponse.json(
        { error: prodError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, id: newSnap.id });
}

// 스냅샷 삭제
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  // CASCADE로 crawled_products도 자동 삭제
  const { error } = await supabase
    .from("crawl_snapshots")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
