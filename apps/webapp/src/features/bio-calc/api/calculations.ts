import type { BioProfile, BioResult, MacroSplit, ActivityLevel, GoalType, Mission, MissionCheckpoint, WeekMilestone, WeightEntry } from '@HabitTree/types'

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  athletic: 1.55,
  extreme: 1.725,
}

const DEFAULT_CALORIE_ADJUSTMENTS: Record<GoalType, number> = {
  cut: -500,
  maintain: 0,
  bulk: 300,
}

const DEFAULT_MACRO_SPLITS: Record<GoalType, MacroSplit> = {
  cut: { proteinPct: 40, carbsPct: 35, fatPct: 25 },
  bulk: { proteinPct: 30, carbsPct: 45, fatPct: 25 },
  maintain: { proteinPct: 30, carbsPct: 40, fatPct: 30 },
}

export function getDefaultCalorieAdjustment(goal: GoalType): number {
  return DEFAULT_CALORIE_ADJUSTMENTS[goal]
}

export function getDefaultMacroSplit(goal: GoalType): MacroSplit {
  return { ...DEFAULT_MACRO_SPLITS[goal] }
}

function calcBmr(profile: BioProfile): number {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age
  return profile.sex === 'male' ? base + 5 : base - 161
}

export function calculateBio(profile: BioProfile): BioResult {
  const bmr = Math.round(calcBmr(profile))
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel])
  const effectiveTdee = profile.customTdee ?? tdee
  const calorieAdjustment = profile.calorieAdjustment
  const targetCalories = Math.round(effectiveTdee + calorieAdjustment)

  const { proteinPct, carbsPct, fatPct } = profile.customMacros ?? DEFAULT_MACRO_SPLITS[profile.goalType]
  const proteinG = Math.round((targetCalories * proteinPct) / 100 / 4)
  const carbsG = Math.round((targetCalories * carbsPct) / 100 / 4)
  const fatG = Math.round((targetCalories * fatPct) / 100 / 9)

  return { bmr, tdee, effectiveTdee, targetCalories, calorieAdjustment, proteinG, carbsG, fatG, proteinPct, carbsPct, fatPct }
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function round(n: number, decimals: number): number {
  const f = 10 ** decimals
  return Math.round(n * f) / f
}

export function generateMilestones(startKg: number, goalKg: number, weeks: number, startDate: string): WeekMilestone[] {
  const start = new Date(startDate)
  const weeklyDelta = (goalKg - startKg) / weeks
  return Array.from({ length: weeks }, (_, i) => {
    const week = i + 1
    const weekStart = addDays(start, i * 7)
    const weekEnd = addDays(weekStart, 6)
    return {
      week,
      targetKg: round(startKg + weeklyDelta * week, 1),
      weekStartDate: weekStart.toISOString().slice(0, 10),
      weekEndDate: weekEnd.toISOString().slice(0, 10),
    }
  })
}

export function deriveMissionCheckpoints(mission: Mission, entries: WeightEntry[]): MissionCheckpoint[] {
  return mission.milestones.map((ms) => {
    const weekEntries = entries.filter((e) => {
      const d = e.timestamp.slice(0, 10)
      return d >= ms.weekStartDate && d <= ms.weekEndDate
    })
    const actualKg = weekEntries.length
      ? round(weekEntries.reduce((s, e) => s + e.weightKg, 0) / weekEntries.length, 1)
      : null
    return {
      week: ms.week,
      actualKg,
      targetKg: ms.targetKg,
      deltaKg: actualKg !== null ? round(actualKg - ms.targetKg, 1) : null,
    }
  })
}
