import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { JOURNALISTS } from "@/lib/journalists";
import { formatArticleDate, readingTime } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import JournalistIcon from "@/components/JournalistIcon";
import ArticleBody from "./ArticleBody";
import ShareButtons from "@/components/ShareButtons";
import type { Metadata } from "next";
import type { Article } from "@/lib/types";

const SITE_URL = "https://aibusinessdispatch.com";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const journalist = JOURNALISTS[article.journalist];
  const title = article.meta_title || article.headline;
  const description = article.meta_description || article.hook;
  const url = `${SITE_URL}/article/${article.slug}`;
  const images = article.image_hero_url || article.image_url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.created_at,
      authors: journalist ? [journalist.name] : undefined,
      section: article.category,
      tags: article.tags,
      ...(images ? { images: [{ url: images, width: 1200, height: 630, alt: article.headline }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: [images] } : {}),
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

function ArticleJsonLd({ article }: { article: Article }) {
  const journalist = JOURNALISTS[article.journalist];
  const url = `${SITE_URL}/article/${article.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: article.headline,
    description: article.hook,
    datePublished: article.date,
    dateModified: article.created_at,
    author: {
      "@type": "Person",
      name: journalist?.name || article.journalist_name || "AI Business Dispatch",
      jobTitle: journalist?.title || article.journalist_title,
    },
    publisher: {
      "@type": "Organization",
      name: "AI Business Dispatch",
      url: SITE_URL,
    },
    articleSection: article.category,
    keywords: article.tags?.join(", "),
    wordCount: article.body?.split(/\s+/).length,
    ...(article.image_hero_url || article.image_url
      ? {
          image: {
            "@type": "ImageObject",
            url: article.image_hero_url || article.image_url,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbJsonLd({ article }: { article: Article }) {
  const journalist = JOURNALISTS[article.journalist];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: `${SITE_URL}/articles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: journalist?.name || article.journalist,
        item: `${SITE_URL}/articles?journalist=${article.journalist}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.headline,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const journalist = JOURNALISTS[article.journalist];

  return (
    <>
      <ArticleJsonLd article={article} />
      <BreadcrumbJsonLd article={article} />

      <Masthead />

      <article className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-xs font-mono text-text-muted"
        >
          <ol className="flex items-center gap-0">
            <li>
              <Link href="/" className="hover:text-text-primary transition-colors">
                Dispatch
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <Link
                href="/articles"
                className="hover:text-text-primary transition-colors"
              >
                Articles
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>
              <span style={{ color: journalist?.color }}>
                {journalist?.name}
              </span>
            </li>
          </ol>
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
            <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
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

          <div className="mt-6">
            <ShareButtons
              url={`${SITE_URL}/article/${article.slug}`}
              title={article.headline}
            />
          </div>
        </header>

        {/* Hero image */}
        {(article.image_hero_url || article.image_url) && (
          <figure className="mb-10 rounded-lg overflow-hidden">
            <img
              src={article.image_hero_url || article.image_url!}
              alt={article.headline}
              className="w-full h-auto"
              loading="eager"
            />
          </figure>
        )}

        {/* Accent divider */}
        <div
          className="w-16 h-0.5 mb-10"
          style={{ backgroundColor: journalist?.color }}
        />

        {/* Body */}
        <ArticleBody body={article.body} />

        {/* Share (bottom) */}
        <div className="mt-10 pt-8 border-t border-border">
          <ShareButtons
            url={`${SITE_URL}/article/${article.slug}`}
            title={article.headline}
          />
        </div>

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
              Sources
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              {article.sources.map((src, i) => {
                const label = src.title || src.name || src.url;
                const displayLabel = label.startsWith("http")
                  ? new URL(label).hostname.replace("www.", "")
                  : label;
                return (
                  <li key={i} className="text-sm text-text-muted">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-text-primary transition-colors underline decoration-border hover:decoration-text-muted"
                    >
                      {displayLabel}
                    </a>
                  </li>
                );
              })}
            </ol>
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
