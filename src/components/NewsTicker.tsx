"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface TickerItem {
  title: string;
  url: string;
  source: string;
  published: string;
  isInternal: boolean;
}

export default function NewsTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ticker")
      .then((r) => r.json())
      .then((data: TickerItem[]) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="border-y border-white/10 bg-black/60 backdrop-blur-sm">
      <div
        className="relative mx-auto max-w-7xl overflow-hidden px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center">
          <div className="z-10 flex-shrink-0 bg-violet-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white">
            Breaking
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div className="absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-black/80 to-transparent" />

            <div
              ref={scrollRef}
              className="flex gap-8 py-2.5"
              style={{
                animation: `ticker-scroll ${Math.max(items.length * 1.8, 15)}s linear infinite`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {doubled.map((item, i) => (
                <TickerLink key={`${item.url}-${i}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function TickerLink({ item }: { item: TickerItem }) {
  const timeAgo = getTimeAgo(item.published);

  const inner = (
    <span className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap text-sm">
      {item.isInternal && (
        <span className="rounded bg-violet-600/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300">
          Dispatch
        </span>
      )}
      <span className={`${item.isInternal ? "font-semibold text-white" : "text-zinc-300"} transition-colors hover:text-white`}>
        {item.title}
      </span>
      <span className="text-zinc-600">·</span>
      <span className="text-xs text-zinc-500">{item.source}</span>
      {timeAgo && (
        <>
          <span className="text-zinc-600">·</span>
          <span className="text-xs text-zinc-600">{timeAgo}</span>
        </>
      )}
    </span>
  );

  if (item.isInternal) {
    return (
      <Link href={item.url} className="flex-shrink-0">
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0"
    >
      {inner}
    </a>
  );
}

function getTimeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = Date.now();
    const diffMs = now - d.getTime();
    if (diffMs < 0 || isNaN(diffMs)) return "";

    const mins = Math.floor(diffMs / 60_000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  } catch {
    return "";
  }
}
