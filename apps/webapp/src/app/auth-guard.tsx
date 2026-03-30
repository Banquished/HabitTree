import { useAuth } from '@clerk/react'
import { Navigate, Outlet } from 'react-router'

export function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  return <Outlet />
}
