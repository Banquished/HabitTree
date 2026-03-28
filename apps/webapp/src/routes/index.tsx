import { createBrowserRouter } from 'react-router'
import { Layout } from '@/app/layout'

export const router = createBrowserRouter([
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
])
