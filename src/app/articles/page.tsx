import Link from "next/link";
import { getArticles } from "@/lib/data";
import { JOURNALISTS } from "@/lib/journalists";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import JournalistIcon from "@/components/JournalistIcon";
import type { Metadata } from "next";

const SITE_URL = "https://aibusinessdispatch.com";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Article Archive",
  description:
    "Browse the complete AI Business Dispatch article archive. Search by journalist, topic, or keyword across strategy, risk, finance, SaaS, creative, and technical deep-dives.",
  alternates: { canonical: `${SITE_URL}/articles` },
};

function ArchiveJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Business Dispatch — Article Archive",
    url: `${SITE_URL}/articles`,
    description:
      "Complete archive of AI Business Dispatch articles — strategy, risk, finance, SaaS, creative, and technical analysis.",
    isPartOf: {
      "@type": "WebSite",
      name: "AI Business Dispatch",
      url: SITE_URL,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { q, journalist } = await searchParams;
  const allArticles = await getArticles();

  let filtered = allArticles;

  if (journalist) {
    filtered = filtered.filter((a) => a.journalist === journalist);
  }
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.headline.toLowerCase().includes(lower) ||
        a.hook.toLowerCase().includes(lower) ||
        a.tags.some((t) => t.toLowerCase().includes(lower)) ||
        a.body?.toLowerCase().includes(lower)
    );
  }

  return (
    <>
      <ArchiveJsonLd />
      <Masthead />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          {journalist && JOURNALISTS[journalist as keyof typeof JOURNALISTS] ? (
            (() => {
              const j = JOURNALISTS[journalist as keyof typeof JOURNALISTS];
              return (
                <>
                  <Link
                    href="/articles"
                    className="inline-flex items-center gap-1 text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-4"
                  >
                    ← All articles
                  </Link>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${j.color}20`,
                        color: j.color,
                      }}
                    >
                      <JournalistIcon icon={j.icon} size={28} />
                    </div>
                    <div>
                      <h1
                        className="font-playfair text-3xl md:text-4xl font-black"
                        style={{ color: j.color }}
                      >
                        {j.name}
                      </h1>
                      <p className="text-sm text-text-muted font-mono">
                        {j.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-secondary mb-2">{j.description}</p>
                  <p className="text-text-muted text-sm font-mono">
                    {filtered.length} article
                    {filtered.length !== 1 ? "s" : ""} published
                  </p>
                </>
              );
            })()
          ) : (
            <>
              <h1 className="font-playfair text-3xl md:text-4xl font-black text-text-primary mb-2">
                Article Archive
              </h1>
              <p className="text-text-secondary font-source">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
                {q ? ` matching "${q}"` : ""}
              </p>
            </>
          )}
        </div>

        {/* Search */}
        <form method="get" action="/articles" className="mb-10">
          <div className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={q || ""}
              placeholder="Search articles..."
              className="flex-1 px-4 py-2 rounded border border-border bg-bg-card text-text-primary font-mono text-sm focus:outline-none focus:ring-1 focus:ring-text-muted"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded bg-bg-card border border-border text-text-primary font-mono text-sm hover:bg-bg-surface transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted font-mono">
            <p className="text-lg mb-2">No articles found</p>
            <p className="text-sm">Try a different search term or browse all articles.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
