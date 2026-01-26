import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type WorkspaceSwitcherAsideProps = {
  className?: string
  inDrawer?: boolean
  workspaces: WorkspacePublic[]
  activeWorkspaceId?: number | null
  onCreateClick: () => void
  onWorkspaceClick?: (workspaceId: number) => void
}
