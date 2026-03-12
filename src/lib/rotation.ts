import { JournalistKey } from "./types";

/**
 * Weekly rotation: one journalist per day.
 * dayOfWeek 0 = Sunday, 1 = Monday … 6 = Saturday.
 *
 * Sunday alternates between secretarial_pool and creative_destruction
 * on even/odd ISO weeks.
 */
const DAILY_ROSTER: Record<number, JournalistKey> = {
  1: "doom_cassandra",
  2: "optimist_prime",
  3: "tech_leads",
  4: "strategy_desk",
  5: "money_machine",
  6: "saas_whisperer",
};

function isoWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

export function todaysJournalist(date: Date = new Date()): JournalistKey {
  const dow = date.getUTCDay();

  if (dow === 0) {
    return isoWeek(date) % 2 === 0 ? "secretarial_pool" : "creative_destruction";
  }

  return DAILY_ROSTER[dow] ?? "doom_cassandra";
}

export function journalistArticleId(key: JournalistKey, date: Date = new Date()): string {
  const iso = date.toISOString().split("T")[0];
  return `${key}-${iso}`;
}
