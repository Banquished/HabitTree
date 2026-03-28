import { useMemo } from 'react'
import type { WeightEntry } from '@HabitTree/types'

interface Props {
  entries: WeightEntry[]
  goalKg: number
}

export function MetricCards({ entries, goalKg }: Props) {
  const metrics = useMemo(() => {
    if (!entries.length) return null

    const sorted = [...entries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const latest = sorted[0]
    const now = new Date()

    // Delta 30d
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const oldEntry = sorted.find((e) => new Date(e.timestamp) <= thirtyDaysAgo)
    const delta30d = oldEntry ? latest.weightKg - oldEntry.weightKg : 0

    // Last update
    const lastUpdateMs = now.getTime() - new Date(latest.timestamp).getTime()
    const lastUpdateHours = Math.round(lastUpdateMs / (1000 * 60 * 60) * 10) / 10
    const lastUpdateLabel =
      lastUpdateHours < 1 ? 'JUST NOW' :
      lastUpdateHours < 24 ? `${lastUpdateHours.toFixed(1)}H AGO` :
      `${Math.round(lastUpdateHours / 24)}D AGO`

    // Goal progress
    const startWeight = sorted[sorted.length - 1].weightKg
    const totalDelta = startWeight - goalKg
    const currentDelta = startWeight - latest.weightKg
    const goalProgress = totalDelta > 0 ? Math.min(100, Math.round((currentDelta / totalDelta) * 100)) : 0

    // System health
    const recentEntries = sorted.filter(
      (e) => new Date(e.timestamp) >= thirtyDaysAgo
    ).length
    const trending = delta30d < 0
    const health =
      recentEntries >= 8 && trending ? 'EXCELLENT' :
      recentEntries >= 4 && trending ? 'GOOD' :
      recentEntries >= 4 ? 'FAIR' : 'DEGRADED'

    return { latest, delta30d, lastUpdateLabel, goalProgress, health }
  }, [entries, goalKg])

  if (!metrics) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Delta 30D */}
      <div className="bg-surface-container-low p-5 group hover:bg-surface-container transition-colors">
        <div className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">
          DELTA_30D
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-black italic font-mono ${metrics.delta30d <= 0 ? 'text-primary glow-sm' : 'text-error'}`}>
            {metrics.delta30d > 0 ? '+' : ''}{metrics.delta30d.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-on-surface-variant tracking-widest">KG</span>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-primary tracking-widest uppercase">
          <span className="material-symbols-outlined text-xs">
            {metrics.delta30d <= 0 ? 'trending_down' : 'trending_up'}
          </span>
          {metrics.delta30d <= 0 ? 'TARGET_ON_TRACK' : 'ABOVE_BASELINE'}
        </div>
      </div>

      {/* Current Median */}
      <div className="bg-surface-container-low p-5 group hover:bg-surface-container transition-colors">
        <div className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">
          CURRENT_MEDIAN
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black italic font-mono text-on-surface">
            {metrics.latest.weightKg.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-on-surface-variant tracking-widest">KG</span>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">
          <span className="material-symbols-outlined text-xs">history</span>
          LAST_UPDATE: {metrics.lastUpdateLabel}
        </div>
      </div>

      {/* System Goal */}
      <div className="bg-surface-container-low p-5 group hover:bg-surface-container transition-colors">
        <div className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase mb-4">
          SYSTEM_GOAL
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black italic font-mono text-on-surface">
            {goalKg.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-on-surface-variant tracking-widest">KG</span>
        </div>
        <div className="mt-4 w-full bg-surface-container-high h-1.5">
          <div className="h-full bg-primary" style={{ width: `${metrics.goalProgress}%` }} />
        </div>
        <div className="mt-2 text-[8px] font-bold text-on-surface-variant tracking-widest text-right">
          {metrics.goalProgress}%_COMPLETED
        </div>
      </div>

      {/* System Health */}
      <div className="bg-surface-container-low p-5 relative overflow-hidden group hover:bg-surface-container transition-colors">
        <div className="text-[9px] font-bold text-primary tracking-widest uppercase mb-4">
          SYSTEM_HEALTH
        </div>
        <div className="text-2xl font-black italic text-on-surface uppercase tracking-tighter">
          {metrics.health}
        </div>
      </div>
    </div>
  )
}
