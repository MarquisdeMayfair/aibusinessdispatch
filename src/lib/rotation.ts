import { JournalistKey } from "./types";

/**
 * Mon–Sat: one dedicated journalist per day.
 * Sunday:  catch-all day — all SUNDAY_JOURNALISTS publish.
 *          Add more journalists here without breaking the weekly cycle.
 */
const DAILY_ROSTER: Record<number, JournalistKey> = {
  1: "doom_cassandra",
  2: "optimist_prime",
  3: "tech_leads",
  4: "strategy_desk",
  5: "money_machine",
  6: "saas_whisperer",
};

export const SUNDAY_JOURNALISTS: JournalistKey[] = [
  "secretarial_pool",
  "creative_destruction",
];

export function todaysJournalist(date: Date = new Date()): JournalistKey {
  const dow = date.getUTCDay();

  if (dow === 0) {
    return SUNDAY_JOURNALISTS[0];
  }

  return DAILY_ROSTER[dow] ?? "doom_cassandra";
}

export function isSunday(date: Date = new Date()): boolean {
  return date.getUTCDay() === 0;
}

export function journalistArticleId(key: JournalistKey, date: Date = new Date()): string {
  const iso = date.toISOString().split("T")[0];
  return `${key}-${iso}`;
}
