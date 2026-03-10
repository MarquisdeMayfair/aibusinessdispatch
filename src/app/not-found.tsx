import Link from "next/link";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-playfair text-5xl font-black text-text-primary mb-4">
          404
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          This story hasn&apos;t been filed yet.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-accent-doom text-white text-sm font-mono font-bold rounded hover:bg-accent-doom/90 transition-colors"
        >
          Back to the Dispatch
        </Link>
      </main>
      <Footer />
    </>
  );
}
