import { useMemo, useRef, useState } from 'react'
import type { FoodItem, RecipeIngredient } from '@HabitTree/types'
import { calculateFoodMacros, calculateRecipeMacros } from '../api/macro-calc'

interface Props {
  foodItems: FoodItem[]
  onClose: () => void
  onSubmit: (data: {
    name: string
    ingredients: RecipeIngredient[]
    totalCalories: number
    totalProteinG: number
    totalCarbsG: number
    totalFatG: number
    totalWeightG: number
  }) => void
}

export function RecipeBuilder({ foodItems, onClose, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState<
    Array<{ foodItemId: string; amountG: number }>
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return foodItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q),
      )
      .slice(0, 5)
  }, [searchQuery, foodItems])

  const totals = useMemo(
    () => calculateRecipeMacros(ingredients, foodItems),
    [ingredients, foodItems],
  )

  const foodMap = useMemo(
    () => new Map(foodItems.map((f) => [f.id, f])),
    [foodItems],
  )

  function addIngredient(item: FoodItem) {
    setIngredients((prev) => [...prev, { foodItemId: item.id, amountG: 100 }])
    setSearchQuery('')
    setShowDropdown(false)
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAmount(index: number, amountG: number) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, amountG } : ing)),
    )
  }

  const canSubmit = name.trim() !== '' && ingredients.length > 0

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      ingredients,
      ...totals,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/90 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-surface-container w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
            {'>'} BUILD_RECIPE
          </span>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            RECIPE_DESIGNATION
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="DESIGNATION..."
            className="w-full bg-surface-container-high px-4 py-3 text-on-surface font-mono text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            INGREDIENT_SELECTOR
          </label>
          <div ref={searchRef} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 150)
              }}
              placeholder="SEARCH_FOOD_ITEMS..."
              className="w-full bg-surface-container-high px-4 py-3 text-on-surface font-mono text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            {showDropdown && filteredItems.length > 0 && (
              <div className="absolute z-10 left-0 right-0 top-full bg-surface-container-high">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addIngredient(item)}
                    className="w-full text-left px-4 py-2 hover:bg-surface-container-highest cursor-pointer text-on-surface font-mono text-sm"
                  >
                    {item.name}
                    {item.brand && (
                      <span className="text-on-surface-variant ml-2 text-xs">
                        {item.brand}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
              INGREDIENTS_LIST
            </label>
            {ingredients.map((ing, index) => {
              const item = foodMap.get(ing.foodItemId)
              if (!item) return null
              const macros = calculateFoodMacros(item, ing.amountG)
              return (
                <div
                  key={`${ing.foodItemId}-${index}`}
                  className="bg-surface-container-low px-4 py-3 flex items-center gap-3"
                >
                  <span className="text-on-surface font-mono text-sm flex-1 truncate">
                    {item.name}
                  </span>
                  <input
                    type="number"
                    value={ing.amountG}
                    onChange={(e) =>
                      updateAmount(index, Number(e.target.value) || 0)
                    }
                    className="w-20 bg-surface-container-high px-3 py-2 text-on-surface font-mono text-sm text-right outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-on-surface-variant text-xs font-bold">
                    G
                  </span>
                  <span className="text-on-surface-variant font-mono text-xs whitespace-nowrap">
                    {macros.calories}kcal
                  </span>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                </div>
              )
            })}

            <div className="bg-surface-container px-4 py-3 flex items-center gap-4">
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  WEIGHT
                </span>
                <span className="text-sm font-black font-mono text-primary">
                  {totals.totalWeightG}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  PROTEIN
                </span>
                <span className="text-sm font-black font-mono text-primary">
                  {totals.totalProteinG}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  CARBS
                </span>
                <span className="text-sm font-black font-mono text-primary">
                  {totals.totalCarbsG}g
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  FAT
                </span>
                <span className="text-sm font-black font-mono text-primary">
                  {totals.totalFatG}g
                </span>
              </div>
              <div className="ml-auto">
                <span className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  CALORIES
                </span>
                <span className="text-sm font-black font-mono text-primary">
                  {totals.totalCalories}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase px-6 py-3 hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          SAVE_RECIPE
        </button>
      </div>
    </div>
  )
}
