import type { FC } from 'react'
import { Link } from '@inertiajs/react'

import type { DropdownItemProps } from './dropdown_item_type'
import { useDropdown } from './dropdown_context'

export const DropdownItem: FC<DropdownItemProps> = (props) => {
  const ctx = useDropdown()

  const icon = props.icon ? <span className="text-base">{props.icon}</span> : null
  const right = props.rightSlot ? <span className="ml-auto">{props.rightSlot}</span> : null

  // ✅ If caller provides a full dropdown-item variant, don’t prepend base class
  const hasVariantClass =
    typeof props.className === 'string' && props.className.includes('dropdown-item-')

  const baseClass = hasVariantClass ? '' : 'dropdown-item'
  const className = `${baseClass} ${props.className ?? ''}`.trim()

  if (props.type === 'link') {
    const { href, label } = props

    return (
      <Link
        href={href}
        className={className}
        role="menuitem"
        onClick={() => {
          ctx?.close()
        }}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {right}
      </Link>
    )
  }

  const { onClick, label, disabled } = props

  return (
    <button
      type="button"
      onClick={() => {
        onClick()
        ctx?.close()
      }}
      className={className}
      role="menuitem"
      disabled={disabled}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {right}
    </button>
  )
}
