interface Props {
  label: string
  currentG: number
  targetG: number | null
  priorityNote: string
  unit?: string
}

export function MacroProgressCard({ label, currentG, targetG, priorityNote, unit = 'G' }: Props) {
  const rawPct = targetG ? Math.round((currentG / targetG) * 100) : 0
  const barWidth = Math.min(100, rawPct)
  const status = rawPct <= 100 ? 'normal' : rawPct <= 110 ? 'warning' : 'error'

  const textColor = { normal: 'text-primary', warning: 'text-warning', error: 'text-error' }[status]
  const barColor = { normal: 'bg-primary', warning: 'bg-warning', error: 'bg-error' }[status]

  return (
    <div className="bg-surface-container-low p-5 space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          {label}
        </span>
        <span className={`${textColor} font-black`}>{rawPct}%</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter text-on-surface">{currentG}</span>
        <span className="text-xs font-bold text-on-surface-variant tracking-widest">{unit}</span>
      </div>
      <div className="h-1.5 bg-surface-container-high">
        <div className={`h-full ${barColor}`} style={{ width: `${barWidth}%` }} />
      </div>
      <div className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
        TARGET: {targetG !== null ? `${targetG} ${unit}` : '--'} / {targetG !== null ? priorityNote : 'NO_MISSION'}
      </div>
    </div>
  )
}
