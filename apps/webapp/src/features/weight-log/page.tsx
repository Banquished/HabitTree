import { useWeightEntries, useWeightGoal } from './api/use-weight-entries'
import { WeightChart } from './components/weight-chart'
import { WeightInput } from './components/weight-input'
import { MetricCards } from './components/metric-cards'
import { AuditLog } from './components/audit-log'

export function Component() {
  const { data: entries = [] } = useWeightEntries()
  const { data: goalKg = 80 } = useWeightGoal()

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
              {'>'} WEIGHT_LOG
            </span>
            <span className="cursor-blink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface uppercase italic">
            WEIGHT_LOG_METRICS
          </h1>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-1">
            SESSION_ID: {crypto.randomUUID().slice(0, 8).toUpperCase()}-X-METRIC-WEIGHT
          </p>
        </div>
        <div className="text-right text-[10px] font-bold text-on-surface-variant tracking-widest">
          LATENCY: 12MS
          <br />
          PACKETS: STABLE
        </div>
      </div>

      {/* Chart + Input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeightChart entries={entries} />
        <WeightInput />
      </div>

      {/* Metric Cards */}
      <MetricCards entries={entries} goalKg={goalKg} />

      {/* Audit Log */}
      <AuditLog entries={entries} />
    </div>
  )
}
