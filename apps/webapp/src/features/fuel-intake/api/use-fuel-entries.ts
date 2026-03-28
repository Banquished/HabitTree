import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useFuelStore } from './fuel-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { FuelEntry, MealProtocol } from '@HabitTree/types'

export function useFuelEntries() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['fuel-entries'],
    queryFn: async () => {
      try {
        const data = await api.getFuelEntries()
        useFuelStore.getState().setEntries(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useFuelStore.getState().entries
        throw err
      }
    },
  })
}

export function useAddFuelEntry() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<FuelEntry, 'id'>) => {
      const entry: FuelEntry = { id: crypto.randomUUID(), ...data }
      useFuelStore.getState().addEntry(entry)
      try {
        return await api.createFuelEntry(data)
      } catch (err) {
        if (isNetworkError(err)) return entry
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}

export function useRemoveFuelEntry() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useFuelStore.getState().removeEntry(id)
      try {
        await api.deleteFuelEntry(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}

export function useMealProtocols() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['meal-protocols'],
    queryFn: async () => {
      try {
        const data = await api.getMealProtocols()
        useFuelStore.getState().setProtocols(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useFuelStore.getState().protocols
        throw err
      }
    },
  })
}

export function useAddMealProtocol() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<MealProtocol, 'id'>) => {
      const protocol: MealProtocol = { id: crypto.randomUUID(), ...data }
      useFuelStore.getState().addProtocol(protocol)
      try {
        return await api.createMealProtocol(data)
      } catch (err) {
        if (isNetworkError(err)) return protocol
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-protocols'] })
    },
  })
}

export function useRemoveMealProtocol() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useFuelStore.getState().removeProtocol(id)
      try {
        await api.deleteMealProtocol(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-protocols'] })
    },
  })
}

export function useExecuteProtocol() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (protocol: MealProtocol) => {
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
      try {
        return await api.createFuelEntry({
          timestamp: entry.timestamp,
          name: entry.name,
          calories: entry.calories,
          proteinG: entry.proteinG,
          carbsG: entry.carbsG,
          fatG: entry.fatG,
        })
      } catch (err) {
        if (isNetworkError(err)) return entry
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-entries'] })
    },
  })
}
