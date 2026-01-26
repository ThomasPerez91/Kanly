import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type WorkspaceEditModalProps = {
  open: boolean
  onClose: () => void
  workspace: WorkspacePublic
}
