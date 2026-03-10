import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

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
    .from("articles")
    .select("*")
    .order("date", { ascending: false })
    .limit(50);

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

  if (!body.headline || !body.journalist || !body.body) {
    return NextResponse.json(
      { error: "Missing required fields: headline, journalist, body" },
      { status: 400 },
    );
  }

  const slug = body.slug || slugify(body.headline);
  const article = {
    ...body,
    slug,
    date: body.date || new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb.from("articles").insert(article).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
