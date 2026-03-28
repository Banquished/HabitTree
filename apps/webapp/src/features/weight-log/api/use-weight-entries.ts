import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useWeightStore } from './weight-store'
import type { WeightEntry } from '@HabitTree/types'

export function useWeightEntries() {
  return useQuery({
    queryKey: ['weight-entries'],
    queryFn: () => useWeightStore.getState().entries,
    staleTime: Infinity,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { weightKg: number; timestamp?: string; note?: string }) => {
      const entry: WeightEntry = {
        id: crypto.randomUUID(),
        timestamp: data.timestamp ?? new Date().toISOString(),
        weightKg: data.weightKg,
        note: data.note,
      }
      useWeightStore.getState().addEntry(entry)
      return Promise.resolve(entry)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}

export function useUpdateWeightEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string; weightKg?: number; timestamp?: string; note?: string }) => {
      const { id, ...updates } = data
      useWeightStore.getState().updateEntry(id, updates)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}

export function useRemoveWeightEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useWeightStore.getState().removeEntry(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] })
    },
  })
}
