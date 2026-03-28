import { useState } from 'react'
import { Modal } from '@/shared/modal'

interface Props {
  onClose: () => void
  onSubmit: (data: {
    name: string
    version: string
    ingredientsDesc: string
    calories: number
    proteinG: number
    carbsG: number
    fatG: number
  }) => void
  isPending?: boolean
}

export function CreateProtocolForm({ onClose, onSubmit, isPending = false }: Props) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('V1.0')
  const [ingredientsDesc, setIngredientsDesc] = useState('')
  const [proteinG, setProteinG] = useState('')
  const [carbsG, setCarbsG] = useState('')
  const [fatG, setFatG] = useState('')

  const p = Number(proteinG) || 0
  const c = Number(carbsG) || 0
  const f = Number(fatG) || 0
  const totalKcal = p * 4 + c * 4 + f * 9

  const canSubmit = name.trim() !== '' && !isPending

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      version: version.trim(),
      ingredientsDesc: ingredientsDesc.trim(),
      calories: totalKcal,
      proteinG: p,
      carbsG: c,
      fatG: f,
    })
  }

  const inputClass =
    'w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'

  return (
    <Modal open onClose={onClose} title="CREATE_PROTOCOL">
      <div className="space-y-4">
        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            PROTOCOL_DESIGNATION
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
            VERSION
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            INGREDIENTS_DESC
          </label>
          <textarea
            rows={3}
            value={ingredientsDesc}
            onChange={(e) => setIngredientsDesc(e.target.value)}
            placeholder="INGREDIENTS..."
            className="w-full bg-surface-container-high px-3 py-2 text-on-surface font-bold focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
              PROTEIN_G
            </label>
            <input
              type="number"
              step="0.1"
              value={proteinG}
              onChange={(e) => setProteinG(e.target.value)}
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
              value={carbsG}
              onChange={(e) => setCarbsG(e.target.value)}
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
              value={fatG}
              onChange={(e) => setFatG(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">
            TOTAL_KCAL
          </label>
          <div className="text-3xl font-black text-on-surface tracking-tighter">
            {totalKcal}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isPending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
          SAVE_PROTOCOL
        </button>
      </div>
    </Modal>
  )
}
