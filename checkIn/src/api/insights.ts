import { apiFetch } from "./client";
import type {
  ComorbidityMatrix,
  CorrelationResult,
  QualityStats,
} from "../types/dashboard";

export function getComorbidity(): Promise<ComorbidityMatrix> {
  return apiFetch<ComorbidityMatrix>("/api/stats/comorbidity");
}

export function getCorrelation(): Promise<CorrelationResult> {
  return apiFetch<CorrelationResult>("/api/stats/correlation");
}

export function getQuality(): Promise<QualityStats> {
  return apiFetch<QualityStats>("/api/stats/quality");
}
