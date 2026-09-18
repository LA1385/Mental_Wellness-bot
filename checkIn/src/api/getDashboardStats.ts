import type { DailyStats, DashboardStats } from "../types/dashboard";

const BASE_URL = "/api";

export type DashboardStatsResponse = {
  stats: DashboardStats;
  daily: DailyStats;
};

export async function getDashboardStats(){
  try {
    const [response1, response2] = await Promise.all([
      fetch(`${BASE_URL}/stats?days=7`),
      fetch(`${BASE_URL}/stats/daily?days=7`),
    ]);

    if (!response1.ok || !response2.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const data1: DashboardStats = await response1.json();
    const data2: DailyStats = await response2.json();

    return {
      stats: data1,
      daily: data2
    }
  }
  catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}
