import { AuthGuard } from '@/app/auth-guard'
import { Layout } from '@/app/layout'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/sign-in',
    lazy: () => import('@/features/auth/sign-in-page'),
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            lazy: () => import('@/features/home/page'),
          },
          {
            path: '/fuel-intake',
            lazy: () => import('@/features/fuel-intake/page'),
          },
          {
            path: '/bio-calc',
            lazy: () => import('@/features/bio-calc/page'),
          },
          {
            path: '/operations',
            lazy: () => import('@/features/operations/page'),
          },
          {
            path: '/weight-log',
            lazy: () => import('@/features/weight-log/page'),
          },
        ],
      },
    ],
  },
])
