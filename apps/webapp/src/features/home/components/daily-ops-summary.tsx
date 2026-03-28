import { Link } from 'react-router'
import { useDailySummary } from '../../operations/api/use-daily-summary'
import { todayLocal } from '@/shared/date-utils'

export function DailyOpsSummary() {
  const todayStr = todayLocal()
  const { data: summary } = useDailySummary(todayStr)

  const items = summary?.items ?? []
  const completedCount = summary?.completedCount ?? 0
  const totalCount = summary?.totalCount ?? 0

  return (
    <div className="bg-surface-container-low">
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} DAILY_OPERATIONS
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-widest text-on-surface-variant">
            [TASKS: {completedCount}/{totalCount}]
          </span>
          <Link
            to="/operations"
            className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
          >
            VIEW_ALL {'>>'}
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-8 text-center space-y-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_OPERATIONS_CONFIGURED
          </p>
          <Link
            to="/operations"
            className="inline-block text-[9px] font-bold tracking-widest uppercase text-primary hover:underline"
          >
            {'>'} CONFIGURE_OPERATIONS
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-surface-container-high">
          {items.map((item) => {
            const isComplete = item.log?.completedAt !== null && item.log?.completedAt !== undefined
            return (
              <div key={item.template.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-base ${isComplete ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {isComplete ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${isComplete ? 'text-primary' : 'text-on-surface'}`}>
                    {item.template.name}
                  </span>
                </div>
                <span className={`text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 ${
                  isComplete
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isComplete ? 'SUCCESS' : 'PENDING'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
