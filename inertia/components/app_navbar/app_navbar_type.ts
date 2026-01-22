import type { ReactNode } from 'react'
import type { AuthUser } from '~/lib/types/auth'

export type AppNavbarProps = {
  isAuthenticated: boolean
  user: AuthUser | null
  onOpenWorkspaceDrawer: () => void
  onLogout: () => void
  isLoggingOut?: boolean

  /**
   * Optional slot if later you want to inject extra actions.
   */
  rightSlot?: ReactNode
}
