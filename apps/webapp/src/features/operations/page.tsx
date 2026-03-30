import { formatLocalDate, todayLocal } from '@/shared/date-utils'
import type { OperationTemplate } from '@HabitTree/types'
import { useMemo, useState } from 'react'
import { useOperationLogs, useToggleLog } from './api/use-operation-logs'
import { useArchiveTemplate, useCreateTemplate, useOperationTemplates, useUpdateTemplate } from './api/use-operation-templates'
import { DailyProtocol } from './components/daily-protocol'
import { QuickAddInput } from './components/quick-add-input'
import { TemplateFormModal } from './components/template-form-modal'
import { WeeklyDirectives } from './components/weekly-directives'

function getWeekDates(): string[] {
  const today = new Date()
  const day = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((day + 6) % 7))
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(formatLocalDate(d))
  }
  return dates
}

export function Component() {
  const todayStr = todayLocal()
  const weekDates = useMemo(() => getWeekDates(), [])

  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<OperationTemplate | null>(null)
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const selectedDateStr = formatLocalDate(selectedDate)
  const isToday = selectedDateStr === todayStr

  function shiftDate(days: number) {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() + days)
      if (formatLocalDate(next) > todayStr) return prev
      return next
    })
  }

  const { data: templates = [] } = useOperationTemplates()
  const { data: selectedDayLogs = [] } = useOperationLogs(selectedDateStr)

  const weekLogQueries = [
    useOperationLogs(weekDates[0]),
    useOperationLogs(weekDates[1]),
    useOperationLogs(weekDates[2]),
    useOperationLogs(weekDates[3]),
    useOperationLogs(weekDates[4]),
    useOperationLogs(weekDates[5]),
    useOperationLogs(weekDates[6]),
  ]

  const weeklyLogs = useMemo(() => {
    const result: Record<string, import('@HabitTree/types').OperationLog[]> = {}
    weekDates.forEach((date, i) => {
      result[date] = weekLogQueries[i].data ?? []
    })
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekDates, ...weekLogQueries.map((q) => q.data)])

  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()
  const archiveTemplate = useArchiveTemplate()
  const toggleLog = useToggleLog()

  const dailyTemplates = templates.filter(
    (t) => t.frequency === 'daily' || t.frequency === 'specific_days'
  )
  const weeklyTemplates = templates.filter((t) => t.frequency === 'weekly')

  const existingCategories = useMemo(
    () => [...new Set(templates.map((t) => t.category).filter((c): c is string => Boolean(c)))],
    [templates]
  )

  function handleQuickAdd(name: string) {
    createTemplate.mutate({
      name,
      icon: 'check_circle',
      frequency: 'daily',
      priority: 'medium',
      targetCount: 1,
      sortOrder: templates.length,
      isActive: true,
    })
  }

  function handleToggle(templateId: string, existingLog: import('@HabitTree/types').OperationLog | null) {
    toggleLog.mutate({ templateId, date: selectedDateStr, existingLog })
  }

  function handleEdit(template: OperationTemplate) {
    setEditingTemplate(template)
    setShowForm(true)
  }

  function handleArchive(id: string) {
    archiveTemplate.mutate(id)
  }

  function handleFormSubmit(data: Omit<OperationTemplate, 'id' | 'createdAt'>) {
    if (editingTemplate) {
      updateTemplate.mutate({ id: editingTemplate.id, ...data })
    } else {
      createTemplate.mutate(data)
    }
    setShowForm(false)
    setEditingTemplate(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
              {'>'} OPERATIONS
            </span>
            <span className="cursor-blink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface uppercase italic">
            OPERATIONS_COMMAND
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-1">
            TASK_PROTOCOL // INITIALIZED
          </p>
        </div>
        <button
          onClick={() => { setEditingTemplate(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-primary px-5 py-3 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          NEW_TEMPLATE
        </button>
      </div>

      <QuickAddInput onAdd={handleQuickAdd} isPending={createTemplate.isPending} />

      <div className="flex items-center gap-3 bg-surface-container ghost-border px-4 py-2">
        <button
          type="button"
          onClick={() => shiftDate(-1)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Previous day"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <span className="font-mono text-sm text-on-surface tracking-widest uppercase">
          {selectedDateStr} ({['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][selectedDate.getDay()]})
        </span>
        {!isToday && (
          <button
            type="button"
            onClick={() => setSelectedDate(new Date())}
            className="min-h-[44px] px-3 text-[9px] font-bold tracking-widest uppercase bg-surface-container-high text-primary cursor-pointer hover:text-on-surface transition-colors"
          >
            TODAY
          </button>
        )}
        <button
          type="button"
          onClick={() => shiftDate(1)}
          disabled={isToday}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next day"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <DailyProtocol
            templates={dailyTemplates}
            logs={selectedDayLogs}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />
        </div>
        <div className="lg:col-span-7">
          <WeeklyDirectives
            templates={weeklyTemplates}
            weeklyLogs={weeklyLogs}
            todayLogs={selectedDayLogs}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onArchive={handleArchive}
          />
        </div>
      </div>

      {showForm && (
        <TemplateFormModal
          onClose={() => { setShowForm(false); setEditingTemplate(null) }}
          onSubmit={handleFormSubmit}
          initialData={editingTemplate ?? undefined}
          isPending={editingTemplate ? updateTemplate.isPending : createTemplate.isPending}
          existingCategories={existingCategories}
        />
      )}
    </div>
  )
}
