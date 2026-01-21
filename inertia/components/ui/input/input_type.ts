import type { InputHTMLAttributes } from 'react'

export type InputProps = {
  label?: string
  error?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>
