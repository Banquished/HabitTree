import { useMemo } from 'react'
import { useFuelEntries } from './use-fuel-entries'
import type { FuelEntry } from '@HabitTree/types'

export interface DailyMacros {
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
  totalCalories: number
  entries: FuelEntry[]
}

export function useDailyMacros(dateStr: string): DailyMacros {
  const { data: allEntries = [] } = useFuelEntries()

  return useMemo(() => {
    const entries = allEntries
      .filter((e) => e.timestamp.slice(0, 10) === dateStr)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return {
      totalProteinG: Math.round(entries.reduce((s, e) => s + e.proteinG, 0) * 10) / 10,
      totalCarbsG: Math.round(entries.reduce((s, e) => s + e.carbsG, 0) * 10) / 10,
      totalFatG: Math.round(entries.reduce((s, e) => s + e.fatG, 0) * 10) / 10,
      totalCalories: Math.round(entries.reduce((s, e) => s + e.calories, 0)),
      entries,
    }
  }, [allEntries, dateStr])
}
