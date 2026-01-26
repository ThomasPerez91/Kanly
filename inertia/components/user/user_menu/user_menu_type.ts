export type UserMenuProps = {
  user: {
    fullName?: string | null
    email?: string | null
    avatarUrl?: string | null
  } | null
  onLogout: () => void
  isLoggingOut?: boolean
}
