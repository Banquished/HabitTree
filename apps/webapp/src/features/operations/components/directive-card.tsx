import type { OperationTemplate } from '@HabitTree/types'
import { useState, useRef, useEffect } from 'react'

interface Props {
  template: OperationTemplate
  completedCount: number
  onEdit: () => void
  onArchive: () => void
}

export function DirectiveCard({ template, completedCount, onEdit, onArchive }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const pct = template.targetCount > 0
    ? Math.min(100, Math.round((completedCount / template.targetCount) * 100))
    : 0

  return (
    <div className="bg-surface-container p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-primary">{template.icon}</span>
          <div>
            <h3 className="text-sm font-black tracking-widest uppercase text-on-surface">
              {template.name}
            </h3>
            {template.category && (
              <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                {template.category}
              </span>
            )}
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label={`Options for ${template.name}`}
          >
            <span className="material-symbols-outlined text-xl">more_vert</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full z-10 bg-surface-container-high shadow-lg min-w-[140px]">
              <button
                onClick={() => { onEdit(); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                EDIT
              </button>
              <button
                onClick={() => { onArchive(); setMenuOpen(false) }}
                className="w-full flex items-center gap-2 px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">archive</span>
                ARCHIVE
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
        {completedCount}/{template.targetCount} SESSIONS
      </div>

      <div className="h-1 bg-surface-container-high">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      {template.description && (
        <p className="text-[10px] tracking-widest uppercase text-on-surface-variant">
          {template.description}
        </p>
      )}
    </div>
  )
}
