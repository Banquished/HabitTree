export interface FuelEntry {
  id: string
  timestamp: string
  name: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  note?: string
  sourceType?: 'manual' | 'food_item' | 'recipe' | 'protocol'
  sourceId?: string
  sourceAmountG?: number
}

export interface MealProtocol {
  id: string
  name: string
  version: string
  ingredientsDesc: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface FoodItem {
  id: string
  name: string
  brand?: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

export interface RecipeIngredient {
  id: string
  foodItemId: string
  amountG: number
}

export interface Recipe {
  id: string
  name: string
  ingredients: RecipeIngredient[]
  totalCalories: number
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
  totalWeightG: number
}
