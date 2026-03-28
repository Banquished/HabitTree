import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BioProfile, BioResult } from '@HabitTree/types'
import { calculateBio, getDefaultCalorieAdjustment } from './calculations'

interface BioState {
  profile: BioProfile
  result: BioResult | null
  setProfile: (profile: BioProfile) => void
  updateProfile: (patch: Partial<BioProfile>) => void
  runAnalysis: () => BioResult
}

const DEFAULT_PROFILE: BioProfile = {
  age: 28,
  sex: 'male',
  weightKg: 82.5,
  heightCm: 185,
  activityLevel: 'light',
  goalType: 'cut',
  goalWeightKg: 80,
  durationWeeks: 12,
  missionStartDate: new Date().toISOString().slice(0, 10),
  customTdee: null,
  calorieAdjustment: -500,
  customMacros: null,
}

export const useBioStore = create<BioState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      result: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => {
          const next = { ...s.profile, ...patch }
          if (patch.goalType && patch.goalType !== s.profile.goalType) {
            next.calorieAdjustment = getDefaultCalorieAdjustment(patch.goalType)
            next.customMacros = null
          }
          return { profile: next }
        }),
      runAnalysis: () => {
        const result = calculateBio(get().profile)
        set({ result })
        return result
      },
    }),
    { name: 'habittree-bio' }
  )
)
