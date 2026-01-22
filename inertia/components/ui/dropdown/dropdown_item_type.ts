import type { ReactNode } from 'react'

export type DropdownItemBaseProps = {
  icon?: ReactNode
  label: string
  className?: string
}

export type DropdownButtonItemProps = DropdownItemBaseProps & {
  type: 'button'
  onClick: () => void
  rightSlot?: ReactNode
  disabled?: boolean
}

export type DropdownLinkItemProps = DropdownItemBaseProps & {
  type: 'link'
  href: string
  rightSlot?: ReactNode
}

export type DropdownItemProps = DropdownButtonItemProps | DropdownLinkItemProps
