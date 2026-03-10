import Link from "next/link";
import { Article } from "@/lib/types";
import { JOURNALISTS } from "@/lib/journalists";
import { readingTime } from "@/lib/utils";
import JournalistIcon from "./JournalistIcon";

interface ArticleCardProps {
  article: Article;
  variant?: "hero" | "featured" | "compact";
}

export default function ArticleCard({
  article,
  variant = "compact",
}: ArticleCardProps) {
  const journalist = JOURNALISTS[article.journalist];
  if (!journalist) return null;

  if (variant === "hero") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block relative overflow-hidden rounded-lg border border-border hover:border-border-hover transition-all duration-300"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${journalist.color}30, transparent 60%)`,
          }}
        />
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: `${journalist.color}20`,
                color: journalist.color,
              }}
            >
              <JournalistIcon icon={journalist.icon} size={16} />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: journalist.color }}
              >
                {journalist.name}
              </span>
              <span className="text-text-faint">·</span>
              <span className="text-xs text-text-muted font-mono">
                {readingTime(article.body)}
              </span>
            </div>
          </div>
          <h2 className="font-playfair text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-white transition-colors text-text-primary">
            {article.headline}
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">
            {article.hook}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono text-text-muted bg-bg-primary/50 rounded border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block rounded-lg border border-border hover:border-border-hover p-6 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${journalist.color}08, transparent 60%)`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${journalist.color}20`,
              color: journalist.color,
            }}
          >
            <JournalistIcon icon={journalist.icon} size={12} />
          </div>
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider"
            style={{ color: journalist.color }}
          >
            {journalist.name}
          </span>
        </div>
        <h3 className="font-playfair text-xl font-bold leading-snug mb-2 group-hover:text-white transition-colors text-text-primary">
          {article.headline}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {article.hook}
        </p>
        <span className="inline-block mt-3 text-xs font-mono text-text-muted">
          {readingTime(article.body)}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 py-4 border-b border-border last:border-0 hover:bg-bg-elevated/50 -mx-2 px-2 rounded transition-colors"
    >
      <div
        className="w-1 rounded-full shrink-0 mt-1"
        style={{ backgroundColor: journalist.color }}
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: journalist.color }}
          >
            {journalist.name.split(" ")[0]}
          </span>
          <span className="text-text-faint text-xs">·</span>
          <span className="text-xs text-text-muted font-mono">
            {readingTime(article.body)}
          </span>
        </div>
        <h3 className="font-playfair text-base font-bold leading-snug group-hover:text-white transition-colors text-text-primary">
          {article.headline}
        </h3>
      </div>
    </Link>
  );
}
