export type Tier = 'minimal_mild' | 'moderate' | 'severe'

export type OverallStats = {
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

export type DailyStat = {
  date: string
  total: number
  severe: number
  moderate: number
  minimal_mild: number
}


export type SymptomStat = {
  symptom: string
  respondents: number
  elevated_percent: number
}

export type Axis = 'faculty' | 'gender' | 'hall_of_residence'

export type DemographicGroup = {
  group: string
  respondents: number
  severity_percent: {
    minimal_mild: number
    moderate: number
    severe: number
  } | null
}

export type SymptomsByGroupEntry = {
  group: string
  respondents: number
  item_elevated_percent: Record<string, number> | null
}

// Only combinations that occurred appear as keys; a missing key means no data, not zero.
export type ComorbidityMatrix = Record<string, number>

export type CorrelationResult =
  | { pearson_r: number; n: number }
  | { error: string }

export type QualityStats = {
  total_sessions: number
  speed_run_count: number
  speed_run_percent_of_completed: number
  incomplete_count: number
  incomplete_percent: number
  distinct_chat_ids: number
  chat_ids_with_multiple_sessions: number
}