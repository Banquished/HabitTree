import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Mission, BioProfile, BioResult } from '@HabitTree/types'
import { addDays, generateMilestones } from './calculations'

interface MissionState {
  missions: Mission[]
  activeMissionId: string | null
  setMissions: (missions: Mission[]) => void
  setActiveMissionId: (id: string | null) => void
  upsertMission: (mission: Mission) => void
  archiveMissions: () => void
  getActiveMission: () => Mission | null
  createMission: (profile: BioProfile, result: BioResult) => Mission
  abandonMission: (id: string) => void
  completeMission: (id: string) => void
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],
      activeMissionId: null,
      setMissions: (missions) => set({ missions }),
      setActiveMissionId: (id) => set({ activeMissionId: id }),

      upsertMission: (mission) =>
        set((s) => {
          const exists = s.missions.some((m) => m.id === mission.id)
          return {
            missions: exists
              ? s.missions.map((m) => (m.id === mission.id ? mission : m))
              : [...s.missions, mission],
          }
        }),

      archiveMissions: () =>
        set((s) => {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return {
            missions: s.missions.filter((m) => {
              if (m.status !== 'completed' && m.status !== 'abandoned') return true
              return new Date(m.endDate) >= thirtyDaysAgo
            }),
          }
        }),

      getActiveMission: () => {
        const { missions, activeMissionId } = get()
        return missions.find((m) => m.id === activeMissionId) ?? null
      },

      createMission: (profile, result) => {
        const now = new Date()
        const startDate = profile.missionStartDate
        const endDate = addDays(new Date(startDate), profile.durationWeeks * 7).toISOString().slice(0, 10)
        const milestones = generateMilestones(profile.weightKg, profile.goalWeightKg, profile.durationWeeks, startDate)

        const mission: Mission = {
          id: crypto.randomUUID(),
          status: 'active',
          createdAt: now.toISOString(),
          startWeightKg: profile.weightKg,
          goalWeightKg: profile.goalWeightKg,
          goalType: profile.goalType,
          durationWeeks: profile.durationWeeks,
          targetCalories: result.targetCalories,
          macros: { proteinPct: result.proteinPct, carbsPct: result.carbsPct, fatPct: result.fatPct },
          startDate,
          endDate,
          milestones,
        }

        set((s) => ({
          missions: s.missions.map((m) =>
            m.id === s.activeMissionId ? { ...m, status: 'abandoned' as const } : m
          ).concat(mission),
          activeMissionId: mission.id,
        }))

        return mission
      },

      abandonMission: (id) =>
        set((s) => ({
          missions: s.missions.map((m) => (m.id === id ? { ...m, status: 'abandoned' as const } : m)),
          activeMissionId: s.activeMissionId === id ? null : s.activeMissionId,
        })),

      completeMission: (id) =>
        set((s) => ({
          missions: s.missions.map((m) => (m.id === id ? { ...m, status: 'completed' as const } : m)),
          activeMissionId: s.activeMissionId === id ? null : s.activeMissionId,
        })),
    }),
    { name: 'habittree-mission' }
  )
)
