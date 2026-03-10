import { getArticles, getNewsletters } from "@/lib/data";
import type { MetadataRoute } from "next";

const SITE_URL = "https://aibusinessdispatch.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, newsletters] = await Promise.all([
    getArticles(),
    getNewsletters(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dispatch`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/article/${a.slug}`,
    lastModified: new Date(a.created_at || a.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsletterPages: MetadataRoute.Sitemap = (newsletters ?? []).map((n) => ({
    url: `${SITE_URL}/dispatch/${n.date}`,
    lastModified: new Date(n.created_at || n.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages, ...newsletterPages];
}
