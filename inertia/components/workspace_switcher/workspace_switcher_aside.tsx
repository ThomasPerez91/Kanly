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
  const rootClass = inDrawer
    ? `w-full p-3 ${className ?? ''}`
    : `aside-workspaces ${className ?? ''}`

  return (
    <aside className={rootClass} aria-label="Workspaces">
      <div className={inDrawer ? 'flex flex-col gap-3' : 'flex flex-col gap-3 flex-1'}>
        {DEMO_WORKSPACES.map((ws, idx) => (
          <WorkspaceSwitcherItem key={ws.id} id={ws.id} name={ws.name} isActive={idx === 0} />
        ))}
      </div>

      <div className={inDrawer ? 'mt-4' : 'mt-auto'}>
        <button type="button" className="workspace-add-btn" aria-label="Create workspace">
          <FiPlus className="text-xl" />
        </button>
      </div>
    </aside>
  )
}
