import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FoodItem, Recipe } from '@HabitTree/types'

interface FoodState {
  foodItems: FoodItem[]
  recipes: Recipe[]
  addFoodItem: (item: FoodItem) => void
  updateFoodItem: (id: string, patch: Partial<Omit<FoodItem, 'id'>>) => void
  removeFoodItem: (id: string) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, patch: Partial<Omit<Recipe, 'id'>>) => void
  removeRecipe: (id: string) => void
}

const SEED_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'fi-001-chicken-breast',
    name: 'Chicken Breast',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
  },
  {
    id: 'fi-002-jasmine-rice',
    name: 'Jasmine Rice (cooked)',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3,
  },
  {
    id: 'fi-003-broccoli',
    name: 'Broccoli',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
  },
  {
    id: 'fi-004-whey-isolate',
    name: 'Whey Protein Isolate',
    caloriesPer100g: 370,
    proteinPer100g: 90,
    carbsPer100g: 3,
    fatPer100g: 1,
  },
  {
    id: 'fi-005-oats',
    name: 'Rolled Oats',
    caloriesPer100g: 379,
    proteinPer100g: 13.2,
    carbsPer100g: 67.7,
    fatPer100g: 6.5,
  },
  {
    id: 'fi-006-banana',
    name: 'Banana',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
  },
  {
    id: 'fi-007-peanut-butter',
    name: 'Peanut Butter',
    caloriesPer100g: 588,
    proteinPer100g: 25,
    carbsPer100g: 20,
    fatPer100g: 50,
  },
  {
    id: 'fi-008-salmon',
    name: 'Salmon Fillet',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
  },
  {
    id: 'fi-009-sweet-potato',
    name: 'Sweet Potato (cooked)',
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatPer100g: 0.1,
  },
  {
    id: 'fi-010-greek-yogurt',
    name: 'Greek Yogurt (0% fat)',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.7,
  },
]

export const useFoodStore = create<FoodState>()(
  persist(
    (set) => ({
      foodItems: SEED_FOOD_ITEMS,
      recipes: [],
      addFoodItem: (item) =>
        set((s) => ({ foodItems: [...s.foodItems, item] })),
      updateFoodItem: (id, patch) =>
        set((s) => ({
          foodItems: s.foodItems.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),
      removeFoodItem: (id) =>
        set((s) => ({ foodItems: s.foodItems.filter((f) => f.id !== id) })),
      addRecipe: (recipe) =>
        set((s) => ({ recipes: [...s.recipes, recipe] })),
      updateRecipe: (id, patch) =>
        set((s) => ({
          recipes: s.recipes.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),
      removeRecipe: (id) =>
        set((s) => ({ recipes: s.recipes.filter((r) => r.id !== id) })),
    }),
    { name: 'habittree-food' },
  ),
)
