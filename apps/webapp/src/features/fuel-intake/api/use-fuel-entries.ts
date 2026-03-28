import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFuelStore } from './fuel-store'
import type { FuelEntry, MealProtocol } from '@HabitTree/types'

export function useFuelEntries() {
  return useQuery({
    queryKey: ['fuel-entries'],
    queryFn: () => useFuelStore.getState().entries,
    staleTime: Infinity,
  })
}

export function useAddFuelEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<FuelEntry, 'id'>) => {
      const entry: FuelEntry = { id: crypto.randomUUID(), ...data }
      useFuelStore.getState().addEntry(entry)
      return Promise.resolve(entry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}

export function useRemoveFuelEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useFuelStore.getState().removeEntry(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}

export function useMealProtocols() {
  return useQuery({
    queryKey: ['meal-protocols'],
    queryFn: () => useFuelStore.getState().protocols,
    staleTime: Infinity,
  })
}

export function useAddMealProtocol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<MealProtocol, 'id'>) => {
      const protocol: MealProtocol = { id: crypto.randomUUID(), ...data }
      useFuelStore.getState().addProtocol(protocol)
      return Promise.resolve(protocol)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-protocols'] })
    },
  })
}

export function useRemoveMealProtocol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useFuelStore.getState().removeProtocol(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-protocols'] })
    },
  })
}

export function useExecuteProtocol() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (protocol: MealProtocol) => {
      const entry: FuelEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        name: protocol.name,
        calories: protocol.calories,
        proteinG: protocol.proteinG,
        carbsG: protocol.carbsG,
        fatG: protocol.fatG,
      }
      useFuelStore.getState().addEntry(entry)
      return Promise.resolve(entry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}
