import { getArticles } from "@/lib/data";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import JournalistProfiles from "@/components/JournalistProfiles";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "AI Business Dispatch — Intelligence for the AI-Augmented Enterprise",
  description:
    "Today's sharpest AI business analysis. Eight specialist journalists deliver daily intelligence on risks, opportunities, strategy, finance, SaaS, creative and technical deep-dives.",
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
      "Intelligence for the AI-Augmented Enterprise. Eight specialist journalists, daily analysis.",
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

  return (
    <>
      <WebSiteJsonLd />
      <Masthead />

      <main className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        {heroArticle && (
          <section className="py-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
                Lead Story
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <ArticleCard article={heroArticle} variant="hero" />
          </section>
        )}

        {/* Perspective Grid */}
        {perspectiveArticles.length > 0 && (
          <section className="py-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
                Today&apos;s Perspectives
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
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

        {/* Newsletter CTA */}
        <NewsletterSignup />

        {/* Sector Intelligence */}
        {remainingArticles.length > 0 && (
          <section className="py-8">
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

        {/* Journalists */}
        <JournalistProfiles />
      </main>

      <Footer />
    </>
  );
}
