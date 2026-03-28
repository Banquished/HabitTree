import type { ActivityLevel, BioProfile } from '@HabitTree/types'

interface Props {
  profile: BioProfile
  onUpdate: (patch: Partial<BioProfile>) => void
}

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'SEDENTARY', desc: 'DESK_JOB // <2_DAYS' },
  { value: 'light', label: 'LIGHT_MOD', desc: '3-5_DAYS // MODERATE' },
  { value: 'athletic', label: 'ATHLETIC', desc: '6-7_DAYS // HIGH_INT' },
  { value: 'extreme', label: 'EXTREME', desc: '2X_DAILY // PHYS_LABOR' },
]

export function PhysicalCoordinates({ profile, onUpdate }: Props) {
  const customTdeeEnabled = profile.customTdee !== null

  return (
    <section className="bg-surface-container p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">body_system</span>
          <h2 className="text-sm font-black tracking-tight uppercase text-on-surface">
            [01] PHYSICAL_COORDINATES
          </h2>
        </div>
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          SEGMENT_01:PHYSIOLOGY
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _AGE_YRS
          </span>
          <input
            type="number"
            value={profile.age || ''}
            onChange={(e) => onUpdate({ age: Number(e.target.value) })}
            className="w-full rounded-none bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _SEX_IDENT
          </span>
          <select
            value={profile.sex}
            onChange={(e) => onUpdate({ sex: e.target.value as BioProfile['sex'] })}
            className="w-full rounded-none bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
          >
            <option value="male">MALE_XY</option>
            <option value="female">FEMALE_XX</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _WEIGHT_KG
          </span>
          <input
            type="number"
            step={0.1}
            value={profile.weightKg || ''}
            onChange={(e) => onUpdate({ weightKg: Number(e.target.value) })}
            className="w-full rounded-none bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="space-y-1">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            _HEIGHT_CM
          </span>
          <input
            type="number"
            value={profile.heightCm || ''}
            onChange={(e) => onUpdate({ heightCm: Number(e.target.value) })}
            className="w-full rounded-none bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </label>
      </div>

      <div className="space-y-1">
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          _ACTIVITY_COEFFICIENT
        </span>
        <div className="grid grid-cols-4 gap-1">
          {ACTIVITY_OPTIONS.map(({ value, label, desc }) => {
            const active = profile.activityLevel === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onUpdate({ activityLevel: value })}
                className={`rounded-none px-2 py-2 text-[10px] tracking-wider uppercase transition-colors cursor-pointer ${
                  active
                    ? 'bg-primary text-on-primary font-black'
                    : 'bg-surface-container-high text-on-surface-variant font-bold hover:text-on-surface'
                }`}
              >
                {label}
                <span
                  className={`block text-[8px] ${
                    active ? 'text-on-primary/70' : 'text-on-surface-variant'
                  }`}
                >
                  {desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
          _TDEE_OVERRIDE
        </span>
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={customTdeeEnabled}
              onChange={(e) => {
                if (!e.target.checked) {
                  onUpdate({ customTdee: null })
                } else {
                  onUpdate({ customTdee: 2000 })
                }
              }}
              className="sr-only peer"
            />
            <div className="w-4 h-4 border-2 border-on-surface-variant peer-checked:border-primary peer-checked:bg-primary transition-colors flex items-center justify-center">
              {customTdeeEnabled && (
                <span className="material-symbols-outlined text-on-primary text-xs">check</span>
              )}
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant">
            ENABLE_CUSTOM_TDEE
          </span>
        </label>
        {customTdeeEnabled && (
          <input
            type="number"
            value={profile.customTdee ?? ''}
            onChange={(e) => onUpdate({ customTdee: Number(e.target.value) })}
            className="w-full rounded-none bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="KCAL"
          />
        )}
      </div>
    </section>
  )
}
