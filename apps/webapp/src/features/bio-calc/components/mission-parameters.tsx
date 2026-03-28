import type { BioProfile, GoalType, MacroSplit } from '@HabitTree/types'
import { getDefaultMacroSplit } from '../api/calculations'

interface Props {
  profile: BioProfile
  targetCalories: number | null
  onUpdate: (patch: Partial<BioProfile>) => void
}

const GOAL_OPTIONS: { value: GoalType; label: string; tag: string }[] = [
  { value: 'cut', label: 'FAT_LOSS_PROTOCOL', tag: 'CUT' },
  { value: 'bulk', label: 'HYPERTROPHY_DRIVE', tag: 'BULK' },
  { value: 'maintain', label: 'HOMEOSTASIS_LOAD', tag: 'MAINTAIN' },
]

const CAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const

const numberInputClass =
  'w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

export function MissionParameters({ profile, targetCalories, onUpdate }: Props) {
  const paddedWeeks = String(profile.durationWeeks).padStart(2, '0')
  const defaultSplit = getDefaultMacroSplit(profile.goalType)
  const macros: MacroSplit = profile.customMacros ?? defaultSplit
  const macroSum = macros.proteinPct + macros.carbsPct + macros.fatPct
  const sumValid = macroSum === 100

  const sign = profile.calorieAdjustment >= 0 ? '+' : ''
  const adjDisplay = `${sign}${profile.calorieAdjustment} KCAL`

  function gramsOf(pct: number, calPerG: number): string {
    if (targetCalories == null) return '—'
    return `${Math.round((targetCalories * pct) / 100 / calPerG)}G`
  }

  function updateMacro(key: keyof MacroSplit, value: number) {
    const next: MacroSplit = { ...macros, [key]: value }
    onUpdate({ customMacros: next })
  }

  return (
    <section className="bg-surface-container p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">flag</span>
          <h2 className="text-sm font-black tracking-tight uppercase text-on-surface">
            [02] MISSION_PARAMETERS
          </h2>
        </div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          SEGMENT_02:OBJECTIVES
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _DIET_DURATION_WKS
          </span>
          <div className="text-2xl font-black tracking-tighter uppercase text-on-surface">
            {paddedWeeks}_WEEKS
          </div>
          <input
            type="range"
            min={4}
            max={24}
            value={profile.durationWeeks}
            onChange={(e) => onUpdate({ durationWeeks: Number(e.target.value) })}
            className="w-full rounded-none"
          />
          <div className="flex justify-between">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              04_WKS
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              24_WKS
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _GOAL_SELECTOR
          </span>
          <div className="flex flex-col gap-1">
            {GOAL_OPTIONS.map(({ value, label, tag }) => {
              const selected = profile.goalType === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onUpdate({ goalType: value })}
                  className={`flex items-center gap-2 rounded-none px-3 py-2 text-left transition-colors ${
                    selected
                      ? 'bg-primary text-on-primary font-black'
                      : 'bg-surface-container-high text-on-surface-variant font-bold hover:text-on-surface'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 flex-shrink-0 ${
                      selected ? 'bg-on-primary' : 'border border-on-surface-variant'
                    }`}
                  />
                  <span className="text-[10px] tracking-wider uppercase">
                    {label} [{tag}]
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _GOAL_WEIGHT_KG
          </span>
          <input
            type="number"
            step={0.1}
            value={profile.goalWeightKg || ''}
            onChange={(e) => onUpdate({ goalWeightKg: Number(e.target.value) })}
            className={numberInputClass}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _MISSION_START_DATE
          </span>
          <input
            type="date"
            value={profile.missionStartDate}
            onChange={(e) => onUpdate({ missionStartDate: e.target.value })}
            className="w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          _CALORIE_ADJUSTMENT (KCAL)
        </span>
        <div className="text-2xl font-black tracking-tighter uppercase text-on-surface">
          {adjDisplay}
        </div>
        <input
          type="range"
          min={-1000}
          max={1000}
          step={25}
          value={profile.calorieAdjustment}
          onChange={(e) => onUpdate({ calorieAdjustment: Number(e.target.value) })}
          className="w-full rounded-none"
        />
        <div className="flex justify-between">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            -1000
          </span>
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            +1000
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _MACRO_PROTOCOL
          </span>
          <button
            type="button"
            onClick={() => onUpdate({ customMacros: null })}
            className="text-[8px] font-black tracking-widest uppercase text-primary hover:text-on-surface"
          >
            RESET_TO_PRESET
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              PROTEIN_%
            </span>
            <input
              type="number"
              value={macros.proteinPct}
              onChange={(e) => updateMacro('proteinPct', Number(e.target.value))}
              className={numberInputClass}
            />
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              = {gramsOf(macros.proteinPct, CAL_PER_GRAM.protein)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              CARBS_%
            </span>
            <input
              type="number"
              value={macros.carbsPct}
              onChange={(e) => updateMacro('carbsPct', Number(e.target.value))}
              className={numberInputClass}
            />
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              = {gramsOf(macros.carbsPct, CAL_PER_GRAM.carbs)}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              LIPIDS_%
            </span>
            <input
              type="number"
              value={macros.fatPct}
              onChange={(e) => updateMacro('fatPct', Number(e.target.value))}
              className={numberInputClass}
            />
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              = {gramsOf(macros.fatPct, CAL_PER_GRAM.fat)}
            </span>
          </div>
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${sumValid ? 'text-primary' : 'text-error'}`}>
          TOTAL: {macroSum}%
        </span>
      </div>
    </section>
  )
}
