import { Providers } from '@/app/providers'
import { router } from '@/routes'
import { ClerkProvider } from '@clerk/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './index.css'

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_KEY} afterSignOutUrl="/sign-in">
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ClerkProvider>
  </StrictMode>,
)
