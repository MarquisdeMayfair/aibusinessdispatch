"use client";

interface Props {
  body: string;
}

export default function ArticleBody({ body }: Props) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <div className="prose-dispatch">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          const text = trimmed.slice(2, -2);
          return (
            <h2
              key={i}
              className="font-playfair text-2xl font-bold text-text-primary mt-10 mb-4"
            >
              {text}
            </h2>
          );
        }

        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="text-text-primary font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={j}>{part}</span>;
        });

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s*/, ""));
          return (
            <ul key={i} className="list-disc list-inside space-y-1 my-4 text-text-secondary">
              {items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={i}
            className="text-text-secondary text-lg leading-relaxed mb-6 font-source"
          >
            {rendered}
          </p>
        );
      })}
    </div>
  );
}
