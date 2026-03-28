import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useBioStore } from './bio-store'
import { useMissionStore } from './mission-store'
import { useWeightStore } from '../../weight-log/api/weight-store'
import type { BioProfile } from '@HabitTree/types'

export function useBioProfile() {
  return useQuery({
    queryKey: ['bio-profile'],
    queryFn: () => useBioStore.getState().profile,
    staleTime: Infinity,
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<BioProfile>) => {
      useBioStore.getState().updateProfile(patch)
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-profile'] })
    },
  })
}

export function useRunAnalysis() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => {
      const result = useBioStore.getState().runAnalysis()
      const profile = useBioStore.getState().profile
      useWeightStore.getState().setGoal(profile.goalWeightKg)
      const mission = useMissionStore.getState().createMission(profile, result)
      return Promise.resolve({ result, mission })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio-result'] })
      queryClient.invalidateQueries({ queryKey: ['weight-goal'] })
      queryClient.invalidateQueries({ queryKey: ['active-mission'] })
      queryClient.invalidateQueries({ queryKey: ['mission-checkpoints'] })
    },
  })
}
