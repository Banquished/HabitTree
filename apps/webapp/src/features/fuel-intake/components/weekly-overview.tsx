import { useState } from 'react'
import { MacroProgressCard } from './macro-progress-card'
import type { WeeklyMacros } from '../api/use-weekly-macros'
import type { MacroTargets } from '../api/use-macro-targets'

interface Props {
  weeklyMacros: WeeklyMacros
  macroTargets: MacroTargets | null
}

function formatDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const day = dt.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${day} ${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}`
}

export function WeeklyOverview({ weeklyMacros, macroTargets }: Props) {
  const [expanded, setExpanded] = useState(false)

  const weeklyProteinTarget = macroTargets ? macroTargets.proteinG * 7 : null
  const weeklyCarbsTarget = macroTargets ? macroTargets.carbsG * 7 : null
  const weeklyFatTarget = macroTargets ? macroTargets.fatG * 7 : null
  const weeklyCaloriesTarget = macroTargets ? macroTargets.targetCalories * 7 : null

  return (
    <div className="bg-surface-container-low">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-surface-container px-6 py-4 flex items-center justify-between hover:bg-surface-container-high transition-colors"
      >
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          {'>'} WEEKLY_OVERVIEW [{formatDateLabel(weeklyMacros.weekStart)} — {formatDateLabel(weeklyMacros.weekEnd)}]
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
            {weeklyMacros.daysLogged}/7 DAYS_LOGGED
          </span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant">
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MacroProgressCard
              label="WEEKLY PROTEIN"
              currentG={weeklyMacros.totalProteinG}
              targetG={weeklyProteinTarget}
              priorityNote="7-DAY TOTAL"
            />
            <MacroProgressCard
              label="WEEKLY CARBOHYDRATES"
              currentG={weeklyMacros.totalCarbsG}
              targetG={weeklyCarbsTarget}
              priorityNote="7-DAY TOTAL"
            />
            <MacroProgressCard
              label="WEEKLY FAT"
              currentG={weeklyMacros.totalFatG}
              targetG={weeklyFatTarget}
              priorityNote="7-DAY TOTAL"
            />
          </div>

          <div className="bg-surface-container-low">
            <MacroProgressCard
              label="WEEKLY CALORIES"
              currentG={weeklyMacros.totalCalories}
              targetG={weeklyCaloriesTarget}
              priorityNote="7-DAY TOTAL"
              unit="KCAL"
            />
          </div>

          <div className="bg-surface-container px-6 py-4 flex flex-wrap gap-x-8 gap-y-2">
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              DAILY_AVG:
            </span>
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface">
              P: {weeklyMacros.avgProteinG}G
            </span>
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface">
              C: {weeklyMacros.avgCarbsG}G
            </span>
            <span className="text-[10px] font-bold font-mono tracking-widest text-on-surface">
              F: {weeklyMacros.avgFatG}G
            </span>
            <span className="text-[10px] font-bold font-mono tracking-widest text-primary">
              {weeklyMacros.avgCalories} KCAL
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
