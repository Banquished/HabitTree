import { useState } from 'react'
import { useAddWeightEntry } from '../api/use-weight-entries'

export function WeightInput() {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  })
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  const [confirmed, setConfirmed] = useState(false)
  const addEntry = useAddWeightEntry()

  const canSubmit = confirmed && weight !== '' && Number(weight) > 0

  function handleSubmit() {
    if (!canSubmit) return
    const timestamp = new Date(`${date}T${time}:00`).toISOString()
    addEntry.mutate({ weightKg: Number(weight), timestamp })
    setWeight('')
    setConfirmed(false)
  }

  return (
    <div className="bg-surface-container p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <span className="text-[10px] font-bold tracking-widest uppercase text-primary">
            {'>'} COMMAND_LINE_INPUT
          </span>
          <span className="text-[9px] font-bold tracking-widest text-on-surface-variant">[VER_2.4]</span>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-[9px] font-bold text-on-surface-variant mb-3 tracking-widest uppercase">
              SET_CURRENT_MASS (KG)
            </label>
            <div className="flex items-center border-b-2 border-surface-container-high pb-2 focus-within:border-primary transition-colors">
              <span className="text-primary mr-3 font-bold">{'>'}</span>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="00.00"
                className="bg-transparent border-none focus:outline-none text-3xl font-black text-on-surface w-full p-0 placeholder:text-surface-container-high tracking-tighter [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="cursor-blink" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-on-surface-variant mb-3 tracking-widest uppercase">
              TIMESTAMP_OVERRIDE
            </label>
            <div className="flex items-center gap-2 border-b-2 border-surface-container-high pb-2 focus-within:border-primary transition-colors">
              <span className="text-primary mr-1 font-bold">{'>'}</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-bold text-on-surface tracking-widest font-mono p-0 [color-scheme:dark]"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-bold text-on-surface tracking-widest font-mono p-0 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="bg-surface-container-low p-4">
            <div className="text-[8px] font-bold text-on-surface-variant mb-3 tracking-widest uppercase">
              LOG_VERIFICATION:
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-4 h-4 border-2 border-on-surface-variant peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface transition-colors flex items-center justify-center">
                  {confirmed && (
                    <span className="material-symbols-outlined text-on-primary text-xs">check</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold text-on-surface tracking-tight uppercase">
                CONFIRM_BIOMETRIC_ACCURACY
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || addEntry.isPending}
        className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-xs mt-8 hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {addEntry.isPending && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
        EXECUTE_LOG_UPDATE
      </button>
    </div>
  )
}
