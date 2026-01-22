import type { FC } from 'react'
import { Link } from '@inertiajs/react'

import type { DropdownItemProps } from './dropdown_item_type'
import { useDropdown } from './dropdown_context'

export const DropdownItem: FC<DropdownItemProps> = (props) => {
  const ctx = useDropdown()

  const icon = props.icon ? <span className="text-base">{props.icon}</span> : null
  const right = props.rightSlot ? <span className="ml-auto">{props.rightSlot}</span> : null

  if (props.type === 'link') {
    const { href, label, className } = props

    return (
      <Link
        href={href}
        className={`dropdown-item ${className ?? ''}`}
        role="menuitem"
        onClick={(e) => {
          // Let inertia handle navigation; just close immediately for UX
          ctx?.close()
        }}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {right}
      </Link>
    )
  }

  const { onClick, label, className, disabled } = props

  return (
    <button
      type="button"
      onClick={() => {
        onClick()
        ctx?.close()
      }}
      className={`dropdown-item ${className ?? ''}`}
      role="menuitem"
      disabled={disabled}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {right}
    </button>
  )
}
