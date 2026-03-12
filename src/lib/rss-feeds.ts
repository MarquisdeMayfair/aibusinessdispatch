export interface RSSFeedSource {
  name: string;
  url: string;
  category: "ai" | "tech" | "business";
}

export const RSS_SOURCES: RSSFeedSource[] = [
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "ai" },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "ai" },
  { name: "Ars Technica AI", url: "https://feeds.arstechnica.com/arstechnica/technology-lab", category: "tech" },
  { name: "MIT Technology Review", url: "https://www.technologyreview.com/feed/", category: "ai" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", category: "ai" },
  { name: "Reuters Technology", url: "https://www.rss.app/feeds/tsGhG9aTZ7P9Ug9p.xml", category: "business" },
];

export interface TickerItem {
  title: string;
  url: string;
  source: string;
  published: string;
  isInternal: boolean;
}

function extractCDATA(raw: string): string {
  const m = raw.match(/<!\[CDATA\[(.*?)\]\]>/s);
  return m ? m[1].trim() : raw.replace(/<[^>]+>/g, "").trim();
}

function parseRSSItems(xml: string, sourceName: string): TickerItem[] {
  const items: TickerItem[] = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/);
    const pubDateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/);

    if (!titleMatch || !linkMatch) continue;

    items.push({
      title: extractCDATA(titleMatch[1]),
      url: extractCDATA(linkMatch[1]),
      source: sourceName,
      published: pubDateMatch ? extractCDATA(pubDateMatch[1]) : new Date().toISOString(),
      isInternal: false,
    });
  }

  return items;
}

export async function fetchRSSFeeds(maxPerSource = 5): Promise<TickerItem[]> {
  const allItems: TickerItem[] = [];

  const results = await Promise.allSettled(
    RSS_SOURCES.map(async (source) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(source.url, {
          signal: controller.signal,
          headers: { "User-Agent": "AI-Business-Dispatch/1.0 (RSS Reader)" },
          next: { revalidate: 1800 },
        });

        if (!res.ok) return [];
        const xml = await res.text();
        return parseRSSItems(xml, source.name).slice(0, maxPerSource);
      } catch {
        return [];
      } finally {
        clearTimeout(timeout);
      }
    }),
  );

  for (const r of results) {
    if (r.status === "fulfilled") allItems.push(...r.value);
  }

  allItems.sort((a, b) => {
    const da = new Date(a.published).getTime() || 0;
    const db = new Date(b.published).getTime() || 0;
    return db - da;
  });

  return allItems.slice(0, 30);
}
