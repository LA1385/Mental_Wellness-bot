import { apiFetch } from "./client";
import type { DailyStat, OverallStats, SymptomStat } from "../types/dashboard";

export function getOverallStats(days?: number): Promise<OverallStats> {
  const params = days === undefined ? undefined : { days: String(days) };
  return apiFetch<OverallStats>("/api/stats", params);
}

export function getDailyTrend(days?: number): Promise<DailyStat[]> {
  const params = days === undefined ? undefined : { days: String(days) };
  return apiFetch<DailyStat[]>("/api/stats/daily", params);
}

export function getSymptoms(): Promise<SymptomStat[]> {
  return apiFetch<SymptomStat[]>("/api/stats/symptoms");
}
