import type { ReactNode } from 'react'

export type ModalProps = {
  open: boolean
  title?: string
  description?: string
  children: ReactNode
  onClose: () => void
  widthClassName?: string
}
