import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMissionStore } from './mission-store'
import { useWeightStore } from '../../weight-log/api/weight-store'
import { deriveMissionCheckpoints } from './calculations'

export function useActiveMission() {
  return useQuery({
    queryKey: ['active-mission'],
    queryFn: () => useMissionStore.getState().getActiveMission(),
    staleTime: Infinity,
  })
}

export function useMissionCheckpoints() {
  return useQuery({
    queryKey: ['mission-checkpoints'],
    queryFn: () => {
      const mission = useMissionStore.getState().getActiveMission()
      const entries = useWeightStore.getState().entries
      if (!mission) return null
      return deriveMissionCheckpoints(mission, entries)
    },
    staleTime: Infinity,
  })
}

export function useAbandonMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useMissionStore.getState().abandonMission(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}

export function useCompleteMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => {
      useMissionStore.getState().completeMission(id)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}
