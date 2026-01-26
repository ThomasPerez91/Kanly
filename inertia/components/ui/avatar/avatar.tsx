import type { FC } from 'react'
import { useMemo, useState } from 'react'
import type { AvatarProps } from './avatar_type'

const sizeMap = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

export const Avatar: FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  shape = 'rounded',
  className,
  alt,
  bordered = true,
}) => {
  const [hasError, setHasError] = useState(false)

  const letter = useMemo(() => {
    const v = (name ?? '').trim()
    return v ? v[0]!.toUpperCase() : '—'
  }, [name])

  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  const wrapperClass = [
    sizeMap[size],
    radius,
    'overflow-hidden flex items-center justify-center',
    bordered ? 'border border-border' : '',
    'bg-surface',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const showImg = Boolean(src && !hasError)

  return (
    <div className={wrapperClass} aria-label={alt ?? name ?? 'Avatar'}>
      {showImg ? (
        <img
          src={src ?? ''}
          alt={alt ?? name ?? 'Avatar'}
          className="h-full w-full object-cover object-center bg-bg"
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-sm font-900 text-text">{letter}</span>
      )}
    </div>
  )
}
