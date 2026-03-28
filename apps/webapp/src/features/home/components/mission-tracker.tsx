import { useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { Mission, MissionCheckpoint } from '@HabitTree/types'

interface Props {
  mission: Mission
  checkpoints: MissionCheckpoint[]
}

interface ChartDataPoint {
  week: number
  targetKg: number
  actualKg: number | null
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload as ChartDataPoint
  return (
    <div className="bg-surface-container-high p-3">
      <p className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">
        WEEK {data.week}
      </p>
      <p className="text-[10px] font-bold text-on-surface-variant tracking-widest mt-1">
        TARGET: <span className="text-on-surface">{data.targetKg.toFixed(1)} KG</span>
      </p>
      {data.actualKg !== null && (
        <p className="text-[10px] font-bold text-on-surface-variant tracking-widest">
          ACTUAL: <span className="text-primary">{data.actualKg.toFixed(1)} KG</span>
        </p>
      )}
    </div>
  )
}

function getDeltaColor(delta: number | null, goalType: Mission['goalType']): string {
  if (delta === null) return 'text-on-surface-variant'

  if (goalType === 'cut') {
    if (Math.abs(delta) <= 0.3) return 'text-on-surface'
    return delta < 0 ? 'text-primary' : 'text-error'
  }

  if (goalType === 'bulk') {
    if (Math.abs(delta) <= 0.3) return 'text-on-surface'
    return delta > 0 ? 'text-primary' : 'text-error'
  }

  return Math.abs(delta) <= 0.5 ? 'text-primary' : 'text-error'
}

function getStatus(delta: number | null, goalType: Mission['goalType']): { label: string; color: string } {
  if (delta === null) return { label: '--', color: 'text-on-surface-variant' }

  if (goalType === 'cut') {
    if (Math.abs(delta) <= 0.3) return { label: 'ON_TRACK', color: 'text-primary' }
    return delta < 0
      ? { label: 'AHEAD', color: 'text-primary' }
      : { label: 'BEHIND', color: 'text-error' }
  }

  if (goalType === 'bulk') {
    if (Math.abs(delta) <= 0.3) return { label: 'ON_TRACK', color: 'text-primary' }
    return delta > 0
      ? { label: 'AHEAD', color: 'text-primary' }
      : { label: 'BEHIND', color: 'text-error' }
  }

  return Math.abs(delta) <= 0.5
    ? { label: 'ON_TRACK', color: 'text-primary' }
    : { label: 'BEHIND', color: 'text-error' }
}

export function MissionTracker({ mission, checkpoints }: Props) {
  const chartData = useMemo(() => {
    const byWeek = new Map<number, ChartDataPoint>()

    for (const m of mission.milestones) {
      byWeek.set(m.week, { week: m.week, targetKg: m.targetKg, actualKg: null })
    }

    for (const cp of checkpoints) {
      const existing = byWeek.get(cp.week)
      if (existing) {
        existing.actualKg = cp.actualKg
      } else {
        byWeek.set(cp.week, { week: cp.week, targetKg: cp.targetKg, actualKg: cp.actualKg })
      }
    }

    return Array.from(byWeek.values()).sort((a, b) => a.week - b.week)
  }, [mission.milestones, checkpoints])

  return (
    <div className="bg-surface-container-low">
      <div className="bg-surface-container px-6 py-4">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} MISSION_TRACKER
        </span>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#2a2a2a" />
            <XAxis
              dataKey="week"
              stroke="#8b947a"
              tick={{ fontSize: 10, fill: '#8b947a' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `W${v}`}
            />
            <YAxis
              stroke="#8b947a"
              tick={{ fontSize: 10, fill: '#8b947a' }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 1', 'dataMax + 1']}
              tickFormatter={(v: number) => `${v}kg`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="targetKg"
              stroke="rgba(171, 255, 2, 0.4)"
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="actualKg"
              stroke="#ABFF02"
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3, fill: '#0e0e0e', stroke: '#ABFF02', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#ABFF02' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-bold text-[10px] tracking-tight">
          <thead>
            <tr className="text-on-surface-variant border-b border-surface-container-high">
              <th className="px-6 py-4 font-bold tracking-widest">WEEK</th>
              <th className="px-6 py-4 font-bold tracking-widest">TARGET_KG</th>
              <th className="px-6 py-4 font-bold tracking-widest">ACTUAL_KG</th>
              <th className="px-6 py-4 font-bold tracking-widest">DELTA</th>
              <th className="px-6 py-4 font-bold tracking-widest">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-high">
            {checkpoints.map((cp) => {
              const deltaColor = getDeltaColor(cp.deltaKg, mission.goalType)
              const status = getStatus(cp.deltaKg, mission.goalType)

              return (
                <tr key={cp.week} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-4 text-on-surface font-mono">W{cp.week}</td>
                  <td className="px-6 py-4 text-on-surface font-mono">{cp.targetKg.toFixed(1)}</td>
                  <td className="px-6 py-4 font-mono">
                    {cp.actualKg !== null ? (
                      <span className="text-primary font-black italic">{cp.actualKg.toFixed(1)}</span>
                    ) : (
                      <span className="text-on-surface-variant">--</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 font-mono ${deltaColor}`}>
                    {cp.deltaKg !== null ? (
                      `${cp.deltaKg > 0 ? '+' : ''}${cp.deltaKg.toFixed(1)}`
                    ) : (
                      <span className="text-on-surface-variant">--</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 font-mono tracking-widest ${status.color}`}>
                    {status.label}
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
