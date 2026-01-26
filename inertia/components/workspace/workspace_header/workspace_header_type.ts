import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type WorkspaceHeaderProps = {
  workspace: WorkspacePublic
  onEdit: () => void
  onDelete: () => void
}
