import type { FC } from 'react'
import { FiPlus } from 'react-icons/fi'
import { usePage } from '@inertiajs/react'

import type { WorkspaceSwitcherAsideProps } from './workspace_switcher_aside_type'
import { WorkspaceSwitcherItem } from './workspace_switcher_item'
import { Avatar } from '~/components/ui/avatar/avatar'

const getWorkspaceIdFromUrl = (rawUrl: string): number | null => {
  // 1) /workspaces/:id/...
  const m = rawUrl.match(/\/workspaces\/(\d+)(\/|$)/)
  if (m) {
    const n = Number(m[1])
    return Number.isFinite(n) ? n : null
  }

  // 2) /dashboard?workspace=123
  // rawUrl in Inertia is usually path + query, e.g. "/dashboard?workspace=1"
  const qIndex = rawUrl.indexOf('?')
  if (qIndex !== -1) {
    const qs = rawUrl.slice(qIndex + 1)
    const params = new URLSearchParams(qs)
    const w = params.get('workspace')
    if (w) {
      const n = Number(w)
      return Number.isFinite(n) ? n : null
    }
  }

  return null
}

export const WorkspaceSwitcherAside: FC<WorkspaceSwitcherAsideProps> = ({
  className,
  inDrawer,
  compactInDrawer,
  workspaces = [],
  // ⚠️ on garde la prop pour compat, mais on ne s’y fie plus pour le "active"
  activeWorkspaceId,
  onCreateClick,
  onWorkspaceClick,
}) => {
  const { url } = usePage()

  // ✅ Source of truth = URL. Fallback = prop.
  const resolvedActiveId = getWorkspaceIdFromUrl(url) ?? activeWorkspaceId ?? null

  if (inDrawer && compactInDrawer) {
    return (
      <aside className={`w-14 p-2 ${className ?? ''}`} aria-label="Workspaces">
        <div className="flex flex-col items-center gap-3">
          {workspaces.map((ws) => {
            const isActive = resolvedActiveId !== null && ws.id === resolvedActiveId
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => onWorkspaceClick?.(ws.id)}
                className={`workspace-icon-btn ${isActive ? 'ring-4 ring-brand-500/20' : ''}`}
                aria-label={ws.name}
                aria-current={isActive ? 'page' : undefined}
              >
                <Avatar name={ws.name} src={ws.avatarUrl} size="lg" bordered={false} />
              </button>
            )
          })}

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

  if (inDrawer) {
    return (
      <aside className={`w-full p-3 ${className ?? ''}`} aria-label="Workspaces">
        <div className="space-y-2">
          {workspaces.map((ws) => {
            const isActive = resolvedActiveId !== null && ws.id === resolvedActiveId
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => onWorkspaceClick?.(ws.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-surface hover:bg-bg transition ${
                  isActive ? 'ring-4 ring-brand-500/15' : ''
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Avatar name={ws.name} src={ws.avatarUrl} size="md" bordered={false} />

                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-900 text-text truncate">{ws.name}</div>
                  <div className="text-xs text-text-muted truncate">Workspace</div>
                </div>
              </button>
            )
          })}

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
              <div className="text-xs text-text-muted truncate">New workspace</div>
            </div>
          </button>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`aside-workspaces ${className ?? ''}`} aria-label="Workspaces">
      <div className="flex flex-col gap-3">
        {workspaces.map((ws) => {
          const isActive = resolvedActiveId !== null && ws.id === resolvedActiveId
          return (
            <WorkspaceSwitcherItem
              key={ws.id}
              name={ws.name}
              avatarUrl={ws.avatarUrl}
              isActive={isActive}
              onClick={() => onWorkspaceClick?.(ws.id)}
            />
          )
        })}

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
