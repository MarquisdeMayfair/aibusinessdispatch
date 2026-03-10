import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { supabaseAdmin } from "@/lib/supabase";

const API_SECRET = process.env.API_SECRET;

function authorize(req: NextRequest): boolean {
  if (!API_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${API_SECRET}`;
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 },
    );
  }

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return handleJsonUpload(req, sb);
  }

  if (contentType.includes("multipart/form-data")) {
    return handleFormUpload(req, sb);
  }

  return NextResponse.json(
    { error: "Content-Type must be application/json or multipart/form-data" },
    { status: 400 },
  );
}

async function handleJsonUpload(
  req: NextRequest,
  sb: ReturnType<typeof supabaseAdmin> & object,
) {
  const body = await req.json();
  const { article_id, image_base64, filename, variant } = body as {
    article_id?: string;
    image_base64?: string;
    filename?: string;
    variant?: "hero" | "thumbnail" | "card";
  };

  if (!article_id || !image_base64) {
    return NextResponse.json(
      { error: "Missing article_id or image_base64" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(image_base64, "base64");
  const ext = filename?.split(".").pop() || "png";
  const blobName = `articles/${article_id}/${variant || "hero"}.${ext}`;

  const blob = await put(blobName, buffer, {
    access: "public",
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });

  const fieldMap: Record<string, string> = {
    hero: "image_hero_url",
    thumbnail: "image_thumbnail_url",
    card: "image_url",
  };
  const field = fieldMap[variant || "card"] || "image_url";

  const { error } = await sb
    .from("articles")
    .update({ [field]: blob.url })
    .eq("id", article_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { url: blob.url, field, article_id },
    { status: 201 },
  );
}

async function handleFormUpload(
  req: NextRequest,
  sb: ReturnType<typeof supabaseAdmin> & object,
) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const articleId = form.get("article_id") as string | null;
  const variant = (form.get("variant") as string) || "card";

  if (!file || !articleId) {
    return NextResponse.json(
      { error: "Missing file or article_id" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() || "png";
  const blobName = `articles/${articleId}/${variant}.${ext}`;

  const blob = await put(blobName, file, {
    access: "public",
    contentType: file.type,
  });

  const fieldMap: Record<string, string> = {
    hero: "image_hero_url",
    thumbnail: "image_thumbnail_url",
    card: "image_url",
  };
  const field = fieldMap[variant] || "image_url";

  const { error } = await sb
    .from("articles")
    .update({ [field]: blob.url })
    .eq("id", articleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { url: blob.url, field, article_id: articleId },
    { status: 201 },
  );
}
