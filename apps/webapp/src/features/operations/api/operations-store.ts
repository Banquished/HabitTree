import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OperationTemplate, OperationLog } from '@HabitTree/types'

interface OperationsState {
  templates: OperationTemplate[]
  logs: Record<string, OperationLog[]>
  setTemplates: (templates: OperationTemplate[]) => void
  addTemplate: (template: OperationTemplate) => void
  updateTemplate: (id: string, data: Partial<OperationTemplate>) => void
  removeTemplate: (id: string) => void
  setLogsForDate: (date: string, logs: OperationLog[]) => void
  upsertLog: (log: OperationLog) => void
  removeLog: (id: string, date: string) => void
}

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      templates: [],
      logs: {},
      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) =>
        set((s) => ({
          templates: [...s.templates, template].sort((a, b) => a.sortOrder - b.sortOrder),
        })),
      updateTemplate: (id, data) =>
        set((s) => ({
          templates: s.templates.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      removeTemplate: (id) =>
        set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
      setLogsForDate: (date, logs) =>
        set((s) => ({ logs: { ...s.logs, [date]: logs } })),
      upsertLog: (log) =>
        set((s) => {
          const dateLogs = s.logs[log.date] ?? []
          const exists = dateLogs.some((l) => l.id === log.id)
          const updated = exists
            ? dateLogs.map((l) => (l.id === log.id ? log : l))
            : [...dateLogs, log]
          return { logs: { ...s.logs, [log.date]: updated } }
        }),
      removeLog: (id, date) =>
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: (s.logs[date] ?? []).filter((l) => l.id !== id),
          },
        })),
    }),
    { name: 'habittree-operations' }
  )
)
