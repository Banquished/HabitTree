import { createContext, useContext } from 'react'
import type { ApiClient } from '@HabitTree/api-client'

const ApiContext = createContext<ApiClient | null>(null)

export function ApiProvider({ children, client }: { children: React.ReactNode; client: ApiClient }) {
  return <ApiContext value={client}>{children}</ApiContext>
}

export function useApiClient(): ApiClient {
  const client = useContext(ApiContext)
  if (!client) throw new Error('ApiProvider not found')
  return client
}

export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError || (err instanceof DOMException && err.name === 'AbortError')
}
