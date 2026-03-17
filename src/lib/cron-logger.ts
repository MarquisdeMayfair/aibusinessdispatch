import { SupabaseClient } from "@supabase/supabase-js";

export interface CronLogEntry {
  job: string;
  started_at: string;
  finished_at?: string;
  duration_ms?: number;
  status: string;
  journalist?: string;
  article_id?: string;
  headline?: string;
  detail?: Record<string, unknown>;
  error?: string;
}

export class CronLogger {
  private sb: SupabaseClient;
  private job: string;
  private startTime: number;
  private startIso: string;

  constructor(sb: SupabaseClient, job: string) {
    this.sb = sb;
    this.job = job;
    this.startTime = Date.now();
    this.startIso = new Date().toISOString();
  }

  async log(entry: Omit<CronLogEntry, "job" | "started_at">): Promise<void> {
    const now = new Date();
    const record: CronLogEntry = {
      job: this.job,
      started_at: this.startIso,
      finished_at: now.toISOString(),
      duration_ms: Date.now() - this.startTime,
      ...entry,
    };

    await this.sb
      .from("cron_logs")
      .insert(record)
      .then(({ error }) => {
        if (error) console.error("[CronLogger] write failed:", error.message);
      });
  }
}
