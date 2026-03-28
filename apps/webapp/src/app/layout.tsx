import { Outlet } from 'react-router'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { BottomNav } from './bottom-nav'
import { useLayoutStore } from './layout-store'

export function Layout() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />
      <Sidebar />
      <main
        className={`pt-12 pb-14 lg:pb-0 transition-[margin-left] duration-200 ease-in-out ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        }`}
      >
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
