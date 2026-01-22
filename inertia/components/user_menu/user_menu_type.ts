import type { AuthUser } from '~/lib/types/auth'

export type UserMenuProps = {
  user: AuthUser
  onLogout: () => void
  isLoggingOut?: boolean
}
