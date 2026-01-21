import type { FC } from 'react'
import { Link } from '@inertiajs/react'
import type { ButtonLinkProps } from './button_link_type'
import type { ButtonSize, ButtonVariant } from '~/components/ui/button/button_type'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  oauth: 'btn-oauth',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

export const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  label,
  iconLeft,
  iconRight,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  elevated = false,
  className,
  preserveScroll,
  replace,
  only,
  headers,
}) => {
  const isDisabled = loading

  return (
    <Link
      href={href}
      preserveScroll={preserveScroll}
      replace={replace}
      only={only}
      headers={headers}
      className={[
        'btn-base',
        sizeClass[size],
        variantClass[variant],
        'no-underline align-middle',
        fullWidth ? 'w-full' : '',
        elevated ? 'shadow-soft' : '',
        isDisabled ? 'pointer-events-none opacity-60' : '',
        className ?? '',
      ].join(' ')}
    >
      {loading ? <span className="spinner" /> : iconLeft}
      {label ? <span className="btn-label">{label}</span> : null}
      {iconRight}
    </Link>
  )
}
