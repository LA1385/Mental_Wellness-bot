import { apiFetch } from "./client";
import type {
  Axis,
  DemographicGroup,
  SymptomsByGroupEntry,
} from "../types/dashboard";

export function getDemographicsByAxis(
  axis: Axis,
): Promise<DemographicGroup[]> {
  return apiFetch<DemographicGroup[]>(`/api/stats/demographics/${axis}`);
}

export function getSymptomsByAxis(
  axis: Axis,
): Promise<SymptomsByGroupEntry[]> {
  return apiFetch<SymptomsByGroupEntry[]>(`/api/stats/symptoms/${axis}`);
}
