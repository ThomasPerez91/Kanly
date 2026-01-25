import type { FC } from 'react'
import type { WorkspaceSwitcherItemProps } from './workspace_switcher_item_type'
import { Avatar } from '~/components/ui/avatar/avatar'

export const WorkspaceSwitcherItem: FC<WorkspaceSwitcherItemProps> = ({
  name,
  avatarUrl,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`workspace-icon-btn ${isActive ? 'ring-4 ring-brand-500/20' : ''}`}
      aria-label={name}
    >
      <Avatar name={name} src={avatarUrl} size="lg" />
    </button>
  )
}
