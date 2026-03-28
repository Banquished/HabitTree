import type { MealProtocol, Recipe } from '@HabitTree/types'

interface Props {
  protocols: MealProtocol[]
  recipes: Recipe[]
  onExecuteProtocol: (protocol: MealProtocol) => void
  onLogRecipe: (recipe: Recipe) => void
  onRemoveProtocol: (id: string) => void
  onRemoveRecipe: (id: string) => void
  onCreateProtocol: () => void
  onBuildRecipe: () => void
  onManageFoods: () => void
}

export function QuickMenu({
  protocols,
  recipes,
  onExecuteProtocol,
  onLogRecipe,
  onRemoveProtocol,
  onRemoveRecipe,
  onCreateProtocol,
  onBuildRecipe,
  onManageFoods,
}: Props) {
  const hasItems = protocols.length > 0 || recipes.length > 0

  return (
    <div className="bg-surface-container p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-sm">bolt</span>
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase italic">
          QUICK_LOG_MENU
        </span>
      </div>

      {!hasItems && (
        <div className="py-6 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          NO_QUICK_LOG_ITEMS // CREATE_BELOW
        </div>
      )}

      {/* Recipes */}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-surface-container-low p-4 space-y-2 group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-tight uppercase text-on-surface">
              {recipe.name}
            </span>
            <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[8px] font-bold tracking-widest">
              RECIPE
            </span>
          </div>

          <div className="text-[9px] font-bold text-on-surface-variant tracking-wide">
            {recipe.ingredients.length} INGREDIENTS // {recipe.totalWeightG}G
          </div>

          <div className="text-[9px] font-bold font-mono text-on-surface-variant tracking-widest">
            P:{Math.round(recipe.totalProteinG)}G | C:{Math.round(recipe.totalCarbsG)}G | F:{Math.round(recipe.totalFatG)}G — {recipe.totalCalories} KCAL
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLogRecipe(recipe)}
              className="w-full bg-primary py-2 text-on-primary text-[10px] font-black tracking-widest uppercase"
            >
              LOG_INTAKE
            </button>
            <button
              type="button"
              onClick={() => onRemoveRecipe(recipe.id)}
              className="opacity-0 group-hover:opacity-100 text-error text-[8px] transition-opacity"
            >
              DELETE
            </button>
          </div>
        </div>
      ))}

      {/* Protocols */}
      {protocols.map((protocol) => (
        <div key={protocol.id} className="bg-surface-container-low p-4 space-y-2 group">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black tracking-tight uppercase text-on-surface">
              {protocol.name}
            </span>
            <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant text-[8px] font-bold tracking-widest">
              {protocol.version}
            </span>
          </div>

          <div className="text-[9px] font-bold text-on-surface-variant tracking-wide line-clamp-1">
            {protocol.ingredientsDesc}
          </div>

          <div className="text-[9px] font-bold font-mono text-on-surface-variant tracking-widest">
            P:{protocol.proteinG}G | C:{protocol.carbsG}G | F:{protocol.fatG}G — {protocol.calories} KCAL
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onExecuteProtocol(protocol)}
              className="w-full bg-primary py-2 text-on-primary text-[10px] font-black tracking-widest uppercase"
            >
              LOG_INTAKE
            </button>
            <button
              type="button"
              onClick={() => onRemoveProtocol(protocol.id)}
              className="opacity-0 group-hover:opacity-100 text-error text-[8px] transition-opacity"
            >
              DELETE
            </button>
          </div>
        </div>
      ))}

      <div className="space-y-1 pt-1">
        <button
          type="button"
          onClick={onBuildRecipe}
          className="w-full border border-dashed border-surface-container-high py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
        >
          BUILD_RECIPE
        </button>
        <button
          type="button"
          onClick={onCreateProtocol}
          className="w-full border border-dashed border-surface-container-high py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:border-primary transition-colors"
        >
          ADD_MANUAL_ENTRY_TEMPLATE
        </button>
        <button
          type="button"
          onClick={onManageFoods}
          className="w-full py-2 text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors"
        >
          MANAGE_FOOD_DATABASE {'>>'}
        </button>
      </div>
    </div>
  )
}
