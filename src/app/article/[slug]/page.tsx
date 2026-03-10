import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { JOURNALISTS } from "@/lib/journalists";
import { formatArticleDate, readingTime } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import JournalistIcon from "@/components/JournalistIcon";
import ArticleBody from "./ArticleBody";
import type { Metadata } from "next";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.headline} — AI Business Dispatch`,
    description: article.hook,
    openGraph: {
      title: article.headline,
      description: article.hook,
      type: "article",
      publishedTime: article.date,
      authors: [JOURNALISTS[article.journalist]?.name],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const journalist = JOURNALISTS[article.journalist];

  return (
    <>
      <Masthead />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs font-mono text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Dispatch
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: journalist?.color }}>
            {journalist?.name}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {journalist && (
              <>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${journalist.color}20`,
                    color: journalist.color,
                  }}
                >
                  <JournalistIcon icon={journalist.icon} size={20} />
                </div>
                <div>
                  <div
                    className="text-sm font-mono font-bold"
                    style={{ color: journalist.color }}
                  >
                    {journalist.name}
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {journalist.title}
                  </div>
                </div>
              </>
            )}
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl font-black leading-tight mb-4 text-text-primary">
            {article.headline}
          </h1>

          <p className="text-xl text-text-secondary leading-relaxed italic font-source">
            {article.hook}
          </p>

          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-text-muted">
            <span>{formatArticleDate(article.date)}</span>
            <span className="text-text-faint">·</span>
            <span>{readingTime(article.body)}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono text-text-muted bg-bg-card rounded border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Accent divider */}
        <div
          className="w-16 h-0.5 mb-10"
          style={{ backgroundColor: journalist?.color }}
        />

        {/* Body */}
        <ArticleBody body={article.body} />

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
              Sources
            </h3>
            <ul className="space-y-2">
              {article.sources.map((src, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-text-primary transition-colors underline decoration-border hover:decoration-text-muted"
                  >
                    {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="text-sm font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            &larr; Back to Dispatch
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}
