import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsletterByDate } from "@/lib/data";
import { formatDispatchDate } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const revalidate = 300;

type PageProps = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const newsletter = await getNewsletterByDate(date);
  if (!newsletter) return {};

  return {
    title: newsletter.seo_title,
    description: newsletter.seo_description,
  };
}

export default async function DispatchDatePage({ params }: PageProps) {
  const { date } = await params;
  const newsletter = await getNewsletterByDate(date);
  if (!newsletter) notFound();

  return (
    <>
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="mb-8 text-xs font-mono text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Dispatch
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/dispatch"
            className="hover:text-text-primary transition-colors"
          >
            Archive
          </Link>
          <span className="mx-2">/</span>
          <span>{date}</span>
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
