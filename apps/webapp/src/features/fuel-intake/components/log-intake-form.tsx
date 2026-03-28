import { useState, useMemo } from 'react'
import type { FoodItem, Recipe } from '@HabitTree/types'
import { calculateFoodMacros } from '../api/macro-calc'

type SourceMode = 'manual' | 'food_item' | 'recipe'

interface Props {
  onClose: () => void
  onSubmit: (data: {
    timestamp: string
    name: string
    calories: number
    proteinG: number
    carbsG: number
    fatG: number
    sourceType?: 'manual' | 'food_item' | 'recipe'
    sourceId?: string
    sourceAmountG?: number
  }) => void
  foodItems?: FoodItem[]
  recipes?: Recipe[]
}

export function LogIntakeForm({ onClose, onSubmit, foodItems = [], recipes = [] }: Props) {
  const [mode, setMode] = useState<SourceMode>('manual')

  // Manual state
  const [name, setName] = useState('')
  const [proteinG, setProteinG] = useState('')
  const [carbsG, setCarbsG] = useState('')
  const [fatG, setFatG] = useState('')

  // Food item state
  const [foodSearch, setFoodSearch] = useState('')
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [foodAmountG, setFoodAmountG] = useState('100')

  // Recipe state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [recipeServings, setRecipeServings] = useState('1')

  // Shared state
  const [date, setDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [confirmed, setConfirmed] = useState(false)

  // Computed macros based on mode
  const computed = useMemo(() => {
    if (mode === 'food_item' && selectedFood) {
      const amount = Number(foodAmountG) || 0
      const m = calculateFoodMacros(selectedFood, amount)
      return { name: `${selectedFood.name} (${amount}g)`, ...m }
    }
    if (mode === 'recipe' && selectedRecipe) {
      const servings = Number(recipeServings) || 1
      return {
        name: selectedRecipe.name,
        calories: Math.round(selectedRecipe.totalCalories * servings),
        proteinG: Math.round(selectedRecipe.totalProteinG * servings * 10) / 10,
        carbsG: Math.round(selectedRecipe.totalCarbsG * servings * 10) / 10,
        fatG: Math.round(selectedRecipe.totalFatG * servings * 10) / 10,
      }
    }
    const p = Number(proteinG) || 0
    const c = Number(carbsG) || 0
    const f = Number(fatG) || 0
    return { name: name.trim(), calories: p * 4 + c * 4 + f * 9, proteinG: p, carbsG: c, fatG: f }
  }, [mode, name, proteinG, carbsG, fatG, selectedFood, foodAmountG, selectedRecipe, recipeServings])

  const filteredFoods = useMemo(() => {
    if (!foodSearch.trim()) return foodItems.slice(0, 8)
    const q = foodSearch.toLowerCase()
    return foodItems.filter((f) => f.name.toLowerCase().includes(q) || f.brand?.toLowerCase().includes(q)).slice(0, 8)
  }, [foodItems, foodSearch])

  const canSubmit = confirmed && computed.name !== ''

  function handleSubmit() {
    if (!canSubmit) return
    const timestamp = new Date(`${date}T${time}`).toISOString()
    onSubmit({
      timestamp,
      name: computed.name,
      calories: computed.calories,
      proteinG: computed.proteinG,
      carbsG: computed.carbsG,
      fatG: computed.fatG,
      sourceType: mode,
      sourceId: mode === 'food_item' ? selectedFood?.id : mode === 'recipe' ? selectedRecipe?.id : undefined,
      sourceAmountG: mode === 'food_item' ? Number(foodAmountG) || 0 : undefined,
    })
  }

  const inputClass =
    'w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

  const tabClass = (active: boolean) =>
    `px-4 py-2 text-[9px] font-black tracking-widest uppercase transition-colors ${
      active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
    }`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-surface-container p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
            {'>'} LOG_INTAKE_ENTRY
          </span>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Source mode tabs */}
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode('manual')} className={tabClass(mode === 'manual')}>
            MANUAL
          </button>
          <button type="button" onClick={() => setMode('food_item')} className={tabClass(mode === 'food_item')}>
            FOOD_ITEM
          </button>
          <button type="button" onClick={() => setMode('recipe')} className={tabClass(mode === 'recipe')}>
            RECIPE
          </button>
        </div>

        {/* Manual mode */}
        {mode === 'manual' && (
          <>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                MEAL_DESIGNATION
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="DESIGNATION..."
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                  PROTEIN_G
                </label>
                <input type="number" step="0.1" value={proteinG} onChange={(e) => setProteinG(e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                  CARBS_G
                </label>
                <input type="number" step="0.1" value={carbsG} onChange={(e) => setCarbsG(e.target.value)} placeholder="0" className={inputClass} />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                  FAT_G
                </label>
                <input type="number" step="0.1" value={fatG} onChange={(e) => setFatG(e.target.value)} placeholder="0" className={inputClass} />
              </div>
            </div>
          </>
        )}

        {/* Food item mode */}
        {mode === 'food_item' && (
          <>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                SELECT_FOOD_ITEM
              </label>
              <input
                type="text"
                value={selectedFood ? selectedFood.name : foodSearch}
                onChange={(e) => {
                  setFoodSearch(e.target.value)
                  setSelectedFood(null)
                }}
                placeholder="SEARCH_FOODS..."
                className={inputClass}
              />
              {!selectedFood && foodSearch.trim() !== '' && filteredFoods.length > 0 && (
                <div className="bg-surface-container-high mt-1 max-h-40 overflow-y-auto">
                  {filteredFoods.map((food) => (
                    <button
                      key={food.id}
                      type="button"
                      onClick={() => {
                        setSelectedFood(food)
                        setFoodSearch('')
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-surface-container-highest text-sm text-on-surface transition-colors flex items-center justify-between"
                    >
                      <span className="font-bold uppercase text-xs">{food.name}</span>
                      <span className="text-[9px] text-on-surface-variant tracking-widest">
                        {food.caloriesPer100g} KCAL/100G
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedFood && (
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                  AMOUNT_GRAMS
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={foodAmountG}
                    onChange={(e) => setFoodAmountG(e.target.value)}
                    className={inputClass}
                  />
                  <span className="text-xs font-bold text-on-surface-variant tracking-widest">G</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Recipe mode */}
        {mode === 'recipe' && (
          <>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                SELECT_RECIPE
              </label>
              {recipes.length === 0 ? (
                <div className="bg-surface-container-high px-4 py-6 text-center text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                  NO_RECIPES_AVAILABLE // BUILD_ONE_FIRST
                </div>
              ) : (
                <div className="space-y-1">
                  {recipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        selectedRecipe?.id === recipe.id
                          ? 'bg-primary/10 ring-1 ring-primary'
                          : 'bg-surface-container-high hover:bg-surface-container-highest'
                      }`}
                    >
                      <div className="text-xs font-black uppercase tracking-tight text-on-surface">{recipe.name}</div>
                      <div className="text-[9px] font-bold text-on-surface-variant tracking-widest mt-1">
                        P:{Math.round(recipe.totalProteinG)}G | C:{Math.round(recipe.totalCarbsG)}G | F:{Math.round(recipe.totalFatG)}G — {recipe.totalCalories} KCAL
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedRecipe && (
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                  SERVINGS
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={recipeServings}
                  onChange={(e) => setRecipeServings(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </>
        )}

        {/* Computed totals */}
        <div className="bg-surface-container-low p-4 space-y-1">
          <div className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">COMPUTED_OUTPUT</div>
          <div className="text-3xl font-black text-on-surface tracking-tighter">
            {computed.calories} <span className="text-xs font-bold text-on-surface-variant">KCAL</span>
          </div>
          <div className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant">
            P: {computed.proteinG}G | C: {computed.carbsG}G | F: {computed.fatG}G
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            TIMESTAMP
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary text-sm tracking-widest font-mono [color-scheme:dark]"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary text-sm tracking-widest font-mono [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Confirm */}
        <div className="bg-surface-container-low p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 border-2 border-on-surface-variant peer-checked:border-primary peer-checked:bg-primary transition-colors flex items-center justify-center">
                {confirmed && (
                  <span className="material-symbols-outlined text-on-primary text-xs">check</span>
                )}
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface tracking-tight uppercase">
              CONFIRM
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          EXECUTE_LOG
        </button>
      </div>
    </div>
  )
}
