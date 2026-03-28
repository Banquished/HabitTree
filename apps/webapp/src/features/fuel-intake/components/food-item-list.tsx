import { useState } from 'react'
import type { FoodItem } from '@HabitTree/types'
import { ConfirmDialog } from '@/shared/confirm-dialog'

interface Props {
  foodItems: FoodItem[]
  onEdit: (item: FoodItem) => void
  onRemove: (id: string) => void
  onLogFromFood: (item: FoodItem) => void
  onCreateNew: () => void
}

export function FoodItemList({ foodItems, onEdit, onRemove, onLogFromFood, onCreateNew }: Props) {
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const filtered = foodItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="bg-surface-container px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          {'> FOOD_DATABASE'}
        </span>
        <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          {filtered.length} ITEMS
        </span>
      </div>

      <div className="bg-surface-container-high px-4 py-3">
        <label className="font-mono text-[10px] text-on-surface-variant label-tracked">SEARCH</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. chicken breast"
          className="w-full bg-transparent text-[10px] font-bold tracking-widest uppercase text-on-surface placeholder:text-on-surface-variant outline-none mt-1"
        />
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="px-6 py-8 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
            NO_MATCHES_FOUND
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low px-6 py-3 flex items-center gap-4 group hover:bg-surface-container transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black uppercase tracking-tight text-on-surface truncate">
                  {item.name}
                </div>
                {item.brand && (
                  <div className="text-[10px] font-bold text-on-surface-variant tracking-widest">
                    {item.brand}
                  </div>
                )}
              </div>

              <div className="text-[10px] font-bold text-on-surface-variant tracking-widest whitespace-nowrap">
                P: {item.proteinPer100g}G | C: {item.carbsPer100g}G | F: {item.fatPer100g}G |{' '}
                {item.caloriesPer100g} KCAL
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLogFromFood(item)}
                  className="opacity-60 hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-primary cursor-pointer"
                  aria-label="Log food item"
                >
                  add_circle
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="opacity-60 hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-on-surface-variant hover:text-primary cursor-pointer"
                  aria-label="Edit food item"
                >
                  edit
                </button>
                <button
                  onClick={() => setDeleteTarget(item.id)}
                  className="opacity-60 hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-error cursor-pointer"
                  aria-label="Delete food item"
                >
                  delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onCreateNew}
        className="w-full py-3 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
      >
        CREATE_NEW_FOOD
      </button>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) { onRemove(deleteTarget); setDeleteTarget(null) } }}
        title="CONFIRM_DELETION"
        message="This action cannot be undone. The record will be permanently removed."
      />
    </div>
  )
}
