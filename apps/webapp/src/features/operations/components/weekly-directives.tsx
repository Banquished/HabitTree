import type { OperationTemplate, OperationLog } from '@HabitTree/types'
import { DirectiveCard } from './directive-card'

interface Props {
  templates: OperationTemplate[]
  weeklyLogs: Record<string, OperationLog[]>
  onEdit: (template: OperationTemplate) => void
  onArchive: (id: string) => void
}

export function WeeklyDirectives({ templates, weeklyLogs, onEdit, onArchive }: Props) {
  function getCompletedCount(templateId: string): number {
    let count = 0
    for (const logs of Object.values(weeklyLogs)) {
      for (const log of logs) {
        if (log.templateId === templateId && log.completedAt) {
          count++
        }
      }
    }
    return count
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} WEEKLY_DIRECTIVES
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="bg-surface-container-lowest px-6 py-12 text-center space-y-3">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">
            event_repeat
          </span>
          <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_WEEKLY_DIRECTIVES
          </p>
          <p className="text-[9px] tracking-widest uppercase text-on-surface-variant">
            CREATE_A_WEEKLY_TEMPLATE_TO_TRACK_PROGRESS
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <DirectiveCard
              key={template.id}
              template={template}
              completedCount={getCompletedCount(template.id)}
              onEdit={() => onEdit(template)}
              onArchive={() => onArchive(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
