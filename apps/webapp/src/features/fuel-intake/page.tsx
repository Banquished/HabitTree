import { useState } from 'react'
import { useAddFuelEntry, useRemoveFuelEntry, useMealProtocols, useAddMealProtocol, useRemoveMealProtocol, useExecuteProtocol } from './api/use-fuel-entries'
import { useFoodItems, useAddFoodItem, useUpdateFoodItem, useRemoveFoodItem, useRecipes, useAddRecipe, useRemoveRecipe } from './api/use-food-items'
import { useDailyMacros } from './api/use-daily-macros'
import { useWeeklyMacros } from './api/use-weekly-macros'
import { useMacroTargets, getGoalLabel } from './api/use-macro-targets'
import { DailyMacroCards } from './components/daily-macro-cards'
import { EntryLogStream } from './components/entry-log-stream'
import { LogIntakeForm } from './components/log-intake-form'
import { QuickMenu } from './components/meal-protocols'
import { CreateProtocolForm } from './components/create-protocol-form'
import { WeeklyOverview } from './components/weekly-overview'
import { FoodItemList } from './components/food-item-list'
import { FoodItemForm } from './components/food-item-form'
import { RecipeBuilder } from './components/recipe-builder'
import type { MealProtocol, FoodItem, Recipe } from '@HabitTree/types'

export function Component() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [showLogForm, setShowLogForm] = useState(false)
  const [showProtocolForm, setShowProtocolForm] = useState(false)
  const [showFoodForm, setShowFoodForm] = useState(false)
  const [showFoodManager, setShowFoodManager] = useState(false)
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null)
  const [showRecipeBuilder, setShowRecipeBuilder] = useState(false)

  const dailyMacros = useDailyMacros(selectedDate)
  const weeklyMacros = useWeeklyMacros(selectedDate)
  const { data: macroTargets } = useMacroTargets()
  const { data: protocols = [] } = useMealProtocols()
  const { data: foodItems = [] } = useFoodItems()
  const { data: recipes = [] } = useRecipes()

  const addEntry = useAddFuelEntry()
  const removeEntry = useRemoveFuelEntry()
  const addProtocol = useAddMealProtocol()
  const removeProtocol = useRemoveMealProtocol()
  const executeProtocol = useExecuteProtocol()
  const addFoodItem = useAddFoodItem()
  const updateFoodItem = useUpdateFoodItem()
  const removeFoodItem = useRemoveFoodItem()
  const addRecipe = useAddRecipe()
  const removeRecipe = useRemoveRecipe()

  function handleLogSubmit(data: Parameters<typeof addEntry.mutate>[0]) {
    addEntry.mutate(data)
    setShowLogForm(false)
  }

  function handleProtocolSubmit(data: { name: string; version: string; ingredientsDesc: string; calories: number; proteinG: number; carbsG: number; fatG: number }) {
    addProtocol.mutate(data)
    setShowProtocolForm(false)
  }

  function handleExecute(protocol: MealProtocol) {
    executeProtocol.mutate(protocol)
  }

  function handleLogFromRecipe(recipe: Recipe) {
    addEntry.mutate({
      timestamp: new Date().toISOString(),
      name: recipe.name,
      calories: recipe.totalCalories,
      proteinG: Math.round(recipe.totalProteinG),
      carbsG: Math.round(recipe.totalCarbsG),
      fatG: Math.round(recipe.totalFatG),
      sourceType: 'recipe',
      sourceId: recipe.id,
    })
  }

  function handleFoodSubmit(data: Omit<FoodItem, 'id'>) {
    if (editingFood) {
      updateFoodItem.mutate({ id: editingFood.id, ...data })
    } else {
      addFoodItem.mutate(data)
    }
    setShowFoodForm(false)
    setEditingFood(null)
  }

  function handleLogFromFood(item: FoodItem) {
    addEntry.mutate({
      timestamp: new Date().toISOString(),
      name: `${item.name} (100g)`,
      calories: item.caloriesPer100g,
      proteinG: item.proteinPer100g,
      carbsG: item.carbsPer100g,
      fatG: item.fatPer100g,
      sourceType: 'food_item',
      sourceId: item.id,
      sourceAmountG: 100,
    })
  }

  function handleRecipeSubmit(data: { name: string; ingredients: { foodItemId: string; amountG: number }[]; totalCalories: number; totalProteinG: number; totalCarbsG: number; totalFatG: number; totalWeightG: number }) {
    addRecipe.mutate(data)
    setShowRecipeBuilder(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
              {'>'} FUEL_INTAKE
            </span>
            <span className="cursor-blink" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-on-surface uppercase italic">
            FUEL_MANAGEMENT_STATION
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {macroTargets ? (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                OPERATIONAL_MODE: {getGoalLabel(macroTargets.goalType)}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                NO_MISSION_LINKED // TARGETS_UNAVAILABLE
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="flex items-center gap-2 bg-primary px-5 py-3 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
          LOG_INTAKE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <WeeklyOverview weeklyMacros={weeklyMacros} macroTargets={macroTargets ?? null} />
          <DailyMacroCards dailyMacros={dailyMacros} macroTargets={macroTargets ?? null} />
          <EntryLogStream
            entries={dailyMacros.entries}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onRemove={(id) => removeEntry.mutate(id)}
          />
        </div>

        <QuickMenu
          protocols={protocols}
          recipes={recipes}
          onExecuteProtocol={handleExecute}
          onLogRecipe={handleLogFromRecipe}
          onRemoveProtocol={(id) => removeProtocol.mutate(id)}
          onRemoveRecipe={(id) => removeRecipe.mutate(id)}
          onCreateProtocol={() => setShowProtocolForm(true)}
          onBuildRecipe={() => setShowRecipeBuilder(true)}
          onManageFoods={() => setShowFoodManager(true)}
        />
      </div>

      {showLogForm && (
        <LogIntakeForm
          onClose={() => setShowLogForm(false)}
          onSubmit={handleLogSubmit}
          foodItems={foodItems}
          recipes={recipes}
        />
      )}
      {showProtocolForm && <CreateProtocolForm onClose={() => setShowProtocolForm(false)} onSubmit={handleProtocolSubmit} />}
      {showFoodForm && (
        <FoodItemForm
          onClose={() => { setShowFoodForm(false); setEditingFood(null) }}
          onSubmit={handleFoodSubmit}
          initialData={editingFood ? {
            name: editingFood.name,
            brand: editingFood.brand,
            caloriesPer100g: editingFood.caloriesPer100g,
            proteinPer100g: editingFood.proteinPer100g,
            carbsPer100g: editingFood.carbsPer100g,
            fatPer100g: editingFood.fatPer100g,
          } : undefined}
        />
      )}
      {showRecipeBuilder && (
        <RecipeBuilder
          foodItems={foodItems}
          onClose={() => setShowRecipeBuilder(false)}
          onSubmit={handleRecipeSubmit}
        />
      )}
      {showFoodManager && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowFoodManager(false) }}
        >
          <div className="bg-surface-container w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 bg-surface-container sticky top-0">
              <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
                {'>'} FOOD_DATABASE_MANAGER
              </span>
              <button onClick={() => setShowFoodManager(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <FoodItemList
              foodItems={foodItems}
              onEdit={(item) => {
                setEditingFood(item)
                setShowFoodForm(true)
              }}
              onRemove={(id) => removeFoodItem.mutate(id)}
              onLogFromFood={handleLogFromFood}
              onCreateNew={() => {
                setEditingFood(null)
                setShowFoodForm(true)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
