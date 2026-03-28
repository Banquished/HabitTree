import { useMemo } from 'react'
import { useFuelEntries } from './use-fuel-entries'
import type { FuelEntry } from '@HabitTree/types'

export interface WeeklyMacros {
  weekStart: string
  weekEnd: string
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
  totalCalories: number
  daysLogged: number
  avgProteinG: number
  avgCarbsG: number
  avgFatG: number
  avgCalories: number
  entries: FuelEntry[]
}

function getMonday(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const day = dt.getDay()
  const diff = (day === 0 ? 6 : day - 1)
  dt.setDate(dt.getDate() - diff)
  return dt
}

function formatLocal(dt: Date): string {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

export function useWeeklyMacros(dateStr: string): WeeklyMacros {
  const { data: allEntries = [] } = useFuelEntries()

  return useMemo(() => {
    const monday = getMonday(dateStr)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const weekStart = formatLocal(monday)
    const weekEnd = formatLocal(sunday)

    const entries = allEntries
      .filter((e) => {
        const d = e.timestamp.slice(0, 10)
        return d >= weekStart && d <= weekEnd
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const totalProteinG = Math.round(entries.reduce((s, e) => s + e.proteinG, 0) * 10) / 10
    const totalCarbsG = Math.round(entries.reduce((s, e) => s + e.carbsG, 0) * 10) / 10
    const totalFatG = Math.round(entries.reduce((s, e) => s + e.fatG, 0) * 10) / 10
    const totalCalories = Math.round(entries.reduce((s, e) => s + e.calories, 0))

    const uniqueDays = new Set(entries.map((e) => e.timestamp.slice(0, 10)))
    const daysLogged = uniqueDays.size

    return {
      weekStart,
      weekEnd,
      totalProteinG,
      totalCarbsG,
      totalFatG,
      totalCalories,
      daysLogged,
      avgProteinG: daysLogged > 0 ? Math.round(totalProteinG / daysLogged) : 0,
      avgCarbsG: daysLogged > 0 ? Math.round(totalCarbsG / daysLogged) : 0,
      avgFatG: daysLogged > 0 ? Math.round(totalFatG / daysLogged) : 0,
      avgCalories: daysLogged > 0 ? Math.round(totalCalories / daysLogged) : 0,
      entries,
    }
  }, [allEntries, dateStr])
}
