import type { DailyStats, DashboardStats } from "../types/dashboard";

const BASE_URL = "https://passover-bonnet-relatable.ngrok-free.dev";
const ADMIN_API_KEY = "0393a34d29539a3e955228e8773a4fd9";

export type DashboardStatsResponse = {
  stats: DashboardStats;
  daily: DailyStats;
};

export async function getDashboardStats(){
  try {

    const headers = {
      "Content-Type": "application/json",
      "X-Admin-Key": ADMIN_API_KEY,
    "ngrok-skip-browser-warning": "true"
    };

    const [response1, response2] = await Promise.all([
      fetch(`${BASE_URL}/api/stats?days=7`, { headers }),
      fetch(`${BASE_URL}/api/stats/daily?days=7`, { headers }),
    ]);

    // const response = await fetch(BASE_URL);

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
