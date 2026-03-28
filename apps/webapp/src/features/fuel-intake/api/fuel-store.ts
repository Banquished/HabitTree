import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FuelEntry, MealProtocol } from '@HabitTree/types'

interface FuelState {
  entries: FuelEntry[]
  protocols: MealProtocol[]
  setEntries: (entries: FuelEntry[]) => void
  setProtocols: (protocols: MealProtocol[]) => void
  addEntry: (entry: FuelEntry) => void
  removeEntry: (id: string) => void
  addProtocol: (protocol: MealProtocol) => void
  removeProtocol: (id: string) => void
}

export const useFuelStore = create<FuelState>()(
  persist(
    (set) => ({
      entries: [],
      protocols: [],
      setEntries: (entries) => set({ entries }),
      setProtocols: (protocols) => set({ protocols }),
      addEntry: (entry) =>
        set((s) => ({
          entries: [...s.entries, entry].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
        })),
      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      addProtocol: (protocol) =>
        set((s) => ({ protocols: [...s.protocols, protocol] })),
      removeProtocol: (id) =>
        set((s) => ({ protocols: s.protocols.filter((p) => p.id !== id) })),
    }),
    { name: 'habittree-fuel' }
  )
)
