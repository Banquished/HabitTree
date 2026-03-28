import { useMemo, useState } from 'react'
import { useOperationHeatmap } from '../../operations/api/use-operation-heatmap'
import { formatLocalDate } from '@/shared/date-utils'
import type { HeatmapDay } from '@HabitTree/types'

const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const DAY_LABELS = [
  { index: 1, label: 'M' },
  { index: 3, label: 'W' },
  { index: 5, label: 'F' },
]

function getRateClass(rate: number): string {
  if (rate <= 0) return 'bg-surface-container'
  if (rate <= 0.25) return 'bg-primary/20'
  if (rate <= 0.5) return 'bg-primary/40'
  if (rate <= 0.75) return 'bg-primary/60'
  return 'bg-primary'
}

interface GridCell {
  date: string
  day: HeatmapDay | null
  weekIndex: number
  dayIndex: number
}

function daysInYear(year: number): number {
  return (new Date(year, 1, 29).getMonth() === 1) ? 366 : 365
}

export function HabitHeatmap() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const { data: heatmapData = [] } = useOperationHeatmap(year)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  const { grid, monthPositions, totalWeeks } = useMemo(() => {
    const totalDays = daysInYear(year)

    const dayMap = new Map<string, HeatmapDay>()
    for (const d of heatmapData) {
      dayMap.set(d.date, d)
    }

    const cells: GridCell[] = []
    let weekIndex = 0
    const months = new Map<number, number>()

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(year, 0, 1 + i)
      const dateStr = formatLocalDate(d)
      // Monday = 0, Sunday = 6
      const dayOfWeek = (d.getDay() + 6) % 7

      if (i > 0 && dayOfWeek === 0) {
        weekIndex++
      }

      // Track first week each month starts
      if (dayOfWeek === 0 || i === 0) {
        const month = d.getMonth()
        if (!months.has(month)) {
          months.set(month, weekIndex)
        }
      }
      // Also track month start day even if not Monday
      const month = d.getMonth()
      if (d.getDate() === 1 && !months.has(month)) {
        months.set(month, weekIndex)
      }

      cells.push({
        date: dateStr,
        day: dayMap.get(dateStr) ?? null,
        weekIndex,
        dayIndex: dayOfWeek,
      })
    }

    return {
      grid: cells,
      monthPositions: Array.from(months.entries()).sort((a, b) => a[0] - b[0]),
      totalWeeks: weekIndex + 1,
    }
  }, [heatmapData, year])

  function handleCellHover(e: React.MouseEvent, cell: GridCell) {
    const day = cell.day
    const completed = day?.completed ?? 0
    const total = day?.total ?? 0
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    const text = `${cell.date} // ${completed}/${total} (${rate}%)`
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setTooltip({ x: rect.left + rect.width / 2, y: rect.top, text })
  }

  return (
    <div className="bg-surface-container-low">
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} HABIT_HEATMAP
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            aria-label="Previous year"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <span className="text-[10px] font-black tracking-widest text-on-surface tabular-nums">
            {year}
          </span>
          <button
            onClick={() => setYear((y) => Math.min(y + 1, currentYear))}
            disabled={year >= currentYear}
            className={`transition-colors cursor-pointer ${
              year >= currentYear
                ? 'text-surface-container-high cursor-default'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            aria-label="Next year"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      {grid.length === 0 ? (
        <div className="px-6 py-12 text-center space-y-3">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">
            grid_on
          </span>
          <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_HEATMAP_DATA
          </p>
          <p className="text-[9px] tracking-widest uppercase text-on-surface-variant">
            COMPLETE_OPERATIONS_TO_POPULATE
          </p>
        </div>
      ) : (
        <div className="px-6 py-4 overflow-x-auto">
          <div
            className="relative text-[8px] font-bold text-on-surface-variant tracking-widest mb-[2px]"
            style={{ marginLeft: '20px' }}
          >
            {monthPositions.map(([month, weekIdx]) => (
              <span
                key={month}
                className="absolute"
                style={{ left: `${(weekIdx / totalWeeks) * 100}%` }}
              >
                {MONTH_LABELS[month]}
              </span>
            ))}
            <span className="invisible">X</span>
          </div>

          <div className="flex gap-1 mt-2">
            <div className="flex flex-col shrink-0" style={{ gap: '2px' }}>
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                const dayLabel = DAY_LABELS.find((d) => d.index === dayIdx)
                return (
                  <div key={dayIdx} className="w-3 flex items-center justify-end pr-1" style={{ aspectRatio: '1' }}>
                    <span className="text-[8px] font-bold text-on-surface-variant leading-none">
                      {dayLabel?.label ?? ''}
                    </span>
                  </div>
                )
              })}
            </div>

            <div
              role="grid"
              aria-label={`Habit completion heatmap for ${year}`}
              className="grid flex-1"
              style={{
                gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
                gridTemplateRows: 'repeat(7, 1fr)',
                gap: '2px',
              }}
            >
              {grid.map((cell) => {
                const rate = cell.day?.rate ?? 0
                return (
                  <div
                    key={cell.date}
                    role="gridcell"
                    aria-label={`${cell.date}: ${cell.day?.completed ?? 0}/${cell.day?.total ?? 0} completed`}
                    className={`aspect-square rounded-[1px] ${getRateClass(rate)} cursor-pointer`}
                    style={{
                      gridColumn: cell.weekIndex + 1,
                      gridRow: cell.dayIndex + 1,
                    }}
                    onMouseEnter={(e) => handleCellHover(e, cell)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 mt-3">
            <span className="text-[8px] font-bold text-on-surface-variant tracking-widest mr-1">LESS</span>
            {[
              'bg-surface-container',
              'bg-primary/20',
              'bg-primary/40',
              'bg-primary/60',
              'bg-primary',
            ].map((cls) => (
              <div key={cls} className={`w-[11px] h-[11px] rounded-[1px] ${cls}`} />
            ))}
            <span className="text-[8px] font-bold text-on-surface-variant tracking-widest ml-1">MORE</span>
          </div>
        </div>
      )}

      {tooltip && (
        <div
          className="fixed z-50 bg-surface-container-high px-3 py-2 text-[9px] font-bold tracking-widest text-on-surface font-mono pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 32,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
