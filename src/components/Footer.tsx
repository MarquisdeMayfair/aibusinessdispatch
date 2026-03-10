import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-playfair text-xl font-bold text-text-primary mb-3">
              AI Business Dispatch
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              The sharpest AI business analysis, delivered daily. Eight
              specialist journalists, eight unique perspectives. No fluff, no
              sponsored content, no paywall.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-text-muted mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href="/"
                  className="hover:text-text-primary transition-colors"
                >
                  Today&apos;s Dispatch
                </Link>
              </li>
              <li>
                <Link
                  href="/dispatch"
                  className="hover:text-text-primary transition-colors"
                >
                  Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/#journalists"
                  className="hover:text-text-primary transition-colors"
                >
                  Our Journalists
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase text-text-muted mb-4">
              About
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              AI Business Dispatch is an AI-powered editorial experiment. Our
              journalists are specialist AI agents, each with distinct
              perspectives and areas of expertise. All content is generated
              by AI and should be read as informed analysis, not financial
              advice.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-text-faint font-mono">
          &copy; {new Date().getFullYear()} AI Business Dispatch. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
