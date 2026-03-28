import type { OperationTemplate, OperationLog } from '@HabitTree/types'
import { OperationItem } from './operation-item'

interface Props {
  templates: OperationTemplate[]
  logs: OperationLog[]
  onToggle: (templateId: string, existingLog: OperationLog | null) => void
  onEdit: (template: OperationTemplate) => void
  onArchive: (id: string) => void
}

export function DailyProtocol({ templates, logs, onToggle, onEdit, onArchive }: Props) {
  const completedCount = templates.filter((t) => {
    const log = logs.find((l) => l.templateId === t.id)
    return log?.completedAt
  }).length
  const totalCount = templates.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-surface-container-lowest">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-container">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} DAILY_PROTOCOL
        </span>
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          [{pct}% COMPLETE]
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="px-6 py-12 text-center space-y-3">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">
            assignment
          </span>
          <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_PROTOCOLS_CONFIGURED
          </p>
          <p className="text-[9px] tracking-widest uppercase text-on-surface-variant">
            USE_QUICK_ADD_OR_CREATE_TEMPLATE_TO_BEGIN
          </p>
        </div>
      ) : (
        <div className="divide-y divide-surface-container-high">
          {templates.map((template) => {
            const log = logs.find((l) => l.templateId === template.id) ?? null
            return (
              <OperationItem
                key={template.id}
                template={template}
                log={log}
                onToggle={() => onToggle(template.id, log)}
                onEdit={() => onEdit(template)}
                onArchive={() => onArchive(template.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
