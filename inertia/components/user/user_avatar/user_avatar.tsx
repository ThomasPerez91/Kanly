import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import type { UserAvatarProps } from './user_avatar_type'

const sizeMap = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
}

function getInitials(fullName?: string | null, email?: string | null) {
  const name = (fullName ?? '').trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    const first = parts[0]?.[0] ?? ''
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
    return (first + last || first || 'U').toUpperCase()
  }

  const e = (email ?? '').trim()
  return (e[0] ?? 'U').toUpperCase()
}

export const UserAvatar: FC<UserAvatarProps> = ({
  fullName,
  email,
  avatarUrl,
  size = 'md',
  className,
}) => {
  const [errored, setErrored] = useState(false)

  // ✅ reset erreur quand l’url change (sinon tu restes bloqué en fallback)
  useEffect(() => {
    setErrored(false)
  }, [avatarUrl])

  const initials = useMemo(() => getInitials(fullName, email), [fullName, email])

  const src = (avatarUrl ?? '').trim()
  const showImage = Boolean(src) && !errored

  return (
    <div
      className={[
        sizeMap[size],
        'rounded-full overflow-hidden flex items-center justify-center bg-surface',
        className ?? '',
      ].join(' ')}
      aria-label={fullName ?? email ?? 'User'}
    >
      {showImage ? (
        <img
          src={src}
          alt={fullName ?? email ?? 'User avatar'}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-sm font-900 text-text">{initials}</span>
      )}
    </div>
  )
}
