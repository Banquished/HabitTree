export function Component() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="font-mono text-xs text-on-surface-variant tracking-widest uppercase">
          {'>'} OPERATIONS
        </span>
        <span className="cursor-blink" />
      </div>
      <h1 className="text-3xl font-black tracking-tighter text-primary uppercase glow-sm">
        OPERATIONS_COMMAND
      </h1>
      <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-2">
        TASK_PROTOCOL // INITIALIZED
      </p>
    </div>
  )
}
