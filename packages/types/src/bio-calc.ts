export type Sex = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'athletic' | 'extreme'
export type GoalType = 'cut' | 'bulk' | 'maintain'

export interface MacroSplit {
  proteinPct: number
  carbsPct: number
  fatPct: number
}

export interface BioProfile {
  age: number
  sex: Sex
  weightKg: number
  heightCm: number
  activityLevel: ActivityLevel
  goalType: GoalType
  goalWeightKg: number
  durationWeeks: number
  missionStartDate: string
  customTdee: number | null
  calorieAdjustment: number
  customMacros: MacroSplit | null
}

export interface BioResult {
  bmr: number
  tdee: number
  effectiveTdee: number
  targetCalories: number
  calorieAdjustment: number
  proteinG: number
  carbsG: number
  fatG: number
  proteinPct: number
  carbsPct: number
  fatPct: number
}
