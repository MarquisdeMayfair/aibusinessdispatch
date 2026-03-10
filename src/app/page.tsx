import { getArticles } from "@/lib/data";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import JournalistProfiles from "@/components/JournalistProfiles";
import NewsletterSignup from "@/components/NewsletterSignup";

export const revalidate = 300; // revalidate every 5 minutes

export default async function HomePage() {
  const articles = await getArticles();

  const heroArticle = articles[0];
  const perspectiveArticles = articles.slice(1, 5);
  const remainingArticles = articles.slice(5);

  return (
    <>
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
