import { NavLink } from 'react-router'

const navItems = [
  { to: '/', icon: 'grid_view', label: 'DASH', end: true },
  { to: '/fuel-intake', icon: 'ev_station', label: 'FUEL' },
  { to: '/bio-calc', icon: 'calculate', label: 'BIO' },
  { to: '/operations', icon: 'terminal', label: 'OPS' },
  { to: '/weight-log', icon: 'monitor_weight', label: 'WEIGHT' },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-14 bg-surface-container-low lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={'end' in item ? item.end : undefined}
          className={({ isActive }: { isActive: boolean }) =>
            `flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-colors ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
