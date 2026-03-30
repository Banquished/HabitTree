import type { FoodItem, RecipeIngredient } from '@HabitTree/types'

function r1(n: number): number {
  return Math.round(n * 10) / 10
}

export function calculateFoodMacros(foodItem: FoodItem, amountG: number) {
  const factor = amountG / 100
  return {
    calories: Math.round(foodItem.caloriesPer100g * factor),
    proteinG: r1(foodItem.proteinPer100g * factor),
    carbsG: r1(foodItem.carbsPer100g * factor),
    fatG: r1(foodItem.fatPer100g * factor),
  }
}

export function calculateRecipeMacros(
  ingredients: Pick<RecipeIngredient, 'foodItemId' | 'amountG'>[],
  foodItems: FoodItem[],
) {
  const itemMap = new Map(foodItems.map((f) => [f.id, f]))

  let totalCalories = 0
  let totalProteinG = 0
  let totalCarbsG = 0
  let totalFatG = 0
  let totalWeightG = 0

  for (const ing of ingredients) {
    const item = itemMap.get(ing.foodItemId)
    if (!item) continue
    const factor = ing.amountG / 100
    totalCalories += item.caloriesPer100g * factor
    totalProteinG += item.proteinPer100g * factor
    totalCarbsG += item.carbsPer100g * factor
    totalFatG += item.fatPer100g * factor
    totalWeightG += ing.amountG
  }

  return {
    totalCalories: Math.round(totalCalories),
    totalProteinG: r1(totalProteinG),
    totalCarbsG: r1(totalCarbsG),
    totalFatG: r1(totalFatG),
    totalWeightG,
  }
}
