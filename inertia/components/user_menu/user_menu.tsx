import type { FC } from 'react'
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi'

import type { UserMenuProps } from './user_menu_type'
import { Dropdown } from '~/components/ui/dropdown/dropdown'
import { DropdownItem } from '~/components/ui/dropdown/dropdown_item'
import { DropdownSeparator } from '~/components/ui/dropdown/dropdown_separator'
import { Skeleton } from '~/components/ui/skeleton/skeleton'

export const UserMenu: FC<UserMenuProps> = ({ user, onLogout, isLoggingOut }) => {
  const avatar = (
    <div className="avatar-btn" aria-label="Open user menu">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} className="avatar-img" />
      ) : (
        <span className="avatar-fallback">{(user.email?.[0] ?? 'U').toUpperCase()}</span>
      )}
    </div>
  )

  return (
    <Dropdown trigger={avatar} placement="bottom-end" widthClassName="w-72">
      {/* Header */}
      <div className="px-3 py-3">
        <div className="text-sm font-900 text-text truncate">
          {user.name ? user.name : user.email}
        </div>
        <div className="text-xs text-text-muted truncate">{user.email}</div>
      </div>

      <DropdownSeparator />

      <DropdownItem type="link" href="/profile" label="Profile" icon={<FiUser />} />
      <DropdownItem type="link" href="/settings" label="Settings" icon={<FiSettings />} />

      <DropdownSeparator />

      <DropdownItem
        type="button"
        onClick={onLogout}
        label="Logout"
        icon={<FiLogOut />}
        className="dropdown-item-danger"
        rightSlot={
          isLoggingOut ? <Skeleton className="h-4 w-4 rounded-full" label="Logging out" /> : null
        }
        disabled={Boolean(isLoggingOut)}
      />
    </Dropdown>
  )
}
