import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FoodItem, Recipe } from '@HabitTree/types'

interface FoodState {
  foodItems: FoodItem[]
  recipes: Recipe[]
  setFoodItems: (items: FoodItem[]) => void
  setRecipes: (recipes: Recipe[]) => void
  addFoodItem: (item: FoodItem) => void
  updateFoodItem: (id: string, patch: Partial<Omit<FoodItem, 'id'>>) => void
  removeFoodItem: (id: string) => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (id: string, patch: Partial<Omit<Recipe, 'id'>>) => void
  removeRecipe: (id: string) => void
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set) => ({
      foodItems: [],
      recipes: [],
      setFoodItems: (foodItems) => set({ foodItems }),
      setRecipes: (recipes) => set({ recipes }),
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
