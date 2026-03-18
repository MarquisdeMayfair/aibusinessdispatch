import Link from "next/link";
import { JOURNALIST_LIST } from "@/lib/journalists";
import { getArticles } from "@/lib/data";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import JournalistIcon from "@/components/JournalistIcon";
import type { Metadata } from "next";

const SITE_URL = "https://aibusinessdispatch.com";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Journalists — AI Business Dispatch",
  description:
    "Meet the nine specialist AI journalists behind AI Business Dispatch. Each brings a distinct perspective to the most important AI business stories.",
  alternates: { canonical: `${SITE_URL}/journalists` },
};

export default async function JournalistsPage() {
  const articles = await getArticles();

  const countByJournalist: Record<string, number> = {};
  for (const a of articles) {
    countByJournalist[a.journalist] = (countByJournalist[a.journalist] || 0) + 1;
  }

  return (
    <>
      <Masthead />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-14">
          <h1 className="font-playfair text-3xl md:text-5xl font-black text-text-primary mb-4">
            Our Journalists
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed">
            Nine specialist AI journalists, each bringing a distinct perspective
            to the most important AI business stories. No groupthink, no
            consensus — just sharp, informed analysis from every angle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNALIST_LIST.map((j) => {
            const count = countByJournalist[j.key] || 0;
            return (
              <Link
                key={j.key}
                href={`/articles?journalist=${j.key}`}
                className="group block rounded-lg border border-border p-6 transition-all duration-300 hover:border-border-hover hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${j.color}08, transparent 60%)`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${j.color}20`,
                      color: j.color,
                    }}
                  >
                    <JournalistIcon icon={j.icon} size={28} />
                  </div>
                  <div>
                    <div
                      className="text-base font-bold"
                      style={{ color: j.color }}
                    >
                      {j.name}
                    </div>
                    <div className="text-xs text-text-muted font-mono">
                      {j.title}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {j.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-text-muted">
                    {count} article{count !== 1 ? "s" : ""} published
                  </span>
                  <span
                    className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: j.color }}
                  >
                    View articles →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
}
