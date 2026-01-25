import type { FC } from 'react'
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi'

import type { UserMenuProps } from './user_menu_type'
import { Dropdown } from '~/components/ui/dropdown/dropdown'
import { DropdownItem } from '~/components/ui/dropdown/dropdown_item'
import { DropdownSeparator } from '~/components/ui/dropdown/dropdown_separator'
import { UserAvatar } from '~/components/user/user_avatar/user_avatar'

export const UserMenu: FC<UserMenuProps> = ({ user, onLogout, isLoggingOut }) => {
  if (!user) return null

  const trigger = (
    <div
      className={[
        'h-10 w-10 rounded-full border border-border bg-surface overflow-hidden',
        'flex items-center justify-center hover:bg-bg transition',
      ].join(' ')}
    >
      <UserAvatar
        fullName={user.fullName ?? null}
        email={user.email ?? null}
        avatarUrl={user.avatarUrl ?? null}
        size="md"
        className="h-full w-full bg-transparent"
      />
    </div>
  )

  return (
    <Dropdown trigger={trigger} placement="bottom-end" widthClassName="w-60" panelClassName="p-1">
      <div className="px-3 py-2">
        <div className="text-sm font-900 text-text truncate">{user.fullName || 'Account'}</div>
        <div className="text-xs text-text-muted truncate">{user.email}</div>
      </div>

      <DropdownSeparator />

      <DropdownItem type="link" href="/me" label="Profile" icon={<FiUser />} />
      <DropdownItem type="link" href="/settings" label="Settings" icon={<FiSettings />} />

      <DropdownSeparator />

      <DropdownItem
        type="button"
        label={isLoggingOut ? 'Logging out…' : 'Logout'}
        icon={<FiLogOut />}
        disabled={Boolean(isLoggingOut)}
        className="dropdown-item-danger"
        onClick={onLogout}
      />
    </Dropdown>
  )
}
