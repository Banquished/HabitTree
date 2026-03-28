import { useState } from 'react'

interface Props {
  onAdd: (name: string) => void
  isPending: boolean
}

export function QuickAddInput({ onAdd, isPending }: Props) {
  const [value, setValue] = useState('')

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <div className="bg-surface-container-lowest border-l-4 border-primary">
      <label className="block px-4 pt-3 text-[9px] font-bold tracking-widest uppercase text-on-surface-variant">
        QUICK_ADD_OPERATION
      </label>
      <div className="flex items-center px-4 pb-3 pt-1 min-h-[44px]">
        <span className="text-primary font-bold mr-2 font-mono">{'>'}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="bg-transparent flex-1 text-sm font-mono text-on-surface outline-none placeholder:text-on-surface-variant cursor-pointer disabled:opacity-40"
          placeholder="TYPE_OPERATION_NAME..."
        />
        {isPending && (
          <span className="material-symbols-outlined text-sm text-primary animate-spin">progress_activity</span>
        )}
        <span className="cursor-blink ml-1" />
      </div>
    </div>
  )
}
