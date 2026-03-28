import { useState } from 'react'
import type { FuelEntry } from '@HabitTree/types'
import { ConfirmDialog } from '@/shared/confirm-dialog'
import { todayLocal } from '@/shared/date-utils'

interface Props {
  entries: FuelEntry[]
  selectedDate: string
  onDateChange: (date: string) => void
  onRemove: (id: string) => void
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function shiftDate(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

export function EntryLogStream({ entries, selectedDate, onDateChange, onRemove }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  return (
    <div>
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'> ENTRY_LOG_STREAM [DATE: '}
          {selectedDate.replace(/-/g, '.')}
          {']'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDateChange(shiftDate(selectedDate, -1))}
            className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Previous day"
          >
            chevron_left
          </button>
          <button
            type="button"
            onClick={() => onDateChange(todayLocal())}
            className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            TODAY
          </button>
          <button
            type="button"
            onClick={() => onDateChange(shiftDate(selectedDate, 1))}
            className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Next day"
          >
            chevron_right
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            WAITING_FOR_INTAKE_SEQUENCE...
          </span>
        </div>
      ) : (
        <div className="divide-y divide-surface-container-high">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface-container-low px-6 py-4 flex items-center gap-4 group hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">
                restaurant
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black uppercase tracking-tight text-on-surface">
                  {entry.name}
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant tracking-widest">
                  {formatTime(entry.timestamp)}
                  {'  P: '}
                  {entry.proteinG}
                  {'G | C: '}
                  {entry.carbsG}
                  {'G | F: '}
                  {entry.fatG}
                  G
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-on-surface">{entry.calories}</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">
                  KCAL
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(entry.id)}
                className="opacity-60 hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-error cursor-pointer"
                aria-label="Delete entry"
              >
                delete
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { onRemove(deleteTarget); setDeleteTarget(null) } }}
        title="CONFIRM_DELETION"
        message="This action cannot be undone. The record will be permanently removed."
      />
    </div>
  )
}
