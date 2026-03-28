import type { BioResult } from '@HabitTree/types'

interface Props {
  result: BioResult | null
}

function getSystemNote(result: BioResult): string {
  const abs = Math.abs(Math.round(result.calorieAdjustment))

  if (result.calorieAdjustment < -50) {
    return `Your current TDEE suggests a deficit of ${abs} kcal for the CUT mission. High protein intake is mandated for cellular repair. Protocol lock engaged.`
  }
  if (result.calorieAdjustment > 50) {
    return `Your current TDEE suggests a surplus of ${abs} kcal for the BULK mission. High protein intake is mandated for cellular repair. Protocol lock engaged.`
  }
  return `Your current TDEE is aligned with target intake for the MAINTAIN mission. High protein intake is mandated for cellular repair. Protocol lock engaged.`
}

const STATUS_LINES = [
  'FETCHING_METABOLIC_COEFFICIENTS...',
  'RUNNING_MIFFLIN_ST_JEOR_V2...',
  'HARMONIZING_MACRO_RATIOS...',
]

const MACROS = [
  { key: 'protein', label: 'PROTEIN', pctKey: 'proteinPct', gKey: 'proteinG' },
  { key: 'carbs', label: 'CARBOHYDRATES', pctKey: 'carbsPct', gKey: 'carbsG' },
  { key: 'fat', label: 'LIPIDS', pctKey: 'fatPct', gKey: 'fatG' },
] as const

export function ProcessedReadout({ result }: Props) {
  const hasCustomTdee = result ? result.effectiveTdee !== result.tdee : false

  return (
    <section className="bg-surface-container p-4 space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">monitoring</span>
          <h2 className="text-sm font-black tracking-tight uppercase text-on-surface">
            PROCESSED_READOUT
          </h2>
        </div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          CORE_SYSTEM_CALCULATION
        </span>
      </div>

      {!result ? (
        <div className="py-12 text-center">
          <p className="text-sm font-bold tracking-widest uppercase text-on-surface-variant">
            AWAITING_ANALYSIS...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-high p-3 space-y-1">
              <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                BASAL_METABOLIC_RATE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-on-surface">
                  {Math.round(result.bmr)}
                </span>
                <span className="text-xs font-bold text-on-surface-variant">KCAL</span>
              </div>
            </div>
            <div className="bg-surface-container-high p-3 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                  TOTAL_DAILY_EXPENSE
                </span>
                {hasCustomTdee && (
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black tracking-widest">
                    CUSTOM
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tighter text-on-surface">
                  {Math.round(result.effectiveTdee)}
                </span>
                <span className="text-xs font-bold text-on-surface-variant">KCAL</span>
              </div>
              {hasCustomTdee && (
                <span className="text-[9px] font-bold tracking-widest text-on-surface-variant">
                  FORMULA: {Math.round(result.tdee)} KCAL
                </span>
              )}
            </div>
          </div>

          <p className="text-[9px] font-bold font-mono tracking-widest text-on-surface-variant">
            TDEE {Math.round(result.effectiveTdee)} {result.calorieAdjustment >= 0 ? '+' : ''} ADJ {Math.round(result.calorieAdjustment)} = TARGET {Math.round(result.targetCalories)} KCAL
          </p>

          <div className="space-y-3">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              PROPOSED_MACRO_PROTOCOL
            </span>
            {MACROS.map(({ key, label, pctKey, gKey }) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
                    {label} ({Math.round(result[pctKey])}%)
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {Math.round(result[gKey])}G
                  </span>
                </div>
                <div className="h-2 bg-surface-container-high">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.round(result[pctKey])}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low p-4 space-y-2">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              [ SYSTEM_NOTE ]
            </span>
            <p className="text-[10px] font-bold leading-relaxed text-on-surface-variant">
              {getSystemNote(result)}
            </p>
          </div>

          <div className="space-y-1">
            {STATUS_LINES.map((line) => (
              <p key={line} className="text-[10px] font-mono font-bold text-on-surface-variant">
                {line} <span className="text-primary">[OK]</span>
              </p>
            ))}
            <p className="text-[10px] font-mono font-bold text-primary mt-2">
              {'>'} SYSTEM_READY_FOR_DEPLOYMENT
            </p>
          </div>
        </>
      )}
    </section>
  )
}
