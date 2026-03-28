import { useMemo, useState } from 'react'
import type { WeightEntry } from '@HabitTree/types'
import { useUpdateWeightEntry, useRemoveWeightEntry } from '../api/use-weight-entries'

interface Props {
  entries: WeightEntry[]
}

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

function toDateValue(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toTimeValue(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface EditState {
  weightKg: string
  date: string
  time: string
}

export function AuditLog({ entries }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({ weightKg: '', date: '', time: '' })
  const updateEntry = useUpdateWeightEntry()
  const removeEntry = useRemoveWeightEntry()

  const rows = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    return sorted.map((entry, i) => {
      const prev = sorted[i + 1]
      const deviation = prev ? entry.weightKg - prev.weightKg : 0
      return { ...entry, deviation }
    })
  }, [entries])

  function startEdit(entry: WeightEntry) {
    setEditingId(entry.id)
    setEditState({
      weightKg: entry.weightKg.toString(),
      date: toDateValue(entry.timestamp),
      time: toTimeValue(entry.timestamp),
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(id: string) {
    const timestamp = new Date(`${editState.date}T${editState.time}`).toISOString()
    updateEntry.mutate({ id, weightKg: Number(editState.weightKg), timestamp })
    setEditingId(null)
  }

  function handleDelete(id: string) {
    removeEntry.mutate(id)
    if (editingId === id) setEditingId(null)
  }

  return (
    <div className="bg-surface-container-low">
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} RAW_DATA_AUDIT_LOG
        </span>
        <span className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">
          ENTRIES_RETURNED: {String(rows.length).padStart(2, '0')}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-bold text-[10px] tracking-tight">
          <thead>
            <tr className="text-on-surface-variant border-b border-surface-container-high">
              <th className="px-6 py-4 font-bold tracking-widest">EVENT_UUID</th>
              <th className="px-6 py-4 font-bold tracking-widest">TIMESTAMP</th>
              <th className="px-6 py-4 font-bold tracking-widest">VALUE_KG</th>
              <th className="px-6 py-4 font-bold tracking-widest">DEVIATION</th>
              <th className="px-6 py-4 font-bold tracking-widest text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {rows.map((row) => {
              const isEditing = editingId === row.id

              return (
                <tr key={row.id} className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4 text-on-surface-variant group-hover:text-on-surface font-mono">
                    #{row.id.slice(0, 8).toUpperCase()}
                  </td>

                  <td className="px-6 py-4 font-mono">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="date"
                          value={editState.date}
                          onChange={(e) => setEditState((s) => ({ ...s, date: e.target.value }))}
                          className="bg-surface-container-high text-on-surface text-[10px] font-bold font-mono px-1 py-0.5 border-none focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                        />
                        <input
                          type="time"
                          value={editState.time}
                          onChange={(e) => setEditState((s) => ({ ...s, time: e.target.value }))}
                          className="bg-surface-container-high text-on-surface text-[10px] font-bold font-mono px-1 py-0.5 border-none focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                        />
                      </div>
                    ) : (
                      <span className="text-on-surface tracking-widest">{formatTimestamp(row.timestamp)}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 font-mono">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editState.weightKg}
                        onChange={(e) => setEditState((s) => ({ ...s, weightKg: e.target.value }))}
                        className="bg-surface-container-high text-primary font-black italic text-sm font-mono w-20 px-1 py-0.5 border-none focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <span className="text-primary font-black italic text-sm">{row.weightKg.toFixed(1)}</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-on-surface-variant font-mono">
                    {row.deviation > 0 ? '+' : ''}{row.deviation.toFixed(1)} KG
                  </td>

                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => saveEdit(row.id)}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase hover:bg-primary/20 transition-colors"
                        >
                          SAVE
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[8px] font-black tracking-widest uppercase hover:text-on-surface transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(row)}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black tracking-widest uppercase hover:bg-primary/20 transition-colors"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="px-2 py-0.5 bg-error/10 text-error text-[8px] font-black tracking-widest uppercase hover:bg-error/20 transition-colors"
                        >
                          DELETE
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
