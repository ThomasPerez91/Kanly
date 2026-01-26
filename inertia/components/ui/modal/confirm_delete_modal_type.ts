export type ConfirmDeleteModalProps = {
  open: boolean
  onClose: () => void

  title?: string
  description?: string

  confirmLabel?: string
  cancelLabel?: string

  isConfirming?: boolean
  error?: string | null

  onConfirm: () => void
}
