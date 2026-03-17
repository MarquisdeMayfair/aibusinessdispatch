import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const job = url.searchParams.get("job");
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 200);

  let query = sb
    .from("cron_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);

  if (job) {
    query = query.eq("job", job);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.length ?? 0, logs: data });
}
