import { ApiProvider } from '@/shared/api-context'
import { useAuth } from '@clerk/react'
import { createApiClient } from '@HabitTree/api-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()
  const apiClient = useMemo(
    () => createApiClient(import.meta.env.VITE_API_URL || 'http://localhost:8000', getToken),
    [getToken],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider client={apiClient}>
        {children}
      </ApiProvider>
    </QueryClientProvider>
  )
}
