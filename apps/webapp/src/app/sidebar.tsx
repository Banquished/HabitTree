import { useClerk, useUser } from '@clerk/react'
import { NavLink } from 'react-router'
import { useLayoutStore } from './layout-store'

const navItems = [
  { to: '/', icon: 'grid_view', label: 'DASHBOARD', end: true },
  { to: '/operations', icon: 'terminal', label: 'OPERATIONS' },
  { to: '/fuel-intake', icon: 'ev_station', label: 'FUEL INTAKE' },
  { to: '/weight-log', icon: 'monitor_weight', label: 'WEIGHT LOG' },
  { to: '/bio-calc', icon: 'calculate', label: 'BIO-CALC' },
] as const

export function Sidebar() {
  const collapsed = useLayoutStore((s) => s.sidebarCollapsed)
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <aside
      className={`fixed top-12 left-0 bottom-0 z-30 hidden lg:flex flex-col bg-surface-container-low overflow-hidden transition-[width] duration-200 ease-in-out ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* User Profile */}
      <div className="flex items-center gap-3 px-4 py-5 overflow-hidden">
        <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-surface-container-high">
          <span className="material-symbols-outlined text-primary text-lg">person</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="text-xs font-black italic tracking-tight text-primary">{user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]?.toUpperCase() || 'OPERATOR'}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">STATUS: ACTIVE</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? item.end : undefined}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3 py-2.5 min-h-[44px] transition-colors overflow-hidden ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto px-2 pb-4 flex flex-col gap-1">
        <button aria-label="Initialize procedure" className="flex items-center gap-3 px-3 py-2.5 min-h-[44px] bg-primary text-on-primary overflow-hidden hover:shadow-[0_0_10px_rgba(171,255,2,0.4)] transition-shadow cursor-pointer">
          <span className="material-symbols-outlined text-xl flex-shrink-0">add_circle</span>
          <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">
            INITIALIZE_PROCEDURE
          </span>
        </button>
        <button onClick={() => signOut()} aria-label="Logout" className="flex items-center gap-3 px-3 py-2 min-h-[44px] text-on-surface-variant hover:text-primary transition-colors overflow-hidden cursor-pointer">
          <span className="material-symbols-outlined text-xl flex-shrink-0">logout</span>
          <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">LOGOUT</span>
        </button>
        <button aria-label="Help" className="flex items-center gap-3 px-3 py-2 min-h-[44px] text-on-surface-variant hover:text-primary transition-colors overflow-hidden cursor-pointer">
          <span className="material-symbols-outlined text-xl flex-shrink-0">help</span>
          <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden">HELP</span>
        </button>
      </div>
    </aside>
  )
}
