import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import { JournalistKey } from "@/lib/types";

const API_SECRET = process.env.API_SECRET;

const JOURNALIST_KEY_MAP: Record<string, JournalistKey> = {
  cassandra: "doom_cassandra",
  aurora: "optimist_prime",
  byte: "tech_leads",
  sterling: "strategy_desk",
  victoria: "secretarial_pool",
  ledger: "money_machine",
  stack: "saas_whisperer",
  prism: "creative_destruction",
  doom_cassandra: "doom_cassandra",
  optimist_prime: "optimist_prime",
  tech_leads: "tech_leads",
  strategy_desk: "strategy_desk",
  secretarial_pool: "secretarial_pool",
  money_machine: "money_machine",
  saas_whisperer: "saas_whisperer",
  creative_destruction: "creative_destruction",
};

const CATEGORY_MAP: Record<string, string> = {
  "LEAD STORY": "risks_warnings",
  "OPTIMIST'S CORNER": "opportunities_growth",
  "DEEP TECH": "technical_deep_dive",
  "STRATEGIC VIEW": "strategy_analysis",
  "BUSINESS SERVICES": "workplace_culture",
  "FINANCE & ACCOUNTANCY": "finance_investment",
  "SOFTWARE & SAAS": "saas_tools",
  "CREATIVE INDUSTRIES": "creative_innovation",
};

function authorize(req: NextRequest): boolean {
  if (!API_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${API_SECRET}`;
}

function normaliseArticle(body: Record<string, unknown>) {
  const journalist =
    JOURNALIST_KEY_MAP[body.journalist as string] ?? "doom_cassandra";

  const category =
    CATEGORY_MAP[body.category as string] ?? (body.category as string) ?? "risks_warnings";

  let sources: unknown = body.sources;
  if (Array.isArray(sources) && sources.length > 0 && typeof sources[0] === "string") {
    sources = (sources as string[]).map((url) => ({ title: url, url }));
  }

  return { journalist, category, sources };
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

  const { journalist, category, sources } = normaliseArticle(body);
  const slug = body.slug || slugify(body.headline);

  const article = {
    ...body,
    journalist,
    category,
    sources,
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
