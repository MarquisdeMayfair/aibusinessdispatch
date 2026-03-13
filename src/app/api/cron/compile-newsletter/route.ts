import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { JOURNALISTS } from "@/lib/journalists";
import { JournalistKey } from "@/lib/types";

const CRON_SECRET = process.env.CRON_SECRET;

function authorize(req: NextRequest): boolean {
  if (!CRON_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${CRON_SECRET}`;
}

const SITE_URL = "https://aibusinessdispatch.com";

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
  const startDate = weekAgo.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  const { data: articles, error } = await sb
    .from("articles")
    .select("*")
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  if (error || !articles || articles.length === 0) {
    return NextResponse.json({
      status: "skipped",
      reason: "No articles found for the past week",
    });
  }

  const dateStr = today.toISOString().split("T")[0];
  const weekNum = Math.ceil(
    (today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (7 * 86_400_000),
  );

  const lead = articles[0];
  const leadJournalist = JOURNALISTS[lead.journalist as JournalistKey];

  let sectionsHtml = "";
  for (const art of articles) {
    const j = JOURNALISTS[art.journalist as JournalistKey];
    const jName = j?.name ?? art.journalist;
    const jColor = j?.color ?? "#666";
    const heroImg = art.image_hero_url || art.image_url;

    sectionsHtml += `
    <tr><td style="padding:24px 0 0 0">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #333;padding-bottom:24px">
        <tr><td>
          ${heroImg ? `<img src="${heroImg}" alt="${art.headline}" style="width:100%;max-height:240px;object-fit:cover;border-radius:8px;margin-bottom:16px" />` : ""}
          <h2 style="margin:0 0 8px 0;font-size:20px;color:#fff">
            <a href="${SITE_URL}/article/${art.slug}" style="color:#fff;text-decoration:none">${art.headline}</a>
          </h2>
          <p style="margin:0 0 8px 0;font-size:13px;color:${jColor};font-weight:600">${jName} · ${art.category || ""}</p>
          <p style="margin:0;font-size:15px;color:#ccc;line-height:1.5">${art.hook || ""}</p>
          <p style="margin:12px 0 0 0">
            <a href="${SITE_URL}/article/${art.slug}" style="color:#8B5CF6;text-decoration:none;font-size:14px">Read full article →</a>
          </p>
        </td></tr>
      </table>
    </td></tr>`;
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;padding:32px 24px">
    <tr><td style="text-align:center;padding-bottom:24px">
      <h1 style="margin:0;font-size:28px;color:#fff;letter-spacing:-0.5px">AI Business Dispatch</h1>
      <p style="margin:8px 0 0 0;font-size:14px;color:#888">Weekly Digest · Edition ${weekNum} · ${dateStr}</p>
    </td></tr>
    <tr><td style="padding:24px;background:#111;border-radius:12px;border:1px solid #222">
      <p style="margin:0 0 4px 0;font-size:12px;color:#8B5CF6;text-transform:uppercase;letter-spacing:1px">Lead Story</p>
      ${lead.image_hero_url || lead.image_url ? `<img src="${lead.image_hero_url || lead.image_url}" alt="${lead.headline}" style="width:100%;border-radius:8px;margin:12px 0" />` : ""}
      <h2 style="margin:0 0 8px 0;font-size:24px;color:#fff">
        <a href="${SITE_URL}/article/${lead.slug}" style="color:#fff;text-decoration:none">${lead.headline}</a>
      </h2>
      <p style="margin:0 0 8px 0;font-size:13px;color:${leadJournalist?.color ?? "#888"};font-weight:600">${leadJournalist?.name ?? lead.journalist}</p>
      <p style="margin:0;font-size:15px;color:#ccc;line-height:1.5">${lead.hook || ""}</p>
      <p style="margin:16px 0 0 0">
        <a href="${SITE_URL}/article/${lead.slug}" style="display:inline-block;padding:10px 24px;background:#8B5CF6;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">Read Lead Story</a>
      </p>
    </td></tr>
    ${sectionsHtml}
    <tr><td style="text-align:center;padding:32px 0 0 0;border-top:1px solid #222;margin-top:24px">
      <p style="margin:0;font-size:13px;color:#666">AI Business Dispatch · Intelligence for the AI-Augmented Enterprise</p>
      <p style="margin:8px 0 0 0;font-size:12px;color:#444">
        <a href="${SITE_URL}" style="color:#8B5CF6;text-decoration:none">Visit the Dispatch</a>
      </p>
    </td></tr>
  </table>
</body></html>`;

  const newsletter = {
    date: dateStr,
    title: `AI Business Dispatch — Week ${weekNum}`,
    edition_number: weekNum,
    editorial_intro: `This week's dispatch features ${articles.length} articles from our editorial team.`,
    lead_article_id: lead.id,
    article_ids: articles.map((a: { id: string }) => a.id),
    html_content: html,
    slug: dateStr,
    seo_title: `AI Business Dispatch — Weekly Digest ${dateStr}`,
    seo_description: `${articles.length} AI business articles from the week of ${startDate} to ${dateStr}.`,
    status: "published",
    created_at: new Date().toISOString(),
  };

  const { data, error: nlError } = await sb
    .from("newsletters")
    .upsert(newsletter, { onConflict: "date" })
    .select()
    .single();

  if (nlError) {
    return NextResponse.json({ error: nlError.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "published",
    newsletter: data?.id,
    articles: articles.length,
    date: dateStr,
  });
}
