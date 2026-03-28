import type { GoalType, MacroSplit } from './bio-calc.ts'

export type MissionStatus = 'active' | 'completed' | 'abandoned'

export interface WeekMilestone {
  week: number
  targetKg: number
  weekStartDate: string
  weekEndDate: string
}

export interface MissionCheckpoint {
  week: number
  actualKg: number | null
  targetKg: number
  deltaKg: number | null
}

export interface Mission {
  id: string
  status: MissionStatus
  createdAt: string
  startWeightKg: number
  goalWeightKg: number
  goalType: GoalType
  durationWeeks: number
  targetCalories: number
  macros: MacroSplit
  startDate: string
  endDate: string
  milestones: WeekMilestone[]
}
