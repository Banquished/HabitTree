import { Modal } from '@/shared/modal'
import type { OperationFrequency, OperationPriority, OperationTemplate } from '@HabitTree/types'
import { useState } from 'react'

interface Props {
  onClose: () => void
  onSubmit: (data: Omit<OperationTemplate, 'id' | 'createdAt'>) => void
  initialData?: OperationTemplate
  isPending?: boolean
}

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const

const ICON_OPTIONS = [
  'check_circle', 'fitness_center', 'directions_run', 'pool', 'self_improvement',
  'restaurant', 'water_drop', 'local_cafe', 'egg_alt', 'lunch_dining',
  'book', 'school', 'code', 'edit_note', 'lightbulb',
  'bedtime', 'alarm', 'schedule', 'routine',
  'work', 'task_alt', 'pending_actions', 'target',
  'favorite', 'health_and_safety', 'monitor_heart', 'medication',
  'spa', 'psychiatry', 'mindfulness',
  'cleaning_services', 'home', 'laundry',
  'savings', 'account_balance', 'payments',
  'groups', 'forum', 'call', 'handshake',
  'music_note', 'palette', 'photo_camera',
  'hiking', 'park', 'eco', 'nature_people',
]

const CATEGORY_OPTIONS = [
  'Health', 'Fitness', 'Nutrition', 'Hydration',
  'Productivity', 'Learning', 'Work',
  'Self-Care', 'Mindfulness', 'Sleep',
  'Finance', 'Social', 'Creative', 'Outdoor',
]

export function TemplateFormModal({ onClose, onSubmit, initialData, isPending = false }: Props) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [icon, setIcon] = useState(initialData?.icon ?? 'check_circle')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [frequency, setFrequency] = useState<OperationFrequency>(initialData?.frequency ?? 'daily')
  const [specificDays, setSpecificDays] = useState<number[]>(initialData?.specificDays ?? [])
  const [priority, setPriority] = useState<OperationPriority>(initialData?.priority ?? 'medium')
  const [targetCount, setTargetCount] = useState(initialData?.targetCount ?? 1)
  const [iconFilter, setIconFilter] = useState('')

  const filteredIcons = iconFilter
    ? ICON_OPTIONS.filter((i) => i.includes(iconFilter.toLowerCase().replace(/\s/g, '_')))
    : ICON_OPTIONS

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      icon,
      category: category.trim() || undefined,
      frequency,
      specificDays: frequency === 'specific_days' ? specificDays : undefined,
      priority,
      targetCount: frequency === 'weekly' ? targetCount : 1,
      sortOrder: initialData?.sortOrder ?? 0,
      isActive: initialData?.isActive ?? true,
    })
  }

  function toggleDay(day: number) {
    setSpecificDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  const inputClass = 'w-full bg-surface-container-high px-4 py-3 text-on-surface font-mono text-sm outline-none focus:ring-1 focus:ring-primary'

  return (
    <Modal open onClose={onClose} title={initialData ? 'EDIT_TEMPLATE' : 'CREATE_TEMPLATE'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            NAME *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            DESCRIPTION
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            ICON
          </label>
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-2xl text-primary shrink-0">{icon}</span>
            <input
              type="text"
              value={iconFilter}
              onChange={(e) => setIconFilter(e.target.value)}
              placeholder="Filter icons..."
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-8 gap-1 max-h-28 overflow-y-auto">
            {filteredIcons.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`p-2 flex items-center justify-center cursor-pointer transition-colors ${
                  icon === i
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{i}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            CATEGORY
          </label>
          <div className="flex flex-wrap gap-1 mb-2">
            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-2 text-[9px] font-bold tracking-widest cursor-pointer transition-colors ${
                  category === c
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Or type custom..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            FREQUENCY
          </label>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'specific_days'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequency(f)}
                className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                  frequency === f
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {frequency === 'specific_days' && (
          <div>
            <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
              SELECT_DAYS
            </label>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleDay(i + 1)}
                  className={`flex-1 py-2 text-[9px] font-bold tracking-widest cursor-pointer transition-colors ${
                    specificDays.includes(i + 1)
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {frequency === 'weekly' && (
          <div>
            <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
              TARGET_COUNT
            </label>
            <input
              type="number"
              min={1}
              value={targetCount}
              onChange={(e) => setTargetCount(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <label className="block text-[9px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
            PRIORITY
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                  priority === p
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim() || isPending}
          className="w-full bg-primary py-4 text-on-primary font-black tracking-widest uppercase text-xs hover:shadow-[0_0_20px_rgba(171,255,2,0.2)] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending && (
            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          )}
          {initialData ? 'UPDATE_TEMPLATE' : 'CREATE_TEMPLATE'}
        </button>
      </form>
    </Modal>
  )
}
