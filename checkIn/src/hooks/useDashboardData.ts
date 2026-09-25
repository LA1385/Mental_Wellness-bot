import { useCallback } from "react";
import {
  getDailyTrend,
  getOverallStats,
  getSymptoms,
} from "../api/stats";
import {
  getDemographicsByAxis,
  getSymptomsByAxis,
} from "../api/demographics";
import {
  getComorbidity,
  getCorrelation,
  getQuality,
} from "../api/insights";
import type { Axis } from "../types/dashboard";
import { useAsyncData } from "./useAsyncData";

export function useOverallStats(days?: number) {
  const fetchFn = useCallback(() => getOverallStats(days), [days]);
  return useAsyncData(fetchFn);
}

export function useDailyTrend(days?: number) {
  const fetchFn = useCallback(() => getDailyTrend(days), [days]);
  return useAsyncData(fetchFn);
}

export function useSymptoms() {
  const fetchFn = useCallback(() => getSymptoms(), []);
  return useAsyncData(fetchFn);
}

export function useDemographics(axis: Axis) {
  const fetchFn = useCallback(() => getDemographicsByAxis(axis), [axis]);
  return useAsyncData(fetchFn);
}

export function useSymptomsByAxis(axis: Axis) {
  const fetchFn = useCallback(() => getSymptomsByAxis(axis), [axis]);
  return useAsyncData(fetchFn);
}

export function useComorbidity() {
  const fetchFn = useCallback(() => getComorbidity(), []);
  return useAsyncData(fetchFn);
}

export function useCorrelation() {
  const fetchFn = useCallback(() => getCorrelation(), []);
  return useAsyncData(fetchFn);
}

export function useQuality() {
  const fetchFn = useCallback(() => getQuality(), []);
  return useAsyncData(fetchFn);
}
