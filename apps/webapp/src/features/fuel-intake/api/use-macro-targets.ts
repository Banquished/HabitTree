import { useQuery } from '@tanstack/react-query'
import { useMissionStore } from '../../bio-calc/api/mission-store'
import { useApiClient } from '@/shared/api-context'
import type { GoalType, Mission } from '@HabitTree/types'

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

function deriveMacroTargets(mission: Mission): MacroTargets {
  const { targetCalories, macros } = mission
  return {
    targetCalories,
    proteinG: Math.round((targetCalories * macros.proteinPct) / 100 / 4),
    carbsG: Math.round((targetCalories * macros.carbsPct) / 100 / 4),
    fatG: Math.round((targetCalories * macros.fatPct) / 100 / 9),
    goalType: mission.goalType,
  }
}

export function useMacroTargets() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['macro-targets'],
    queryFn: async (): Promise<MacroTargets | null> => {
      try {
        const mission = await api.getActiveMission()
        if (mission) {
          const store = useMissionStore.getState()
          store.upsertMission(mission)
          store.setActiveMissionId(mission.id)
          return deriveMacroTargets(mission)
        }
        return null
      } catch {
        const mission = useMissionStore.getState().getActiveMission()
        if (!mission) return null
        return deriveMacroTargets(mission)
      }
    },
  })
}
