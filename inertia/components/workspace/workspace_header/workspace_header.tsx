import type { FC } from 'react'
import { FiSettings } from 'react-icons/fi'

import type { WorkspaceHeaderProps } from './workspace_header_type'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { Dropdown } from '~/components/ui/dropdown/dropdown'
import { DropdownItem } from '~/components/ui/dropdown/dropdown_item'
import { DropdownSeparator } from '~/components/ui/dropdown/dropdown_separator'

export const WorkspaceHeader: FC<WorkspaceHeaderProps> = ({ workspace, onEdit, onDelete }) => {
  const { isAuthenticated } = useAuthUser()
  const canManage = isAuthenticated && workspace.role === 'owner'

  const trigger = (
    <span
      className={[
        'h-9 w-9 rounded-lg inline-flex items-center justify-center',
        'text-text-muted hover:text-text hover:bg-black/5 transition',
        'focus:outline-none focus:(ring-4 ring-brand-500/20)',
      ].join(' ')}
      aria-label="Workspace settings"
    >
      <FiSettings className="h-5 w-5" />
    </span>
  )

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="h2 truncate">{workspace.name}</h1>
        <p className="muted">Overview of this workspace</p>
      </div>

      {canManage ? (
        <Dropdown
          trigger={trigger}
          placement="bottom-end"
          widthClassName="w-56"
          panelClassName="p-1"
        >
          <DropdownItem type="button" label="Edit workspace" onClick={onEdit} />
          <DropdownSeparator />
          <DropdownItem
            type="button"
            label="Delete workspace"
            className="dropdown-item-danger"
            onClick={onDelete}
          />
        </Dropdown>
      ) : null}
    </div>
  )
}
