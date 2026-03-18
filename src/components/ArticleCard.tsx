import Link from "next/link";
import { Article } from "@/lib/types";
import { JOURNALISTS } from "@/lib/journalists";
import { readingTime } from "@/lib/utils";
import JournalistIcon from "./JournalistIcon";
import JournalistLink from "./JournalistLink";

interface ArticleCardProps {
  article: Article;
  variant?: "hero" | "featured" | "compact";
}

function ArticleImage({
  src,
  alt,
  color,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  color: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`object-cover w-full h-full ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={`w-full h-full ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}25, #0D0D0D 60%, ${color}10)`,
      }}
    />
  );
}

export default function ArticleCard({
  article,
  variant = "compact",
}: ArticleCardProps) {
  const journalist = JOURNALISTS[article.journalist];
  if (!journalist) return null;

  if (variant === "hero") {
    const heroImg = article.image_hero_url || article.image_url;
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block relative overflow-hidden rounded-lg"
        style={{ minHeight: "520px" }}
      >
        <div className="absolute inset-0">
          <ArticleImage
            src={heroImg}
            alt={article.headline}
            color={journalist.color}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `linear-gradient(135deg, ${journalist.color}30, transparent 60%)`,
            }}
          />
        </div>

        <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: `${journalist.color}30`,
                color: journalist.color,
              }}
            >
              <JournalistIcon icon={journalist.icon} size={16} />
            </div>
            <div className="flex items-center gap-2">
              <JournalistLink
                journalistKey={journalist.key}
                name={journalist.name}
                color={journalist.color}
                className="text-xs font-mono font-bold uppercase tracking-wider"
              />
              <span className="text-text-faint">·</span>
              <span className="text-xs text-text-muted font-mono">
                {readingTime(article.body)}
              </span>
            </div>
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-white transition-colors text-text-primary drop-shadow-lg">
            {article.headline}
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed max-w-3xl drop-shadow-md">
            {article.hook}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-mono text-text-muted bg-black/50 backdrop-blur-sm rounded border border-white/10"
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
    const cardImg = article.image_url || article.image_thumbnail_url;
    return (
      <Link
        href={`/article/${article.slug}`}
        className="group block rounded-lg border border-border hover:border-border-hover overflow-hidden transition-all duration-300"
      >
        <div className="relative h-48 overflow-hidden">
          <ArticleImage
            src={cardImg}
            alt={article.headline}
            color={journalist.color}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                backgroundColor: `${journalist.color}40`,
                color: journalist.color,
              }}
            >
              <JournalistIcon icon={journalist.icon} size={12} />
            </div>
            <JournalistLink
              journalistKey={journalist.key}
              name={journalist.name}
              color={journalist.color}
              className="text-xs font-mono font-bold uppercase tracking-wider drop-shadow-lg"
            />
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-playfair text-xl font-bold leading-snug mb-2 group-hover:text-white transition-colors text-text-primary">
            {article.headline}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {article.hook}
          </p>
          <span className="inline-block mt-3 text-xs font-mono text-text-muted">
            {readingTime(article.body)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex gap-4 py-4 border-b border-border last:border-0 hover:bg-bg-elevated/50 -mx-2 px-2 rounded transition-colors"
    >
      <div className="hidden sm:block w-24 h-16 rounded overflow-hidden shrink-0">
        <ArticleImage
          src={article.image_thumbnail_url || article.image_url}
          alt={article.headline}
          color={journalist.color}
        />
      </div>
      <div
        className="sm:hidden w-1 rounded-full shrink-0 mt-1"
        style={{ backgroundColor: journalist.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <JournalistLink
            journalistKey={journalist.key}
            name={journalist.name.split(" ")[0]}
            color={journalist.color}
            className="text-xs font-mono uppercase tracking-wider"
          />
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
