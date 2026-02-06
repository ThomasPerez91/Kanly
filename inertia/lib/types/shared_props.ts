import type { SharedAuth } from '~/lib/types/auth'
import { WorkspacePublic } from '~/lib/types/workspace_public'

export type SharedProps = {
  auth: SharedAuth
  csrfToken: string
  workspaces?: WorkspacePublic[]
  activeWorkspaceId?: number | null
}
