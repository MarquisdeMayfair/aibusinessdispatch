"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  body: string;
}

function cleanBody(raw: string): string {
  let text = raw;

  // Strip <cite index="...">...</cite> — keep inner text
  text = text.replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, "$1");

  // Remove leading duplicate title if body starts with "# Same Headline"
  // (Claude sometimes echoes the headline as the first line)
  const lines = text.split("\n");
  if (lines[0]?.trim().startsWith("# ")) {
    text = lines.slice(1).join("\n").trimStart();
  }

  // Remove backslash escapes before markdown characters (\# → #)
  text = text.replace(/\\([#*_~`>|[\]])/g, "$1");

  return text;
}

export default function ArticleBody({ body }: Props) {
  const cleaned = cleanBody(body);

  return (
    <div className="prose-dispatch">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="font-playfair text-3xl font-bold text-text-primary mt-12 mb-5">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="font-playfair text-2xl font-bold text-text-primary mt-10 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-playfair text-xl font-semibold text-text-primary mt-8 mb-3">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-playfair text-lg font-semibold text-text-primary mt-6 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-text-secondary text-lg leading-relaxed mb-6 font-source">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-text-primary font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-text-secondary">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent-primary/40 pl-6 my-6 italic text-text-secondary/90">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 my-5 text-text-secondary text-lg font-source">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 my-5 text-text-secondary text-lg font-source">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:text-accent-primary/80 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="border-white/10 my-10" />
          ),
          code: ({ children }) => (
            <code className="bg-white/5 text-accent-primary px-1.5 py-0.5 rounded text-[0.9em] font-mono">
              {children}
            </code>
          ),
        }}
      >
        {cleaned}
      </ReactMarkdown>
    </div>
  );
}
