import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFoodStore } from './food-store'
import type { FoodItem, Recipe } from '@HabitTree/types'

export function useFoodItems() {
  return useQuery({
    queryKey: ['food-items'],
    queryFn: () => useFoodStore.getState().foodItems,
    staleTime: Infinity,
  })
}

export function useAddFoodItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<FoodItem, 'id'>) => {
      const item: FoodItem = { id: crypto.randomUUID(), ...data }
      useFoodStore.getState().addFoodItem(item)
      return Promise.resolve(item)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<FoodItem> & { id: string }) => {
      useFoodStore.getState().updateFoodItem(id, patch)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useRemoveFoodItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useFoodStore.getState().removeFoodItem(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-items'] })
    },
  })
}

export function useRecipes() {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => useFoodStore.getState().recipes,
    staleTime: Infinity,
  })
}

export function useAddRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Recipe, 'id'>) => {
      const recipe: Recipe = { id: crypto.randomUUID(), ...data }
      useFoodStore.getState().addRecipe(recipe)
      return Promise.resolve(recipe)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<Recipe> & { id: string }) => {
      useFoodStore.getState().updateRecipe(id, patch)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}

export function useRemoveRecipe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useFoodStore.getState().removeRecipe(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
}
