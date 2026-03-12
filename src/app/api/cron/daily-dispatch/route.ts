import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { todaysJournalist, journalistArticleId } from "@/lib/rotation";
import { getJournalistPrompt } from "@/lib/journalist-prompts";
import { slugify } from "@/lib/utils";
import { supabaseAdmin } from "@/lib/supabase";

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

export const maxDuration = 120;

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

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const journalistKey = todaysJournalist(now);
  const articleId = journalistArticleId(journalistKey, now);
  const promptData = getJournalistPrompt(journalistKey);

  const { data: existing } = await sb
    .from("articles")
    .select("id, image_hero_url, image_prompt")
    .eq("id", articleId)
    .maybeSingle();

  if (existing && existing.image_hero_url) {
    return NextResponse.json({
      status: "skipped",
      reason: "Article already exists for today",
      articleId,
      journalist: journalistKey,
    });
  }

  if (existing && !existing.image_hero_url && process.env.XAI_API_KEY) {
    try {
      const imgResult = await generateImage(
        articleId,
        (existing.image_prompt as string) || promptData.name,
        promptData.imageStylePrefix,
        sb,
      );
      return NextResponse.json({
        status: "image_repaired",
        articleId,
        journalist: journalistKey,
        image: imgResult,
      });
    } catch (err) {
      return NextResponse.json({
        status: "image_repair_failed",
        articleId,
        journalist: journalistKey,
        error: String(err),
      });
    }
  }

  const userMessage = `Today is ${dateStr}. Research and write today's article. Use web search to find a fresh, real story from the last 48 hours that fits your beat. Return ONLY the JSON article object — no commentary, no markdown fences, just the JSON.`;

  let claudeResponse: ClaudeResponse;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
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
      return NextResponse.json(
        { error: "Claude API error", status: res.status, body: errBody },
        { status: 502 },
      );
    }

    claudeResponse = await res.json();
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to call Claude API", detail: String(err) },
      { status: 502 },
    );
  }

  const textBlocks = claudeResponse.content
    .filter((c: ClaudeContent) => c.type === "text" && c.text)
    .map((c: ClaudeContent) => c.text!)
    .join("\n");

  const article = extractJSON(textBlocks);

  if (!article) {
    return NextResponse.json(
      { error: "Could not parse article JSON from Claude", raw: textBlocks.slice(0, 2000) },
      { status: 500 },
    );
  }

  if (article.status === "ABORTED") {
    return NextResponse.json({
      status: "aborted",
      journalist: journalistKey,
      reason: article.reason,
      searches: article.searches_attempted,
    });
  }

  const slug = slugify(article.headline as string);
  const record = {
    ...article,
    id: articleId,
    journalist: journalistKey,
    date: dateStr,
    slug,
    status: "published",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await sb
    .from("articles")
    .upsert(record, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message, article: record }, { status: 500 });
  }

  const results: Record<string, unknown> = {
    status: "published",
    articleId,
    journalist: journalistKey,
    headline: article.headline,
    slug,
  };

  if (process.env.XAI_API_KEY && article.image_prompt) {
    try {
      const imgResult = await generateImage(
        articleId,
        article.image_prompt as string,
        promptData.imageStylePrefix,
        sb,
      );
      results.image = imgResult;
    } catch (err) {
      results.imageError = String(err);
    }
  }

  return NextResponse.json(results);
}

async function generateImage(
  articleId: string,
  prompt: string,
  stylePrefix: string,
  sb: ReturnType<typeof supabaseAdmin>,
): Promise<{ url: string }> {
  const XAI_API_KEY = process.env.XAI_API_KEY!;
  const fullPrompt = `${stylePrefix} ${prompt}. Editorial magazine illustration, high quality, detailed.`;

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

  if (sb) {
    await sb
      .from("articles")
      .update({ image_hero_url: blob.url, image_url: blob.url })
      .eq("id", articleId);
  }

  return { url: blob.url };
}
