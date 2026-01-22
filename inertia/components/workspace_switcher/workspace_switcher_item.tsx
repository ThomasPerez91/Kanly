import type { FC } from 'react'

import type { WorkspaceSwitcherItemProps } from './workspace_switcher_item_type'

export const WorkspaceSwitcherItem: FC<WorkspaceSwitcherItemProps> = ({
  name,
  imageUrl,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`workspace-icon-btn ${isActive ? 'ring-4 ring-brand-500/20' : ''}`}
      aria-label={`Open workspace ${name}`}
    >
      {imageUrl ? (
        <img src={imageUrl} className="h-full w-full object-cover" />
      ) : (
        <span className="text-sm font-900">{name.slice(0, 1).toUpperCase()}</span>
      )}
    </button>
  )
}
