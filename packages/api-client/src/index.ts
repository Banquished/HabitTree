import type {
  WeightEntry,
  FuelEntry,
  MealProtocol,
  Mission,
  BioProfile,
  FoodItem,
  Recipe,
  RecipeIngredient,
  OperationTemplate,
  OperationLog,
  HeatmapDay,
  DailySummary,
} from '@HabitTree/types'

async function request<T>(baseUrl: string, path: string, init?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...restInit } = init ?? {}
  const headers: Record<string, string> = { ...(extraHeaders as Record<string, string>) }
  if (restInit.body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${baseUrl}${path}`, {
    ...restInit,
    headers,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export function createApiClient(baseUrl: string) {
  const get = <T>(path: string) => request<T>(baseUrl, path)
  const post = <T>(path: string, body: unknown) =>
    request<T>(baseUrl, path, { method: 'POST', body: JSON.stringify(body) })
  const put = <T>(path: string, body: unknown) =>
    request<T>(baseUrl, path, { method: 'PUT', body: JSON.stringify(body) })
  const del = (path: string) =>
    request<void>(baseUrl, path, { method: 'DELETE' })

  return {
    baseUrl,

    // Weight
    getWeightEntries: () => get<WeightEntry[]>('/v1/weight-entries'),
    createWeightEntry: (data: Omit<WeightEntry, 'id'>) => post<WeightEntry>('/v1/weight-entries', data),
    updateWeightEntry: (id: string, data: Partial<Omit<WeightEntry, 'id'>>) =>
      put<WeightEntry>(`/v1/weight-entries/${id}`, data),
    deleteWeightEntry: (id: string) => del(`/v1/weight-entries/${id}`),

    // Fuel entries
    getFuelEntries: () => get<FuelEntry[]>('/v1/fuel-entries'),
    createFuelEntry: (data: Omit<FuelEntry, 'id'>) => post<FuelEntry>('/v1/fuel-entries', data),
    deleteFuelEntry: (id: string) => del(`/v1/fuel-entries/${id}`),

    // Meal protocols
    getMealProtocols: () => get<MealProtocol[]>('/v1/meal-protocols'),
    createMealProtocol: (data: Omit<MealProtocol, 'id'>) => post<MealProtocol>('/v1/meal-protocols', data),
    deleteMealProtocol: (id: string) => del(`/v1/meal-protocols/${id}`),

    // Missions
    getMissions: () => get<Mission[]>('/v1/missions'),
    getActiveMission: () => get<Mission | null>('/v1/missions/active'),
    createMission: (data: Omit<Mission, 'id'>) => post<Mission>('/v1/missions', data),
    updateMission: (id: string, data: { status: string }) => put<Mission>(`/v1/missions/${id}`, data),

    // Bio profile
    getBioProfile: () => get<BioProfile | null>('/v1/bio-profile'),
    upsertBioProfile: (data: BioProfile) => put<BioProfile>('/v1/bio-profile', data),

    // Food items
    getFoodItems: () => get<FoodItem[]>('/v1/food-items'),
    createFoodItem: (data: Omit<FoodItem, 'id'>) => post<FoodItem>('/v1/food-items', data),
    updateFoodItem: (id: string, data: Partial<Omit<FoodItem, 'id'>>) =>
      put<FoodItem>(`/v1/food-items/${id}`, data),
    deleteFoodItem: (id: string) => del(`/v1/food-items/${id}`),

    // Recipes
    getRecipes: () => get<Recipe[]>('/v1/recipes'),
    createRecipe: (data: { name: string; ingredients: Omit<RecipeIngredient, 'id'>[]; totalCalories: number; totalProteinG: number; totalCarbsG: number; totalFatG: number; totalWeightG: number }) =>
      post<Recipe>('/v1/recipes', data),
    updateRecipe: (id: string, data: { name: string; ingredients: Omit<RecipeIngredient, 'id'>[]; totalCalories: number; totalProteinG: number; totalCarbsG: number; totalFatG: number; totalWeightG: number }) =>
      put<Recipe>(`/v1/recipes/${id}`, data),
    deleteRecipe: (id: string) => del(`/v1/recipes/${id}`),

    // Operations - Templates
    getOperationTemplates: (params?: { frequency?: string; isActive?: boolean }) => {
      const qs = new URLSearchParams()
      if (params?.frequency) qs.set('frequency', params.frequency)
      if (params?.isActive !== undefined) qs.set('is_active', String(params.isActive))
      const q = qs.toString()
      return get<OperationTemplate[]>(`/v1/operations/templates${q ? `?${q}` : ''}`)
    },
    createOperationTemplate: (data: Omit<OperationTemplate, 'id' | 'createdAt'>) =>
      post<OperationTemplate>('/v1/operations/templates', data),
    updateOperationTemplate: (id: string, data: Partial<Omit<OperationTemplate, 'id' | 'createdAt'>>) =>
      put<OperationTemplate>(`/v1/operations/templates/${id}`, data),
    deleteOperationTemplate: (id: string) => del(`/v1/operations/templates/${id}`),

    // Operations - Logs
    getOperationLogs: (date: string) =>
      get<OperationLog[]>(`/v1/operations/logs?date=${date}`),
    createOperationLog: (data: Omit<OperationLog, 'id'>) =>
      post<OperationLog>('/v1/operations/logs', data),
    updateOperationLog: (id: string, data: { completedAt: string | null }) =>
      put<OperationLog>(`/v1/operations/logs/${id}`, data),
    deleteOperationLog: (id: string) => del(`/v1/operations/logs/${id}`),

    // Operations - Aggregations
    getOperationHeatmap: (start: string, end: string) =>
      get<HeatmapDay[]>(`/v1/operations/heatmap?start=${start}&end=${end}`),
    getOperationDailySummary: (date: string) =>
      get<DailySummary>(`/v1/operations/daily-summary?date=${date}`),
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
