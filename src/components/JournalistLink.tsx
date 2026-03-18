"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

interface JournalistLinkProps {
  journalistKey: string;
  name: string;
  color: string;
  className?: string;
}

export default function JournalistLink({
  journalistKey,
  name,
  color,
  className = "",
}: JournalistLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/articles?journalist=${journalistKey}`);
  };

  return (
    <a
      href={`/articles?journalist=${journalistKey}`}
      onClick={handleClick}
      className={`hover:underline ${className}`}
      style={{ color }}
    >
      {name}
    </a>
  );
}
