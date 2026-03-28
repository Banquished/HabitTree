import { useLayoutStore } from './layout-store'

export function Header() {
  const toggle = useLayoutStore((s) => s.toggleSidebar)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-12 px-4 bg-surface-container-low">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="hidden lg:flex items-center justify-center w-8 h-8 text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <span className="text-base font-black italic uppercase text-primary tracking-tighter glow-sm">
          HabitTree
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center w-9 h-9 text-on-surface-variant hover:text-primary transition-colors" aria-label="Settings">
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>
    </header>
  )
}
