import type { FC, JSX } from 'react'
import { FiHome, FiColumns, FiGrid, FiActivity } from 'react-icons/fi'

import type { WorkspaceNavAsideProps } from './workspace_nav_aside_type'
import { WorkspaceHoverLabel } from '~/components/workspace/workspace_hover_label/workspace_hover_label'

type Item = {
  key: 'dashboard' | 'boards' | 'views' | 'activity'
  label: string
  icon: JSX.Element
}

const items: Item[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <FiHome className="text-xl" /> },
  { key: 'boards', label: 'Boards', icon: <FiColumns className="text-xl" /> },
  { key: 'views', label: 'Views', icon: <FiGrid className="text-xl" /> },
  { key: 'activity', label: 'Activity', icon: <FiActivity className="text-xl" /> },
]

export const WorkspaceNavAside: FC<WorkspaceNavAsideProps> = ({
  className,
  workspaceId,
  activeKey,
  onNavigate,
  isOpen,
  variant = 'desktop',
}) => {
  const base = variant === 'drawer' ? 'aside-workspace-nav-drawer' : 'aside-workspace-nav'

  return (
    <aside
      className={[
        base,
        isOpen ? 'aside-workspace-nav-open' : 'aside-workspace-nav-closed',
        className ?? '',
      ].join(' ')}
      aria-label="Workspace navigation"
    >
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <WorkspaceHoverLabel key={`${workspaceId}-${it.key}`} label={it.label}>
            <button
              type="button"
              onClick={() => onNavigate(it.key)}
              className={`workspace-nav-btn ${activeKey === it.key ? 'workspace-nav-btn-active' : ''}`}
              aria-label={it.label}
            >
              {it.icon}
            </button>
          </WorkspaceHoverLabel>
        ))}
      </div>
    </aside>
  )
}
