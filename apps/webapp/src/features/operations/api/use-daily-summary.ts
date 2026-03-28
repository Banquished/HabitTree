import { useQuery } from '@tanstack/react-query'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { DailySummary } from '@HabitTree/types'

export function useDailySummary(date: string) {
  const api = useApiClient()
  return useQuery({
    queryKey: ['daily-summary', date],
    queryFn: async (): Promise<DailySummary | null> => {
      try {
        return await api.getOperationDailySummary(date)
      } catch (err) {
        if (isNetworkError(err)) return null
        throw err
      }
    },
  })
}
