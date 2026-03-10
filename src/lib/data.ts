import { getSupabase } from "./supabase";
import { Article, Newsletter } from "./types";
import { SEED_ARTICLES } from "@/data/seed-articles";

function useSeed(): boolean {
  return !getSupabase();
}

export async function getArticles(): Promise<Article[]> {
  const sb = getSupabase();
  if (!sb) return SEED_ARTICLES;

  const { data, error } = await sb
    .from("articles")
    .select("*")
    .order("date", { ascending: false })
    .limit(50);

  if (error || !data || data.length === 0) return SEED_ARTICLES;
  return data;
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | null> {
  const sb = getSupabase();
  if (!sb) {
    return SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
  }

  const { data, error } = await sb
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return SEED_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  return data;
}

export async function getLatestNewsletter(): Promise<Newsletter | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("newsletters")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getNewsletterByDate(
  date: string,
): Promise<Newsletter | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("newsletters")
    .select("*")
    .eq("date", date)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getNewsletters(): Promise<Newsletter[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("newsletters")
    .select("*")
    .order("date", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return data;
}
