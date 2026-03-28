import { Modal } from './modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  isPending?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'DELETE',
  isPending = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="font-mono text-xs text-on-surface-variant mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isPending}
          className="flex-1 py-3 font-mono text-xs label-tracked bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer disabled:opacity-40"
        >
          CANCEL
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 py-3 font-mono text-xs label-tracked bg-error text-on-error hover:brightness-110 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          ) : null}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
