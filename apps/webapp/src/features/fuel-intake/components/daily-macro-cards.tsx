import { MacroProgressCard } from './macro-progress-card'

interface DailyMacros {
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
  totalCalories: number
}

interface MacroTargets {
  proteinG: number
  carbsG: number
  fatG: number
  targetCalories: number
}

interface Props {
  dailyMacros: DailyMacros
  macroTargets: MacroTargets | null
  vertical?: boolean
}

export function DailyMacroCards({ dailyMacros, macroTargets, vertical }: Props) {
  return (
    <div className={vertical ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-3 gap-3'}>
      <MacroProgressCard
        label="PROTEIN INTAKE"
        currentG={dailyMacros.totalProteinG}
        targetG={macroTargets?.proteinG ?? null}
        priorityNote="HIGH PRIORITY"
      />
      <MacroProgressCard
        label="CARBOHYDRATES"
        currentG={dailyMacros.totalCarbsG}
        targetG={macroTargets?.carbsG ?? null}
        priorityNote="GLYCOGEN LOAD"
      />
      <MacroProgressCard
        label="FAT INTAKE"
        currentG={dailyMacros.totalFatG}
        targetG={macroTargets?.fatG ?? null}
        priorityNote="HORMONAL SUPPORT"
      />
    </div>
  )
}
