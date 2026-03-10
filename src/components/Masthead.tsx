"use client";

import Link from "next/link";

export default function Masthead() {
  return (
    <header className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 border-b border-border text-xs text-text-muted font-mono">
          <span className="tracking-widest uppercase">
            Intelligence for the AI-Augmented Enterprise
          </span>
          <span>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Logo area */}
        <div className="py-6 text-center">
          <Link href="/" className="inline-block">
            {/* Logo placeholder — replace with actual logo */}
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-primary">
              AI Business Dispatch
            </h1>
          </Link>
          <div className="mt-2 flex items-center justify-center gap-6 text-xs font-mono text-text-muted tracking-widest uppercase">
            <span>8 Perspectives</span>
            <span className="text-text-faint">|</span>
            <span>Daily Intelligence</span>
            <span className="text-text-faint">|</span>
            <span>Zero Fluff</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center justify-center gap-8 py-3 text-sm font-source text-text-secondary">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Today&apos;s Dispatch
          </Link>
          <Link
            href="/dispatch"
            className="hover:text-text-primary transition-colors"
          >
            Archive
          </Link>
          <Link
            href="/#journalists"
            className="hover:text-text-primary transition-colors"
          >
            Our Journalists
          </Link>
          <Link
            href="/#subscribe"
            className="hover:text-text-primary transition-colors"
          >
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
