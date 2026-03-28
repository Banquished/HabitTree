import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeightEntry } from '@HabitTree/types'

interface WeightState {
  entries: WeightEntry[]
  goalKg: number
  setEntries: (entries: WeightEntry[]) => void
  addEntry: (entry: WeightEntry) => void
  updateEntry: (id: string, data: Partial<Omit<WeightEntry, 'id'>>) => void
  removeEntry: (id: string) => void
  setGoal: (kg: number) => void
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      entries: [],
      goalKg: 80,
      setEntries: (entries) => set({ entries }),
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, entry].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
        })),
      updateEntry: (id, data) =>
        set((s) => ({
          entries: s.entries
            .map((e) => (e.id === id ? { ...e, ...data } : e))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        })),
      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      setGoal: (goalKg) => set({ goalKg }),
    }),
    { name: 'habittree-weight' }
  )
)
