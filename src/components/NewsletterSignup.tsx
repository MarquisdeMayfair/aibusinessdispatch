"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="subscribe" className="max-w-7xl mx-auto px-4 py-16">
      <div className="rounded-lg border border-border p-8 md:p-12 text-center bg-[linear-gradient(135deg,#E6394610,transparent_60%)]">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-text-primary mb-3">
          The Daily Dispatch
        </h2>
        <p className="text-text-secondary max-w-xl mx-auto mb-8">
          Eight perspectives on the most important AI business story of the
          day. Delivered to your inbox every morning. Free, forever.
        </p>

        {status === "success" ? (
          <div className="text-accent-optimist font-mono text-sm">
            You&apos;re in. First dispatch arrives tomorrow morning.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-bg-primary border border-border rounded px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-border-hover font-mono"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-accent-doom text-white text-sm font-mono font-bold rounded hover:bg-accent-doom/90 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-xs text-accent-doom font-mono">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="mt-4 text-xs text-text-faint font-mono">
          No spam. No sponsored content. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
