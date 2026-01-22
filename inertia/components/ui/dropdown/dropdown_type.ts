import type { ReactNode } from 'react'

export type DropdownPlacement = 'bottom-start' | 'bottom-end'

export type DropdownProps = {
  /**
   * The trigger element (button, avatar, etc.)
   */
  trigger: ReactNode

  /**
   * The dropdown content
   */
  children: ReactNode

  /**
   * Whether dropdown is open (controlled mode)
   */
  open?: boolean

  /**
   * Default open state (uncontrolled mode)
   */
  defaultOpen?: boolean

  /**
   * Called when open state changes
   */
  onOpenChange?: (open: boolean) => void

  /**
   * Dropdown placement relative to trigger
   */
  placement?: DropdownPlacement

  /**
   * Width utility (e.g. "w-64")
   */
  widthClassName?: string

  /**
   * Additional class on panel
   */
  panelClassName?: string
}
