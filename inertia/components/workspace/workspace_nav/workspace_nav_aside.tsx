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
  disableAnimation = false,
}) => {
  const base = variant === 'drawer' ? 'aside-workspace-nav-drawer' : 'aside-workspace-nav'

  // ✅ when animations are disabled, we use instant states without transitions
  const openClass = disableAnimation
    ? 'translate-x-0 opacity-100 pointer-events-auto'
    : 'aside-workspace-nav-open'

  const closedClass = disableAnimation
    ? '-translate-x-full opacity-0 pointer-events-none'
    : 'aside-workspace-nav-closed'

  return (
    <aside
      className={[base, isOpen ? openClass : closedClass, className ?? ''].join(' ')}
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
