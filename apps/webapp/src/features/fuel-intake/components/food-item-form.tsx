import { useEffect, useState } from 'react'
import { Modal } from '@/shared/modal'

interface FoodItemData {
  name: string
  brand?: string
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
}

interface Props {
  onClose: () => void
  onSubmit: (data: FoodItemData) => void
  initialData?: FoodItemData
  isPending?: boolean
}

export function FoodItemForm({ onClose, onSubmit, initialData, isPending = false }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [brand, setBrand] = useState(initialData?.brand ?? '')
  const [proteinPer100g, setProteinPer100g] = useState(
    initialData ? String(initialData.proteinPer100g) : '',
  )
  const [carbsPer100g, setCarbsPer100g] = useState(
    initialData ? String(initialData.carbsPer100g) : '',
  )
  const [fatPer100g, setFatPer100g] = useState(
    initialData ? String(initialData.fatPer100g) : '',
  )
  const [caloriesPer100g, setCaloriesPer100g] = useState(
    initialData ? String(initialData.caloriesPer100g) : '',
  )
  const [caloriesOverridden, setCaloriesOverridden] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const p = Number(proteinPer100g) || 0
  const c = Number(carbsPer100g) || 0
  const f = Number(fatPer100g) || 0
  const autoKcal = p * 4 + c * 4 + f * 9

  useEffect(() => {
    if (!caloriesOverridden) {
      setCaloriesPer100g(String(autoKcal))
    }
  }, [autoKcal, caloriesOverridden])

  function handleCaloriesChange(value: string) {
    setCaloriesOverridden(true)
    setCaloriesPer100g(value)
  }

  const canSubmit = confirmed && name.trim() !== '' && !isPending

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      brand: brand.trim() || undefined,
      caloriesPer100g: Number(caloriesPer100g) || 0,
      proteinPer100g: p,
      carbsPer100g: c,
      fatPer100g: f,
    })
  }

  const inputClass =
    'w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

  return (
    <Modal open onClose={onClose} title={initialData ? 'EDIT_FOOD_ITEM' : 'ADD_FOOD_ITEM'}>
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            DESIGNATION
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="DESIGNATION..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            BRAND
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="OPTIONAL..."
            className={inputClass}
          />
        </div>

        <div>
          <span className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            NUTRIENTS_PER_100G
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                PROTEIN_G
              </label>
              <input
                type="number"
                step="0.1"
                value={proteinPer100g}
                onChange={(e) => setProteinPer100g(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                CARBS_G
              </label>
              <input
                type="number"
                step="0.1"
                value={carbsPer100g}
                onChange={(e) => setCarbsPer100g(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
                FAT_G
              </label>
              <input
                type="number"
                step="0.1"
                value={fatPer100g}
                onChange={(e) => setFatPer100g(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              CALORIES_KCAL
            </label>
            <span className="text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
              AUTO_KCAL: {autoKcal}
            </span>
          </div>
          <input
            type="number"
            step="1"
            value={caloriesPer100g}
            onChange={(e) => handleCaloriesChange(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>

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
          className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
          REGISTER_FOOD_ITEM
        </button>
      </div>
    </Modal>
  )
}
