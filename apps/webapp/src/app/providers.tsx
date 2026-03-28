import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createApiClient } from '@HabitTree/api-client'
import { ApiProvider } from '@/shared/api-context'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const apiClient = createApiClient(import.meta.env.VITE_API_URL || 'http://localhost:8000')

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider client={apiClient}>
        {children}
      </ApiProvider>
    </QueryClientProvider>
  )
}
