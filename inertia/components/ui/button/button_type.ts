import type { ReactNode, ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'oauth'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  label?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
  elevated?: boolean
  rounded?: 'md' | 'lg'
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
