import Link from "next/link";
import { getArticles } from "@/lib/data";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import JournalistProfiles from "@/components/JournalistProfiles";
import NewsletterSignup from "@/components/NewsletterSignup";
import JournalistIcon from "@/components/JournalistIcon";
import NewsTicker from "@/components/NewsTicker";
import { JOURNALISTS } from "@/lib/journalists";
import { readingTime } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Business Dispatch — Intelligence for the AI-Augmented Enterprise",
  description:
    "Today's sharpest AI business analysis. Nine specialist journalists deliver daily intelligence on risks, opportunities, strategy, finance, SaaS, creative, UK tech and technical deep-dives.",
  alternates: { canonical: "https://aibusinessdispatch.com" },
};

function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Business Dispatch",
    alternateName: "AIBD",
    url: "https://aibusinessdispatch.com",
    description:
      "Intelligence for the AI-Augmented Enterprise. Nine specialist journalists, daily analysis.",
    publisher: {
      "@type": "Organization",
      name: "AI Business Dispatch",
      url: "https://aibusinessdispatch.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://aibusinessdispatch.com/articles?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const articles = await getArticles();

  const heroArticle = articles[0];
  const perspectiveArticles = articles.slice(1, 5);
  const remainingArticles = articles.slice(5);

  const heroJournalist = heroArticle
    ? JOURNALISTS[heroArticle.journalist]
    : null;

  const heroImg = heroArticle
    ? heroArticle.image_hero_url || heroArticle.image_url
    : null;

  return (
    <>
      <WebSiteJsonLd />

      {/* Full-width hero with overlaid masthead */}
      <section className="relative min-h-[85vh] flex flex-col">
        {/* Background */}
        <div className="absolute inset-0">
          {heroImg ? (
            <img
              src={heroImg}
              alt={heroArticle?.headline || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: heroJournalist
                  ? `linear-gradient(135deg, ${heroJournalist.color}20, #0D0D0D 40%, #0D0D0D 70%, ${heroJournalist.color}10)`
                  : "linear-gradient(135deg, #1a1a2e, #0D0D0D)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]/30" />
        </div>

        {/* Overlaid masthead */}
        <Masthead variant="overlay" />

        {/* Hero content pinned to bottom */}
        {heroArticle && heroJournalist && (
          <div className="relative mt-auto px-4 pb-12 md:pb-16 pt-32">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs font-mono tracking-widest uppercase text-white/50 border border-white/20 px-3 py-1 rounded-full">
                    Lead Story
                  </span>
                  <div
                    className="flex items-center gap-2 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${heroJournalist.color}25` }}
                  >
                    <JournalistIcon icon={heroJournalist.icon} size={12} />
                    <span
                      className="text-xs font-mono font-bold uppercase tracking-wider"
                      style={{ color: heroJournalist.color }}
                    >
                      {heroJournalist.name}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/article/${heroArticle.slug}`}
                  className="group block"
                >
                  <h2 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 text-white group-hover:text-white/90 transition-colors">
                    {heroArticle.headline}
                  </h2>
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6">
                    {heroArticle.hook}
                  </p>
                </Link>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/article/${heroArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-mono font-bold uppercase tracking-wider rounded hover:bg-white/90 transition-colors"
                  >
                    Read Story
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <span className="text-xs font-mono text-white/40">
                    {readingTime(heroArticle.body)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Breaking News RSS Ticker */}
      <NewsTicker />

      {/* Hot Topics Ticker */}
      {articles.length > 1 && (
        <div className="bg-bg-elevated border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <span className="text-xs font-mono text-text-muted tracking-widest uppercase shrink-0">
              Hot Topics
            </span>
            <div className="w-px h-4 bg-border shrink-0" />
            {articles.slice(1, 8).map((a) => {
              const j = JOURNALISTS[a.journalist];
              return (
                <Link
                  key={a.id}
                  href={`/article/${a.slug}`}
                  className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors shrink-0"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: j?.color || "#666" }}
                  />
                  <span className="truncate max-w-[200px]">{a.headline}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4">
        {/* Perspective Grid */}
        {perspectiveArticles.length > 0 && (
          <section className="py-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
                Today&apos;s Perspectives
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {perspectiveArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}

        <NewsletterSignup />

        {/* Sector Intelligence */}
        {remainingArticles.length > 0 && (
          <section className="py-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
                Sector Intelligence
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid md:grid-cols-2 gap-x-8">
              <div>
                {remainingArticles
                  .filter((_, i) => i % 2 === 0)
                  .map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
              <div>
                {remainingArticles
                  .filter((_, i) => i % 2 === 1)
                  .map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            </div>
          </section>
        )}

        <JournalistProfiles />
      </main>

      <Footer />
    </>
  );
}
