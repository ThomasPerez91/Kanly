import type { FC } from 'react'
import type { WorkspaceSwitcherItemProps } from './workspace_switcher_item_type'
import { Avatar } from '~/components/ui/avatar/avatar'
import { WorkspaceHoverLabel } from '~/components/workspace/workspace_hover_label/workspace_hover_label'

export const WorkspaceSwitcherItem: FC<WorkspaceSwitcherItemProps> = ({
  name,
  avatarUrl,
  isActive,
  onClick,
}) => {
  return (
    <WorkspaceHoverLabel label={name}>
      <button
        type="button"
        onClick={onClick}
        className={`workspace-icon-btn ${isActive ? 'ring-4 ring-brand-500/20' : ''}`}
        aria-label={name}
      >
        <Avatar name={name} src={avatarUrl} size="lg" bordered={false} />
      </button>
    </WorkspaceHoverLabel>
  )
}
