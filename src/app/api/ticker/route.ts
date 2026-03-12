import { NextResponse } from "next/server";
import { fetchRSSFeeds, TickerItem } from "@/lib/rss-feeds";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 1800;

export async function GET() {
  const [externalItems, internalItems] = await Promise.all([
    fetchRSSFeeds(5),
    getInternalArticles(),
  ]);

  const merged = mergeAndInterleave(externalItems, internalItems);

  return NextResponse.json(merged, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}

async function getInternalArticles(): Promise<TickerItem[]> {
  const sb = supabaseAdmin();
  if (!sb) return [];

  const { data } = await sb
    .from("articles")
    .select("headline, slug, date, journalist")
    .order("date", { ascending: false })
    .limit(3);

  if (!data) return [];

  return data.map((a) => ({
    title: a.headline,
    url: `/article/${a.slug}`,
    source: "AI Business Dispatch",
    published: a.date,
    isInternal: true,
  }));
}

function mergeAndInterleave(
  external: TickerItem[],
  internal: TickerItem[],
): TickerItem[] {
  if (internal.length === 0) return external;

  const result: TickerItem[] = [];
  let internalIdx = 0;

  for (let i = 0; i < external.length; i++) {
    if (i > 0 && i % 5 === 0 && internalIdx < internal.length) {
      result.push(internal[internalIdx++]);
    }
    result.push(external[i]);
  }

  while (internalIdx < internal.length) {
    result.push(internal[internalIdx++]);
  }

  return result;
}
