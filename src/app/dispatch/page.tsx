import Link from "next/link";
import { getNewsletters } from "@/lib/data";
import { formatDispatchDate } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

const SITE_URL = "https://aibusinessdispatch.com";

export const metadata: Metadata = {
  title: "Dispatch Archive",
  description:
    "Every edition of the AI Business Dispatch newsletter. Weekly intelligence briefings compiled from eight specialist AI journalists.",
  alternates: { canonical: `${SITE_URL}/dispatch` },
};

export const revalidate = 300;

export default async function DispatchArchivePage() {
  const newsletters = await getNewsletters();

  if (newsletters.length === 0) {
    return (
      <>
        <Masthead />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-text-primary mb-2">
            The Dispatch
          </h1>
          <p className="text-text-secondary mb-10">
            Our weekly intelligence briefing, compiled every Monday.
          </p>
          <div className="text-center py-16">
            <p className="text-text-muted font-mono text-sm">
              No dispatches yet. The first edition is being compiled.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm font-mono text-accent-doom hover:underline"
            >
              &larr; Back to today&apos;s articles
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [latest, ...archive] = newsletters;

  return (
    <>
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-text-primary mb-2">
          The Dispatch
        </h1>
        <p className="text-text-secondary mb-10">
          Our weekly intelligence briefing, compiled every Monday from eight
          specialist correspondents.
        </p>

        {/* Latest / Featured newsletter */}
        <section className="mb-14">
          <div className="text-xs font-mono text-accent-doom tracking-widest uppercase mb-3">
            Latest Edition
          </div>
          <Link
            href={`/dispatch/${latest.date}`}
            className="block rounded-lg border border-border hover:border-accent-doom/40 transition-colors p-6 bg-bg-card"
          >
            <div className="text-xs font-mono text-text-muted mb-2">
              {formatDispatchDate(latest.date)}
              {latest.edition_number && (
                <span className="ml-3 text-text-faint">
                  Edition #{latest.edition_number}
                </span>
              )}
            </div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-text-primary mb-3">
              {latest.title}
            </h2>
            <p className="text-text-secondary leading-relaxed font-source">
              {latest.editorial_intro}
            </p>
            <span className="inline-block mt-4 text-sm font-mono text-accent-doom">
              Read this edition &rarr;
            </span>
          </Link>
        </section>

        {/* Archive */}
        {archive.length > 0 && (
          <section>
            <div className="text-xs font-mono text-text-muted tracking-widest uppercase mb-4">
              Previous Editions
            </div>
            <div className="space-y-3">
              {archive.map((nl) => (
                <Link
                  key={nl.id}
                  href={`/dispatch/${nl.date}`}
                  className="block p-4 rounded-lg border border-border hover:border-border-hover transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-playfair text-lg font-bold text-text-primary truncate">
                        {nl.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                        {nl.editorial_intro}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs font-mono text-text-muted whitespace-nowrap">
                      {formatDispatchDate(nl.date)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
