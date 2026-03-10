import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const API_SECRET = process.env.API_SECRET;

function authorize(req: NextRequest): boolean {
  if (!API_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${API_SECRET}`;
}

export async function GET() {
  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await sb
    .from("newsletters")
    .select("*")
    .order("date", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();

  if (!body.title || !body.date || !body.html_content) {
    return NextResponse.json(
      { error: "Missing required fields: title, date, html_content" },
      { status: 400 },
    );
  }

  const newsletter = {
    ...body,
    slug: body.slug || body.date,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb
    .from("newsletters")
    .insert(newsletter)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
