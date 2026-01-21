import type { FC } from 'react'
import type { ButtonProps, ButtonSize, ButtonVariant } from './button_type'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

export const Button: FC<ButtonProps> = ({
  label,
  iconLeft,
  iconRight,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  type = 'button',
  className,
  ...rest
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        variantClass[variant],
        sizeClass[size],
        fullWidth ? 'w-full' : '',
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {loading ? <span className="i-lucide-loader-circle animate-spin" /> : iconLeft}
      {label ? <span>{label}</span> : null}
      {iconRight}
    </button>
  )
}
