"use client";

import Link from "next/link";
import { useState } from "react";

interface MastheadProps {
  variant?: "default" | "overlay";
}

export default function Masthead({ variant = "default" }: MastheadProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isOverlay = variant === "overlay";

  return (
    <header
      className={
        isOverlay
          ? "absolute top-0 left-0 right-0 z-50"
          : "border-b border-border bg-bg-primary"
      }
    >
      <div className="max-w-7xl mx-auto px-4">
        <div
          className={`flex items-center justify-between py-2 border-b text-xs font-mono ${
            isOverlay
              ? "border-white/10 text-white/60"
              : "border-border text-text-muted"
          }`}
        >
          <span className="tracking-widest uppercase hidden sm:inline">
            Intelligence for the AI-Augmented Enterprise
          </span>
          <span className="sm:hidden tracking-widest uppercase">AIBD</span>
          <span>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="py-4 md:py-6 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <h1
              className={`font-playfair text-2xl md:text-4xl lg:text-5xl font-black tracking-tight ${
                isOverlay ? "text-white" : "text-text-primary"
              }`}
            >
              AI Business Dispatch
            </h1>
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 ${isOverlay ? "text-white" : "text-text-primary"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <nav
            className={`hidden md:flex items-center gap-6 text-sm font-source ${
              isOverlay ? "text-white/80" : "text-text-secondary"
            }`}
          >
            <Link
              href="/"
              className={`hover:${isOverlay ? "text-white" : "text-text-primary"} transition-colors`}
            >
              Today
            </Link>
            <Link
              href="/articles"
              className={`hover:${isOverlay ? "text-white" : "text-text-primary"} transition-colors`}
            >
              Archive
            </Link>
            <Link
              href="/dispatch"
              className={`hover:${isOverlay ? "text-white" : "text-text-primary"} transition-colors`}
            >
              Newsletters
            </Link>
            <Link
              href="/#journalists"
              className={`hover:${isOverlay ? "text-white" : "text-text-primary"} transition-colors`}
            >
              Journalists
            </Link>
            <Link
              href="/#subscribe"
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider border rounded transition-colors ${
                isOverlay
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-border text-text-primary hover:bg-bg-elevated"
              }`}
            >
              Subscribe
            </Link>
          </nav>
        </div>

        {menuOpen && (
          <nav
            className={`md:hidden py-4 border-t space-y-3 ${
              isOverlay
                ? "border-white/10 bg-black/80 backdrop-blur-md -mx-4 px-4"
                : "border-border"
            }`}
          >
            {[
              { href: "/", label: "Today" },
              { href: "/articles", label: "Archive" },
              { href: "/dispatch", label: "Newsletters" },
              { href: "/#journalists", label: "Journalists" },
              { href: "/#subscribe", label: "Subscribe" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm font-source ${
                  isOverlay ? "text-white/80" : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
