import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFoodStore } from './food-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { FoodItem, Recipe, RecipeIngredient } from '@HabitTree/types'

export function useFoodItems() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['food-items'],
    queryFn: async () => {
      try {
        const data = await api.getFoodItems()
        useFoodStore.getState().setFoodItems(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useFoodStore.getState().foodItems
        throw err
      }
    },
  })
}

export function useAddFoodItem() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<FoodItem, 'id'>) => {
      const item: FoodItem = { id: crypto.randomUUID(), ...data }
      useFoodStore.getState().addFoodItem(item)
      try {
        return await api.createFoodItem(data)
      } catch (err) {
        if (isNetworkError(err)) return item
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useUpdateFoodItem() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<FoodItem> & { id: string }) => {
      useFoodStore.getState().updateFoodItem(id, patch)
      try {
        await api.updateFoodItem(id, patch)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useRemoveFoodItem() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useFoodStore.getState().removeFoodItem(id)
      try {
        await api.deleteFoodItem(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useRecipes() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        const data = await api.getRecipes()
        useFoodStore.getState().setRecipes(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useFoodStore.getState().recipes
        throw err
      }
    },
  })
}

export function useAddRecipe() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<Recipe, 'id' | 'ingredients'> & { ingredients: Omit<RecipeIngredient, 'id'>[] }) => {
      const recipe: Recipe = { id: crypto.randomUUID(), ...data, ingredients: data.ingredients.map((i) => ({ ...i, id: crypto.randomUUID() })) }
      useFoodStore.getState().addRecipe(recipe)
      try {
        return await api.createRecipe(data)
      } catch (err) {
        if (isNetworkError(err)) return recipe
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useUpdateRecipe() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Recipe> & { id: string }) => {
      useFoodStore.getState().updateRecipe(id, patch)
      try {
        const updated = useFoodStore.getState().recipes.find((r) => r.id === id)
        if (updated) {
          const { id: _id, ...data } = updated
          await api.updateRecipe(id, data)
        }
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useRemoveRecipe() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useFoodStore.getState().removeRecipe(id)
      try {
        await api.deleteRecipe(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
