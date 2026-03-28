import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { WeightEntry } from '@HabitTree/types'

interface Props {
  entries: WeightEntry[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-surface-container p-3 ghost-border">
      <p className="text-[9px] font-bold text-on-surface-variant tracking-widest uppercase">{data.date}</p>
      <p className="text-lg font-black text-primary">{data.weight.toFixed(1)} KG</p>
    </div>
  )
}

export function WeightChart({ entries }: Props) {
  const { chartData, peak, low, trend } = useMemo(() => {
    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const filtered = entries
      .filter((e) => new Date(e.timestamp) >= ninetyDaysAgo)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const chartData = filtered.map((e) => ({
      date: new Date(e.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: e.weightKg,
    }))

    const weights = filtered.map((e) => e.weightKg)
    const peak = weights.length ? Math.max(...weights) : 0
    const low = weights.length ? Math.min(...weights) : 0

    // Trend: compare average of first third vs last third
    const third = Math.ceil(weights.length / 3)
    const firstAvg = weights.slice(0, third).reduce((a, b) => a + b, 0) / third || 0
    const lastAvg = weights.slice(-third).reduce((a, b) => a + b, 0) / third || 0
    const trend = lastAvg < firstAvg - 0.5 ? 'DECLINING' : lastAvg > firstAvg + 0.5 ? 'INCREASING' : 'STABLE'

    return { chartData, peak, low, trend }
  }, [entries])

  return (
    <div
      className="lg:col-span-2 bg-surface-container-low p-6"
      role="img"
      aria-label={`Weight trend chart showing the last 90 days. ${chartData.length} data points. ${chartData.length ? `Peak: ${peak.toFixed(1)} KG, Low: ${low.toFixed(1)} KG, Trend: ${trend}` : 'No data available.'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
            VISUAL_DATA_READOUT [90_DAYS]
          </span>
        </div>
      </div>

      <div className="h-64 w-full relative [&_.recharts-line-curve]:drop-shadow-[0_0_6px_rgba(171,255,2,0.5)]">
        {chartData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-2">show_chart</span>
              <p className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant">
                NO_DATA_IN_RANGE
              </p>
              <p className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mt-1">
                LOG_WEIGHT_TO_GENERATE_VISUAL
              </p>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="date"
              stroke="#8b947a"
              tick={{ fontSize: 10, fill: '#8b947a' }}
              axisLine={false}
              tickLine={false}
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
              dataKey="weight"
              stroke="#ABFF02"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0e0e0e', stroke: '#ABFF02', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#ABFF02' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] font-bold">
        <div className="flex gap-6">
          <span className="text-on-surface-variant">
            PEAK: <span className="text-on-surface">{peak.toFixed(1)} KG</span>
          </span>
          <span className="text-on-surface-variant">
            LOW: <span className="text-on-surface">{low.toFixed(1)} KG</span>
          </span>
        </div>
        <span className="text-primary glow-sm tracking-widest uppercase">
          TREND: {trend}
        </span>
      </div>
    </div>
  )
}
