import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWeightStore } from './weight-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { WeightEntry } from '@HabitTree/types'

export function useWeightEntries() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['weight-entries'],
    queryFn: async () => {
      try {
        const data = await api.getWeightEntries()
        useWeightStore.getState().setEntries(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useWeightStore.getState().entries
        throw err
      }
    },
  })
}

export function useWeightGoal() {
  return useQuery({
    queryKey: ['weight-goal'],
    queryFn: () => useWeightStore.getState().goalKg,
    staleTime: Infinity,
  })
}

export function useAddWeightEntry() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { weightKg: number; timestamp?: string; note?: string }) => {
      const entry: WeightEntry = {
        id: crypto.randomUUID(),
        timestamp: data.timestamp ?? new Date().toISOString(),
        weightKg: data.weightKg,
        note: data.note,
      }
      useWeightStore.getState().addEntry(entry)
      try {
        return await api.createWeightEntry({ timestamp: entry.timestamp, weightKg: entry.weightKg, note: entry.note })
      } catch (err) {
        if (isNetworkError(err)) return entry
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}

export function useUpdateWeightEntry() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; weightKg?: number; timestamp?: string; note?: string }) => {
      const { id, ...updates } = data
      useWeightStore.getState().updateEntry(id, updates)
      try {
        await api.updateWeightEntry(id, updates)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}

export function useRemoveWeightEntry() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useWeightStore.getState().removeEntry(id)
      try {
        await api.deleteWeightEntry(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}
