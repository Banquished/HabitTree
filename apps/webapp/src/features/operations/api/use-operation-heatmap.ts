import { useQuery } from '@tanstack/react-query'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { HeatmapDay } from '@HabitTree/types'

export function useOperationHeatmap(year: number) {
  const api = useApiClient()
  const start = `${year}-01-01`
  const end = `${year}-12-31`

  return useQuery({
    queryKey: ['operation-heatmap', year],
    queryFn: async (): Promise<HeatmapDay[]> => {
      try {
        return await api.getOperationHeatmap(start, end)
      } catch (err) {
        if (isNetworkError(err)) return []
        throw err
      }
    },
  })
}
