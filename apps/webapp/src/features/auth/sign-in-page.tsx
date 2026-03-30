import { SignInButton, SignUpButton, useAuth } from '@clerk/react'
import { Navigate } from 'react-router'

export function Component() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null
  if (isSignedIn) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-8 p-8">
        <div className="flex flex-col items-center gap-2">
          <div className="text-primary font-black italic text-5xl tracking-tight">HABITTREE</div>
          <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.3em]">
            SYSTEM ACCESS REQUIRED
          </div>
        </div>
        <div className="flex flex-col gap-3 w-72">
          <SignInButton>
            <button className="w-full py-3 px-4 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_12px_rgba(171,255,2,0.4)] transition-shadow cursor-pointer">
              AUTHENTICATE
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="w-full py-3 px-4 bg-surface-container-high text-on-surface text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
              REQUEST ACCESS
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  )
}
