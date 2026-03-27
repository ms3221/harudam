import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 쿠팡 등록 완료 상품 목록 조회 (id 파라미터 있으면 단건 + request_data 포함)
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("registered_products")
      .select("id, draft_id, seller_product_id, product_name, sale_price, status, coupang_status, request_data, registered_at, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("registered_products")
    .select("id, draft_id, seller_product_id, product_name, sale_price, status, coupang_status, registered_at, updated_at")
    .order("registered_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}
