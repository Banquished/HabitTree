import type { Recipe } from '@HabitTree/types'

interface Props {
  recipes: Recipe[]
  onLog: (recipe: Recipe) => void
  onRemove: (id: string) => void
  onCreateNew: () => void
}

export function RecipeList({ recipes, onLog, onRemove, onCreateNew }: Props) {
  return (
    <div>
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          {'> SAVED_RECIPES'}
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          {recipes.length} RECIPES
        </span>
      </div>

      <div className="divide-y divide-surface-container-high">
        {recipes.length === 0 ? (
          <div className="px-6 py-8 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_RECIPES_CONFIGURED // BUILD_ONE_TO_START
          </div>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-surface-container-low px-6 py-4 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-black uppercase tracking-tight text-on-surface">
                  {recipe.name}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLog(recipe)}
                    className="px-4 py-2 bg-primary text-on-primary text-[9px] font-black tracking-widest uppercase"
                  >
                    LOG_INTAKE
                  </button>
                  <button
                    onClick={() => onRemove(recipe.id)}
                    className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-sm text-error transition-opacity"
                  >
                    delete
                  </button>
                </div>
              </div>

              <div className="text-[10px] font-bold text-on-surface-variant tracking-widest">
                {recipe.ingredients.length} INGREDIENTS // {recipe.totalWeightG}G TOTAL
              </div>

              <div className="text-[10px] font-bold text-on-surface-variant tracking-widest">
                P: {recipe.totalProteinG}G | C: {recipe.totalCarbsG}G | F: {recipe.totalFatG}G |{' '}
                {recipe.totalCalories} KCAL
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onCreateNew}
        className="w-full py-3 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
      >
        BUILD_NEW_RECIPE
      </button>
    </div>
  )
}
