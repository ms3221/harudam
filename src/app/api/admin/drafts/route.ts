import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// 임시저장 목록 조회 (id 단일 조회 또는 product_code 필터링)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const productCode = searchParams.get("product_code");

  // id로 단일 조회
  if (id) {
    const { data, error } = await supabase
      .from("draft_registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  let query = supabase
    .from("draft_registrations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (productCode) {
    query = query.eq("product_code", productCode);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// 임시저장 생성 또는 업데이트 (upsert)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, product_code, product_name, form_data, status } = body;

  if (id) {
    // 기존 임시저장 업데이트
    const { data, error } = await supabase
      .from("draft_registrations")
      .update({
        product_name,
        form_data,
        status: status || "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  }

  // 새로 생성
  const { data, error } = await supabase
    .from("draft_registrations")
    .insert({
      product_code: product_code || null,
      product_name: product_name || "",
      form_data: form_data || {},
      status: status || "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// 임시저장 삭제
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  const { error } = await supabase
    .from("draft_registrations")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
