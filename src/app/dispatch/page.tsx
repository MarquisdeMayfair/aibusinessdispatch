import Link from "next/link";
import { getNewsletters } from "@/lib/data";
import { formatDispatchDate } from "@/lib/utils";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispatch Archive — AI Business Dispatch",
  description: "Browse past editions of the AI Business Dispatch.",
};

export const revalidate = 300;

export default async function DispatchArchivePage() {
  const newsletters = await getNewsletters();

  return (
    <>
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-text-primary mb-2">
          Dispatch Archive
        </h1>
        <p className="text-text-secondary mb-10">
          Every edition of the AI Business Dispatch, indexed and searchable.
        </p>

        {newsletters.length === 0 ? (
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
        ) : (
          <div className="space-y-3">
            {newsletters.map((nl) => (
              <Link
                key={nl.id}
                href={`/dispatch/${nl.date}`}
                className="block p-4 rounded-lg border border-border hover:border-border-hover transition-colors"
              >
                <div className="text-xs font-mono text-text-muted mb-1">
                  {formatDispatchDate(nl.date)}
                </div>
                <h2 className="font-playfair text-lg font-bold text-text-primary">
                  {nl.title}
                </h2>
                <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                  {nl.editorial_intro}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
