import type { FC } from 'react'
import { FiPlus } from 'react-icons/fi'

import type { WorkspaceSwitcherAsideProps } from './workspace_switcher_aside_type'
import { WorkspaceSwitcherItem } from './workspace_switcher_item'

const DEMO_WORKSPACES = [
  { id: 'ws-1', name: 'Acme' },
  { id: 'ws-2', name: 'Studio' },
  { id: 'ws-3', name: 'Personal' },
  { id: 'ws-4', name: 'Side' },
]

export const WorkspaceSwitcherAside: FC<WorkspaceSwitcherAsideProps> = ({
  className,
  inDrawer,
}) => {
  if (inDrawer) {
    return (
      <aside className={`w-full p-3 ${className ?? ''}`} aria-label="Workspaces">
        <div className="space-y-2">
          {DEMO_WORKSPACES.map((ws, idx) => (
            <button
              key={ws.id}
              type="button"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-bg transition ${
                idx === 0 ? 'ring-4 ring-brand-500/15' : ''
              }`}
            >
              <div className="h-10 w-10 rounded-xl border border-border bg-bg flex items-center justify-center font-900">
                {ws.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-900 text-text">{ws.name}</div>
                <div className="text-xs text-text-muted">Workspace</div>
              </div>
            </button>
          ))}

          {/* Add workspace = last item in the list */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-bg transition"
            aria-label="Create workspace"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <FiPlus className="text-lg" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-900 text-text">Create workspace</div>
              <div className="text-xs text-text-muted">Add a new workspace</div>
            </div>
          </button>
        </div>
      </aside>
    )
  }

  // Desktop: discord-like vertical icons, including "+" as last item in the same flow
  return (
    <aside className={`aside-workspaces ${className ?? ''}`} aria-label="Workspaces">
      <div className="flex flex-col gap-3">
        {DEMO_WORKSPACES.map((ws, idx) => (
          <WorkspaceSwitcherItem key={ws.id} id={ws.id} name={ws.name} isActive={idx === 0} />
        ))}

        {/* Add workspace = last item */}
        <button type="button" className="workspace-add-btn" aria-label="Create workspace">
          <FiPlus className="text-xl" />
        </button>
      </div>
    </aside>
  )
}
