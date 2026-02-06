import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type UseWorkspacesReturn = {
  workspaces: WorkspacePublic[]
  activeWorkspaceId: number | null
  hasWorkspace: boolean
}
