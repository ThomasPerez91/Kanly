import type { FC } from 'react'
import type { WorkspaceHoverLabelProps } from '~/components/workspace/workspace_hover_label/workspace_hover_label_type'

export const WorkspaceHoverLabel: FC<WorkspaceHoverLabelProps> = ({ label, children }) => {
  return (
    <div className="workspace-hover group relative">
      {children}

      <div className="workspace-tooltip">
        <div className="workspace-tooltip-inner relative">
          <span className="workspace-tooltip-arrow" aria-hidden="true" />
          <span className="workspace-tooltip-text">{label}</span>
        </div>
      </div>
    </div>
  )
}
