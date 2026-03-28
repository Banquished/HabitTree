import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOperationsStore } from './operations-store'
import { useApiClient, isNetworkError } from '@/shared/api-context'
import type { OperationTemplate } from '@HabitTree/types'

export function useOperationTemplates() {
  const api = useApiClient()
  return useQuery({
    queryKey: ['operation-templates'],
    queryFn: async () => {
      try {
        const data = await api.getOperationTemplates({ isActive: true })
        useOperationsStore.getState().setTemplates(data)
        return data
      } catch (err) {
        if (isNetworkError(err)) return useOperationsStore.getState().templates
        throw err
      }
    },
  })
}

export function useCreateTemplate() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<OperationTemplate, 'id' | 'createdAt'>) => {
      const template: OperationTemplate = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
      }
      useOperationsStore.getState().addTemplate(template)
      try {
        return await api.createOperationTemplate(data)
      } catch (err) {
        if (isNetworkError(err)) return template
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-templates'] })
    },
  })
}

export function useUpdateTemplate() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<OperationTemplate, 'id' | 'createdAt'>>) => {
      useOperationsStore.getState().updateTemplate(id, data)
      try {
        return await api.updateOperationTemplate(id, data)
      } catch (err) {
        if (isNetworkError(err)) {
          const templates = useOperationsStore.getState().templates
          const found = templates.find((t) => t.id === id)
          if (!found) throw err
          return found
        }
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-templates'] })
    },
  })
}

export function useArchiveTemplate() {
  const api = useApiClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      useOperationsStore.getState().updateTemplate(id, { isActive: false })
      try {
        return await api.updateOperationTemplate(id, { isActive: false })
      } catch (err) {
        if (isNetworkError(err)) return
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-templates'] })
    },
  })
}
