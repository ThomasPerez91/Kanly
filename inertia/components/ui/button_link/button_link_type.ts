import type { ReactNode } from 'react'
import type { ButtonSize, ButtonVariant } from '~/components/ui/button/button_type'

export type ButtonLinkProps = {
  href: string
  label?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  elevated?: boolean
  className?: string
  preserveScroll?: boolean
  replace?: boolean
  only?: string[]
  headers?: Record<string, string>
}
