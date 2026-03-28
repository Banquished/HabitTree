import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMissionStore } from './mission-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import { useWeightEntries } from '../../weight-log/api/use-weight-entries'
import { deriveMissionCheckpoints } from './calculations'

export function useActiveMission() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['active-mission'],
    queryFn: async () => {
      try {
        const mission = await api.getActiveMission()
        if (mission) {
          useMissionStore.getState().upsertMission(mission)
          useMissionStore.getState().setActiveMissionId(mission.id)
        }
        return mission
      } catch (err) {
        if (isNetworkError(err)) return useMissionStore.getState().getActiveMission()
        throw err
      }
    },
  })
}

export function useMissionCheckpoints() {
  const { data: entries = [] } = useWeightEntries()
  return useQuery({
    queryKey: ['mission-checkpoints', entries.length],
    queryFn: () => {
      const mission = useMissionStore.getState().getActiveMission()
      if (!mission) return null
      return deriveMissionCheckpoints(mission, entries)
    },
  })
}

export function useAbandonMission() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useMissionStore.getState().abandonMission(id)
      try {
        await api.updateMission(id, { status: 'abandoned' })
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['macro-targets'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}

export function useCompleteMission() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useMissionStore.getState().completeMission(id)
      try {
        await api.updateMission(id, { status: 'completed' })
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['macro-targets'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}
