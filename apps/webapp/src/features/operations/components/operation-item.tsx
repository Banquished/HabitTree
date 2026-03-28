import { useState, useRef, useEffect } from 'react'
import type { OperationTemplate, OperationLog } from '@HabitTree/types'

interface Props {
  template: OperationTemplate
  log: OperationLog | null
  onToggle: () => void
  onEdit: () => void
  onArchive: () => void
}

const priorityConfig = {
  high: { color: 'bg-primary', text: 'text-primary', label: 'HIGH' },
  medium: { color: 'bg-on-surface-variant', text: 'text-on-surface-variant', label: 'MED' },
  low: { color: 'bg-on-surface-variant/50', text: 'text-on-surface-variant', label: 'LOW' },
} as const

export function OperationItem({ template, log, onToggle, onEdit, onArchive }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isCompleted = log?.completedAt !== null && log?.completedAt !== undefined

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

  const priority = priorityConfig[template.priority]

  return (
    <div className="flex items-center gap-3 px-4 py-3 group">
      <button
        onClick={onToggle}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shrink-0"
        aria-label={isCompleted ? `Mark ${template.name} incomplete` : `Mark ${template.name} complete`}
      >
        <div
          className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${
            isCompleted ? 'bg-primary border-primary' : 'border-primary'
          }`}
        >
          {isCompleted && (
            <span className="material-symbols-outlined text-on-primary text-base">check</span>
          )}
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-black tracking-widest uppercase truncate ${
              isCompleted ? 'text-primary' : 'text-on-surface'
            }`}
          >
            {template.name}
          </span>
          <span className={`flex items-center gap-1 shrink-0`}>
            <span className={`w-2 h-2 ${priority.color}`} />
            <span className={`text-[8px] font-bold tracking-widest uppercase ${priority.text}`}>
              {priority.label}
            </span>
          </span>
        </div>
        {template.description && (
          <p className={`text-[10px] tracking-widest uppercase mt-0.5 truncate ${
            isCompleted ? 'text-on-surface-variant/60' : 'text-on-surface-variant'
          }`}>
            {template.description}
          </p>
        )}
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
  )
}
