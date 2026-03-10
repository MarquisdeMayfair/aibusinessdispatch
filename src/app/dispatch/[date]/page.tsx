import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsletterByDate, getNewsletters } from "@/lib/data";
import { formatDispatchDate } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import type { Newsletter } from "@/lib/types";

const SITE_URL = "https://aibusinessdispatch.com";

export const revalidate = 300;

type PageProps = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const newsletter = await getNewsletterByDate(date);
  if (!newsletter) return {};

  const title = newsletter.seo_title || newsletter.title;
  const description = newsletter.seo_description || newsletter.editorial_intro;
  const url = `${SITE_URL}/dispatch/${newsletter.date}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: newsletter.date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const newsletters = await getNewsletters();
  return newsletters.map((n) => ({ date: n.date }));
}

function NewsletterJsonLd({ newsletter }: { newsletter: Newsletter }) {
  const url = `${SITE_URL}/dispatch/${newsletter.date}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: newsletter.title,
    description: newsletter.editorial_intro,
    datePublished: newsletter.date,
    dateModified: newsletter.created_at || newsletter.date,
    publisher: {
      "@type": "Organization",
      name: "AI Business Dispatch",
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "Periodical",
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

function BreadcrumbJsonLd({ newsletter }: { newsletter: Newsletter }) {
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
        name: "Dispatch Archive",
        item: `${SITE_URL}/dispatch`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: newsletter.title,
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

export default async function DispatchDatePage({ params }: PageProps) {
  const { date } = await params;
  const newsletter = await getNewsletterByDate(date);
  if (!newsletter) notFound();

  return (
    <>
      <NewsletterJsonLd newsletter={newsletter} />
      <BreadcrumbJsonLd newsletter={newsletter} />

      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
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
                href="/dispatch"
                className="hover:text-text-primary transition-colors"
              >
                Archive
              </Link>
            </li>
            <li aria-hidden="true" className="mx-2">/</li>
            <li>{date}</li>
          </ol>
        </nav>

        <header className="mb-10">
          <div className="text-xs font-mono text-text-muted mb-2">
            {formatDispatchDate(newsletter.date)}
          </div>
          <h1 className="font-playfair text-3xl md:text-5xl font-black leading-tight text-text-primary mb-4">
            {newsletter.title}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed italic font-source">
            {newsletter.editorial_intro}
          </p>
        </header>

        <div className="w-16 h-0.5 bg-accent-doom mb-10" />

        <div
          className="prose-dispatch text-text-secondary text-lg leading-relaxed font-source [&_h2]:font-playfair [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mt-10 [&_h2]:mb-4 [&_a]:text-accent-doom [&_a]:underline [&_a]:decoration-border [&_a:hover]:decoration-text-muted"
          dangerouslySetInnerHTML={{ __html: newsletter.html_content }}
        />

        <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
          <Link
            href="/dispatch"
            className="text-sm font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            &larr; All Dispatches
          </Link>
          <Link
            href="/"
            className="text-sm font-mono text-text-muted hover:text-text-primary transition-colors"
          >
            Today&apos;s Articles &rarr;
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
