import { useState } from 'react'
import type { MealProtocol, Recipe } from '@HabitTree/types'
import { ConfirmDialog } from '@/shared/confirm-dialog'

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
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'protocol' | 'recipe' } | null>(null)

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
              className="w-full bg-primary min-h-[44px] py-3 text-on-primary text-[10px] font-black tracking-widest uppercase cursor-pointer"
            >
              LOG_INTAKE
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget({ id: recipe.id, type: 'recipe' })}
              className="opacity-60 hover:opacity-100 text-error text-[8px] transition-opacity cursor-pointer min-h-[44px] px-2"
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
              className="w-full bg-primary min-h-[44px] py-3 text-on-primary text-[10px] font-black tracking-widest uppercase cursor-pointer"
            >
              LOG_INTAKE
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget({ id: protocol.id, type: 'protocol' })}
              className="opacity-60 hover:opacity-100 text-error text-[8px] transition-opacity cursor-pointer min-h-[44px] px-2"
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
          className="w-full border border-dashed border-surface-container-high py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:border-primary transition-colors cursor-pointer"
        >
          BUILD_RECIPE
        </button>
        <button
          type="button"
          onClick={onCreateProtocol}
          className="w-full border border-dashed border-surface-container-high py-3 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:border-primary transition-colors cursor-pointer"
        >
          ADD_MANUAL_ENTRY_TEMPLATE
        </button>
        <button
          type="button"
          onClick={onManageFoods}
          className="w-full py-2 text-[9px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          MANAGE_FOOD_DATABASE {'>>'}
        </button>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return
          if (deleteTarget.type === 'protocol') onRemoveProtocol(deleteTarget.id)
          else onRemoveRecipe(deleteTarget.id)
          setDeleteTarget(null)
        }}
        title="CONFIRM_DELETION"
        message="This action cannot be undone. The record will be permanently removed."
      />
    </div>
  )
}
