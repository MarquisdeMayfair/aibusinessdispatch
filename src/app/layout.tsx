import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Business Dispatch — Intelligence for the AI-Augmented Enterprise",
  description:
    "The sharpest AI business analysis. Eight perspectives, eight specialist journalists, daily intelligence. No fluff, no sponsored content.",
  openGraph: {
    title: "AI Business Dispatch",
    description: "Intelligence for the AI-Augmented Enterprise",
    url: "https://aibusinessdispatch.com",
    siteName: "AI Business Dispatch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Dispatch",
    description: "Intelligence for the AI-Augmented Enterprise",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
