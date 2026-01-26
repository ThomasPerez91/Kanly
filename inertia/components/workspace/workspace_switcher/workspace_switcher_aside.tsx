import type { FC } from 'react'
import { FiPlus } from 'react-icons/fi'

import type { WorkspaceSwitcherAsideProps } from './workspace_switcher_aside_type'
import { WorkspaceSwitcherItem } from './workspace_switcher_item'
import { Avatar } from '~/components/ui/avatar/avatar'

export const WorkspaceSwitcherAside: FC<WorkspaceSwitcherAsideProps> = ({
  className,
  inDrawer,
  workspaces,
  activeWorkspaceId,
  onCreateClick,
  onWorkspaceClick,
}) => {
  if (inDrawer) {
    return (
      <aside className={`w-full p-3 ${className ?? ''}`} aria-label="Workspaces">
        <div className="space-y-2">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              type="button"
              onClick={() => onWorkspaceClick?.(ws.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-bg transition ${
                ws.id === activeWorkspaceId ? 'ring-4 ring-brand-500/15' : ''
              }`}
            >
              <Avatar name={ws.name} src={ws.avatarUrl} size="md" bordered={false} />

              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-900 text-text truncate">{ws.name}</div>
                <div className="text-xs text-text-muted truncate">Workspace</div>
              </div>
            </button>
          ))}

          <button
            type="button"
            onClick={onCreateClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-bg transition"
            aria-label="Create workspace"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <FiPlus className="text-lg" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-900 text-text truncate">Create workspace</div>
              <div className="text-xs text-text-muted truncate">Add a new workspace</div>
            </div>
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`aside-workspaces ${className ?? ''}`} aria-label="Workspaces">
      <div className="flex flex-col gap-3">
        {workspaces.map((ws) => (
          <WorkspaceSwitcherItem
            key={ws.id}
            name={ws.name}
            avatarUrl={ws.avatarUrl}
            isActive={ws.id === activeWorkspaceId}
            onClick={() => onWorkspaceClick?.(ws.id)}
          />
        ))}

        <button
          type="button"
          onClick={onCreateClick}
          className="workspace-add-btn"
          aria-label="Create workspace"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>
    </aside>
  )
}
