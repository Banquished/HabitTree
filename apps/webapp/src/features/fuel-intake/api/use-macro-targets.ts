import { useQuery } from '@tanstack/react-query'
import { useMissionStore } from '../../bio-calc/api/mission-store'
import type { GoalType } from '@HabitTree/types'

export interface MacroTargets {
  targetCalories: number
  proteinG: number
  carbsG: number
  fatG: number
  goalType: GoalType
}

const GOAL_LABELS: Record<GoalType, string> = {
  bulk: 'HYPERTROPHY',
  cut: 'DEFICIT_PROTOCOL',
  maintain: 'MAINTENANCE',
}

export function getGoalLabel(goalType: GoalType): string {
  return GOAL_LABELS[goalType]
}

export function useMacroTargets() {
  return useQuery({
    queryKey: ['macro-targets'],
    queryFn: (): MacroTargets | null => {
      const mission = useMissionStore.getState().getActiveMission()
      if (!mission) return null
      const { targetCalories, macros } = mission
      return {
        targetCalories,
        proteinG: Math.round((targetCalories * macros.proteinPct) / 100 / 4),
        carbsG: Math.round((targetCalories * macros.carbsPct) / 100 / 4),
        fatG: Math.round((targetCalories * macros.fatPct) / 100 / 9),
        goalType: mission.goalType,
      }
    },
    staleTime: Infinity,
  })
}
