import { format, parseISO, isToday, isYesterday } from "date-fns";

export function formatArticleDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "d MMMM yyyy");
}

export function formatDispatchDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEEE, d MMMM yyyy");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getGradientForJournalist(key: string): string {
  const gradients: Record<string, string> = {
    doom_cassandra: "from-[#E63946]/20 to-transparent",
    optimist_prime: "from-[#2EC4B6]/20 to-transparent",
    tech_leads: "from-[#9B5DE5]/20 to-transparent",
    strategy_desk: "from-[#1D3557]/20 to-transparent",
    secretarial_pool: "from-[#457B9D]/20 to-transparent",
    money_machine: "from-[#E9C46A]/20 to-transparent",
    saas_whisperer: "from-[#F77F00]/20 to-transparent",
    creative_destruction: "from-[#D62828]/20 to-transparent",
  };
  return gradients[key] || "from-white/10 to-transparent";
}

export function readingTime(body: string): string {
  const words = body.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 250));
  return `${mins} min read`;
}
