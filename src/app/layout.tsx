import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://aibusinessdispatch.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Business Dispatch — Intelligence for the AI-Augmented Enterprise",
    template: "%s — AI Business Dispatch",
  },
  description:
    "The sharpest AI business analysis. Nine specialist journalists, daily intelligence on risks, opportunities, strategy, finance, SaaS, UK tech, creative and technical deep-dives. No fluff, no sponsored content.",
  keywords: [
    "AI business news",
    "artificial intelligence enterprise",
    "AI strategy",
    "AI risks",
    "AI SaaS tools",
    "AI finance",
    "business intelligence AI",
    "AI workplace transformation",
  ],
  authors: [{ name: "AI Business Dispatch" }],
  creator: "AI Business Dispatch",
  publisher: "AI Business Dispatch",
  formatDetection: { telephone: false },
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "AI Business Dispatch",
    description: "Intelligence for the AI-Augmented Enterprise",
    url: SITE_URL,
    siteName: "AI Business Dispatch",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Business Dispatch",
    description: "Intelligence for the AI-Augmented Enterprise",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
