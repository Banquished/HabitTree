import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOperationsStore } from './operations-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { OperationLog } from '@HabitTree/types'

export function useOperationLogs(date: string) {
  const api = useApiClient()
  return useQuery({
    queryKey: ['operation-logs', date],
    queryFn: async () => {
      try {
        const data = await api.getOperationLogs(date)
        useOperationsStore.getState().setLogsForDate(date, data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useOperationsStore.getState().logs[date] ?? []
        throw err
      }
    },
  })
}

export function useToggleLog() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ templateId, date, existingLog }: {
      templateId: string
      date: string
      existingLog: OperationLog | null
    }) => {
      if (!existingLog) {
        const log: OperationLog = {
          id: crypto.randomUUID(),
          templateId,
          date,
          completedAt: new Date().toISOString(),
        }
        useOperationsStore.getState().upsertLog(log)
        try {
          return await api.createOperationLog({ templateId, date, completedAt: log.completedAt })
        } catch (err) {
          if (isNetworkError(err)) return log
          throw err
        }
      }

      const updatedLog: OperationLog = {
        ...existingLog,
        completedAt: existingLog.completedAt ? null : new Date().toISOString(),
      }
      useOperationsStore.getState().upsertLog(updatedLog)
      try {
        return await api.updateOperationLog(existingLog.id, { completedAt: updatedLog.completedAt })
      } catch (err) {
        if (isNetworkError(err)) return updatedLog
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-logs'] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] })
      queryClient.invalidateQueries({ queryKey: ['operation-heatmap'] })
    },
  })
}

export function useDeleteLog() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      useOperationsStore.getState().removeLog(id, date)
      try {
        await api.deleteOperationLog(id)
      } catch (err) {
        if (!isNetworkError(err)) throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-logs'] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] })
    },
  })
}
