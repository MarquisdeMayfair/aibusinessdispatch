import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import {
  todaysJournalist,
  journalistArticleId,
  isSunday,
  SUNDAY_JOURNALISTS,
} from "@/lib/rotation";
import { getJournalistPrompt } from "@/lib/journalist-prompts";
import { slugify } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase";
import { JournalistKey } from "@/lib/types";
import { CronLogger } from "@/lib/cron-logger";

const CRON_SECRET = process.env.CRON_SECRET;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function authorize(req: NextRequest): boolean {
  if (!CRON_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${CRON_SECRET}`;
}

interface ClaudeContent {
  type: string;
  text?: string;
}

interface ClaudeResponse {
  content: ClaudeContent[];
  stop_reason: string;
}

function extractJSON(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : text.trim();
  try {
    return JSON.parse(raw);
  } catch {
    const braceMatch = raw.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try { return JSON.parse(braceMatch[0]); } catch { /* fall through */ }
    }
    return null;
  }
}

export const maxDuration = 300;

type SB = NonNullable<ReturnType<typeof supabaseAdmin>>;

interface ArticleResult {
  journalist: JournalistKey;
  articleId: string;
  status: string;
  headline?: string;
  slug?: string;
  image?: { url: string };
  imageError?: string;
  error?: string;
  reason?: string;
}

async function processJournalist(
  key: JournalistKey,
  dateStr: string,
  sb: SB,
): Promise<ArticleResult> {
  const articleId = journalistArticleId(key, new Date(dateStr + "T00:00:00Z"));
  const promptData = getJournalistPrompt(key);

  const { data: existing } = await sb
    .from("articles")
    .select("id, image_hero_url, image_prompt")
    .eq("id", articleId)
    .maybeSingle();

  if (existing && existing.image_hero_url) {
    return { journalist: key, articleId, status: "skipped" };
  }

  if (existing && !existing.image_hero_url && process.env.XAI_API_KEY) {
    try {
      const img = await generateImage(
        articleId,
        (existing.image_prompt as string) || promptData.name,
        promptData.imageStylePrefix,
        sb,
      );
      return { journalist: key, articleId, status: "image_repaired", image: img };
    } catch (err) {
      return { journalist: key, articleId, status: "image_repair_failed", imageError: String(err) };
    }
  }

  const userMessage = `Today is ${dateStr}. Research and write today's article. Use web search to find a fresh, real story from the last 48 hours that fits your beat. Return ONLY the JSON article object — no commentary, no markdown fences, just the JSON.`;

  let claudeResponse: ClaudeResponse;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 10,
          },
        ],
        system: promptData.systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { journalist: key, articleId, status: "claude_error", error: `${res.status}: ${errBody.slice(0, 500)}` };
    }

    claudeResponse = await res.json();
  } catch (err) {
    return { journalist: key, articleId, status: "claude_error", error: String(err) };
  }

  const textBlocks = claudeResponse.content
    .filter((c: ClaudeContent) => c.type === "text" && c.text)
    .map((c: ClaudeContent) => c.text!)
    .join("\n");

  const article = extractJSON(textBlocks);

  if (!article) {
    return { journalist: key, articleId, status: "parse_error", error: textBlocks.slice(0, 500) };
  }

  if (article.status === "ABORTED") {
    return { journalist: key, articleId, status: "aborted", reason: article.reason as string };
  }

  const slug = slugify(article.headline as string);

  const rawSources = (article.sources as Array<Record<string, string>>) || [];
  const normalizedSources = rawSources.map((s) => ({
    title: s.title || s.name || s.url || "Source",
    url: s.url || "",
  }));

  const record = {
    ...article,
    id: articleId,
    journalist: key,
    date: dateStr,
    slug,
    sources: normalizedSources,
    status: "published",
    created_at: new Date().toISOString(),
  };

  const { error } = await sb
    .from("articles")
    .upsert(record, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return { journalist: key, articleId, status: "db_error", error: error.message };
  }

  const result: ArticleResult = {
    journalist: key,
    articleId,
    status: "published",
    headline: article.headline as string,
    slug,
  };

  if (process.env.XAI_API_KEY && article.image_prompt) {
    try {
      result.image = await generateImage(
        articleId,
        article.image_prompt as string,
        promptData.imageStylePrefix,
        sb,
      );
    } catch (err) {
      result.imageError = String(err);
    }
  }

  return result;
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const logger = new CronLogger(sb, "daily-dispatch");
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];

  const forceJournalist = req.nextUrl.searchParams.get("journalist") as JournalistKey | null;

  try {
    if (forceJournalist) {
      const result = await processJournalist(forceJournalist, dateStr, sb);
      await logger.log({
        status: result.status,
        journalist: forceJournalist,
        article_id: result.articleId,
        headline: result.headline,
        detail: { date: dateStr, slug: result.slug, forced: true, imageError: result.imageError },
        error: result.error,
      });
      return NextResponse.json(result);
    }

    if (isSunday(now)) {
      const results: ArticleResult[] = [];
      for (const key of SUNDAY_JOURNALISTS) {
        const r = await processJournalist(key, dateStr, sb);
        results.push(r);
        await logger.log({
          status: r.status,
          journalist: key,
          article_id: r.articleId,
          headline: r.headline,
          detail: { day: "sunday", date: dateStr, imageError: r.imageError },
          error: r.error,
        });
      }
      return NextResponse.json({ day: "sunday", date: dateStr, results });
    }

    const key = todaysJournalist(now);
    const result = await processJournalist(key, dateStr, sb);

    await logger.log({
      status: result.status,
      journalist: key,
      article_id: result.articleId,
      headline: result.headline,
      detail: { date: dateStr, slug: result.slug, imageError: result.imageError },
      error: result.error,
    });

    return NextResponse.json(result);
  } catch (err) {
    await logger.log({
      status: "fatal_error",
      error: String(err),
      detail: { date: dateStr },
    });
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

async function generateImage(
  articleId: string,
  prompt: string,
  stylePrefix: string,
  sb: SB,
): Promise<{ url: string }> {
  const XAI_API_KEY = process.env.XAI_API_KEY!;
  const fullPrompt = `${stylePrefix} ${prompt}. Editorial magazine illustration, high quality, detailed. CRITICAL: Do NOT include any text, words, letters, numbers, logos, brand names, labels, captions, watermarks, or typography anywhere in the image. The image must be purely visual with zero readable characters.`;

  const xaiRes = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-imagine-image",
      prompt: fullPrompt,
      n: 1,
      response_format: "b64_json",
      aspect_ratio: "16:9",
    }),
  });

  if (!xaiRes.ok) {
    const errText = await xaiRes.text();
    throw new Error(`xAI image API error ${xaiRes.status}: ${errText.slice(0, 500)}`);
  }

  const xaiData = await xaiRes.json();
  const b64 = xaiData.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data in xAI response");

  const buffer = Buffer.from(b64, "base64");
  const blobName = `articles/${articleId}/hero.png`;

  const blob = await put(blobName, buffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  await sb
    .from("articles")
    .update({ image_hero_url: blob.url, image_url: blob.url })
    .eq("id", articleId);

  return { url: blob.url };
}
