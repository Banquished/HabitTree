import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FuelEntry, MealProtocol } from '@HabitTree/types'

interface FuelState {
  entries: FuelEntry[]
  protocols: MealProtocol[]
  addEntry: (entry: FuelEntry) => void
  removeEntry: (id: string) => void
  addProtocol: (protocol: MealProtocol) => void
  removeProtocol: (id: string) => void
}

const today = new Date().toISOString().slice(0, 10)

const SEED_ENTRIES: FuelEntry[] = [
  {
    id: 'fe-001-a1b2c3d4',
    timestamp: `${today}T07:30:00.000Z`,
    name: 'Post-Workout Shake',
    calories: 462,
    proteinG: 42,
    carbsG: 55,
    fatG: 8,
  },
  {
    id: 'fe-002-b2c3d4e5',
    timestamp: `${today}T12:15:00.000Z`,
    name: 'Grilled Chicken & Rice',
    calories: 556,
    proteinG: 48,
    carbsG: 65,
    fatG: 12,
  },
  {
    id: 'fe-003-c3d4e5f6',
    timestamp: `${today}T18:45:00.000Z`,
    name: 'Salmon & Sweet Potato',
    calories: 482,
    proteinG: 38,
    carbsG: 42,
    fatG: 18,
  },
]

const SEED_PROTOCOLS: MealProtocol[] = [
  {
    id: 'mp-001-d4e5f6a7',
    name: 'ANABOLIC_SHAKE',
    version: 'V2.1',
    ingredientsDesc: 'Whey isolate, oats, banana, peanut butter',
    calories: 462,
    proteinG: 42,
    carbsG: 55,
    fatG: 8,
  },
  {
    id: 'mp-002-e5f6a7b8',
    name: 'CHICKEN_RICE_BROCCOLI',
    version: 'V3.0',
    ingredientsDesc: 'Chicken breast 200g, jasmine rice 150g, broccoli 100g',
    calories: 556,
    proteinG: 48,
    carbsG: 65,
    fatG: 12,
  },
  {
    id: 'mp-003-f6a7b8c9',
    name: 'OVERNIGHT_OATS',
    version: 'V1.4',
    ingredientsDesc: 'Oats 80g, greek yogurt 150g, whey 30g, blueberries',
    calories: 462,
    proteinG: 35,
    carbsG: 58,
    fatG: 10,
  },
]

export const useFuelStore = create<FuelState>()(
  persist(
    (set) => ({
      entries: SEED_ENTRIES,
      protocols: SEED_PROTOCOLS,
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
