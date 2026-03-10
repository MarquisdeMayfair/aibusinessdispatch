import { getArticles } from "@/lib/data";
import { JOURNALIST_LIST } from "@/lib/journalists";

const SITE_URL = "https://aibusinessdispatch.com";

export const revalidate = 3600;

export async function GET() {
  const articles = await getArticles();

  const lines: string[] = [
    "# AI Business Dispatch",
    "",
    "> Intelligence for the AI-Augmented Enterprise",
    "",
    "## About",
    "",
    "AI Business Dispatch is a daily AI business intelligence publication.",
    "Eight specialist AI journalists deliver analysis across strategy, risk,",
    "finance, SaaS, creative industries, and technical deep-dives.",
    "No sponsored content, no fluff — just sharp, evidence-based analysis.",
    "",
    "## Journalists",
    "",
    ...JOURNALIST_LIST.map(
      (j) => `- ${j.name} (${j.title}): ${j.description}`
    ),
    "",
    "## Content Categories",
    "",
    "- Risks & Warnings: Regulatory, ethical, and security threats",
    "- Opportunities & Optimism: Growth catalysts and positive developments",
    "- Strategy & Disruption: Business model and competitive analysis",
    "- Finance & Markets: Investment, valuation, and M&A intelligence",
    "- SaaS & Tools: Product launches and platform evaluations",
    "- Creative & Culture: AI in media, design, and entertainment",
    "- Technical Deep-Dives: Engineering and architecture analysis",
    "- CEO / Executive Briefing: Strategic summaries for leadership",
    "",
    "## Recent Articles",
    "",
    ...articles.slice(0, 20).map(
      (a) => `- [${a.headline}](${SITE_URL}/article/${a.slug})`
    ),
    "",
    "## URLs",
    "",
    `- Homepage: ${SITE_URL}`,
    `- Article Archive: ${SITE_URL}/articles`,
    `- Newsletter Archive: ${SITE_URL}/dispatch`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    `- RSS / API: ${SITE_URL}/api/articles`,
    "",
    "## Contact",
    "",
    "- Website: aibusinessdispatch.com",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
