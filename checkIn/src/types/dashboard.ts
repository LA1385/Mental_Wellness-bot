export type Tier = 'minimal_mild' | 'moderate' | 'severe'

export type DashboardStats = {
  window: string
  total_sessions: number
  completed_sessions: number
  in_progress_sessions: number 
  expired_sessions: number
  completion_rate_percent: number

  severity_breakdown: {
    minimal_mild: number
    moderate: number
    severe: number
  }

  severity_percent: {
    minimal_mild: number
    moderate: number
    severe: number
  }

  self_harm_override_count: number
}

export interface DailyStatsRecord {
  date: string
  total: number
  severe: number
  moderate: number
  minimal_mild: number
}

export type DailyStats = DailyStatsRecord[]