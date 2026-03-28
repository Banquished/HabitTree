import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeightEntry } from '@HabitTree/types'

interface WeightState {
  entries: WeightEntry[]
  goalKg: number
  addEntry: (entry: WeightEntry) => void
  updateEntry: (id: string, data: Partial<Omit<WeightEntry, 'id'>>) => void
  removeEntry: (id: string) => void
  setGoal: (kg: number) => void
}

const SEED_ENTRIES: WeightEntry[] = [
  { id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', timestamp: '2026-03-26T07:12:00.000Z', weightKg: 83.1, note: 'Feeling good' },
  { id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', timestamp: '2026-03-21T07:45:00.000Z', weightKg: 83.4 },
  { id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', timestamp: '2026-03-16T08:03:00.000Z', weightKg: 83.0, note: 'New low!' },
  { id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f80', timestamp: '2026-03-11T07:22:00.000Z', weightKg: 83.7 },
  { id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8091', timestamp: '2026-03-06T07:58:00.000Z', weightKg: 84.1 },
  { id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f809102', timestamp: '2026-03-01T08:15:00.000Z', weightKg: 83.8, note: 'Start of March' },
  { id: '07b8c9d0-e1f2-4a3b-4c5d-6e7f80910213', timestamp: '2026-02-24T07:30:00.000Z', weightKg: 84.5 },
  { id: '18c9d0e1-f2a3-4b4c-5d6e-7f8091021324', timestamp: '2026-02-19T07:05:00.000Z', weightKg: 84.2 },
  { id: '29d0e1f2-a3b4-4c5d-6e7f-809102132435', timestamp: '2026-02-14T08:20:00.000Z', weightKg: 84.9, note: 'Valentine dinner' },
  { id: '3ae1f2a3-b4c5-4d6e-7f80-910213243546', timestamp: '2026-02-09T07:40:00.000Z', weightKg: 85.1 },
  { id: '4bf2a3b4-c5d6-4e7f-8091-021324354657', timestamp: '2026-02-03T07:55:00.000Z', weightKg: 85.6 },
  { id: '5ca3b4c5-d6e7-4f80-9102-132435465768', timestamp: '2026-01-29T08:10:00.000Z', weightKg: 85.3 },
  { id: '6db4c5d6-e7f8-4091-0213-243546576879', timestamp: '2026-01-23T07:18:00.000Z', weightKg: 86.0 },
  { id: '7ec5d6e7-f809-4102-1324-35465768798a', timestamp: '2026-01-17T07:35:00.000Z', weightKg: 86.4, note: 'Back on track' },
  { id: '8fd6e7f8-0910-4213-2435-46576879809b', timestamp: '2026-01-11T08:25:00.000Z', weightKg: 87.1 },
  { id: '90e7f809-1021-4324-3546-5768798090ac', timestamp: '2026-01-05T07:50:00.000Z', weightKg: 87.5, note: 'Post-holiday' },
  { id: 'a1f80910-2132-4435-4657-68798090a1bd', timestamp: '2025-12-31T08:00:00.000Z', weightKg: 87.8 },
  { id: 'b2091021-3243-4546-5768-798090a1b2ce', timestamp: '2025-12-27T07:28:00.000Z', weightKg: 88.2, note: 'Starting point' },
]

export const useWeightStore = create<WeightState>()(
  persist(
    (set) => ({
      entries: SEED_ENTRIES,
      goalKg: 80,
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
