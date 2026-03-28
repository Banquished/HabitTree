import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBioStore } from './bio-store'
import { useMissionStore } from './mission-store'
import { useWeightStore } from '../../weight-log/api/weight-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { BioProfile } from '@HabitTree/types'

export function useBioProfile() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['bio-profile'],
    queryFn: async () => {
      try {
        const data = await api.getBioProfile()
        if (data) useBioStore.getState().setProfile(data)
        return data ?? useBioStore.getState().profile
      } catch (err) {
        if (isNetworkError(err)) return useBioStore.getState().profile
        throw err
      }
    },
  })
}

export function useBioResult() {
  return useQuery({
    queryKey: ['bio-result'],
    queryFn: () => useBioStore.getState().result,
    staleTime: Infinity,
  })
}

export function useUpdateBioProfile() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patch: Partial<BioProfile>) => {
      useBioStore.getState().updateProfile(patch)
      const updated = useBioStore.getState().profile
      try {
        await api.upsertBioProfile(updated)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-profile'] })
    },
  })
}

export function useRunAnalysis() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const result = useBioStore.getState().runAnalysis()
      const profile = useBioStore.getState().profile
      useWeightStore.getState().setGoal(profile.goalWeightKg)

      // Capture before createMission abandons it locally
      const previousActive = useMissionStore.getState().getActiveMission()

      // Create mission locally (abandons previous active mission in store)
      const mission = useMissionStore.getState().createMission(profile, result)

      // Sync to API
      try {
        await api.upsertBioProfile(profile)

        // Abandon previous active mission on the server first (overlap detection)
        if (previousActive) {
          try {
            await api.updateMission(previousActive.id, { status: 'abandoned' })
          } catch {
            // local-only mission — server may not know about it
          }
        }

        const { id: _localId, ...missionData } = mission
        const serverMission = await api.createMission(missionData)

        // Reconcile: replace local-ID mission with server version
        const store = useMissionStore.getState()
        store.setMissions(
          store.missions.map((m) => (m.id === mission.id ? serverMission : m))
        )
        store.setActiveMissionId(serverMission.id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
        // offline — local stores already updated with local IDs
      }

      return { result, mission }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-result'] })
      queryClient.invalidateQueries({ queryKey: ['weight-goal'] })
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['macro-targets'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}
