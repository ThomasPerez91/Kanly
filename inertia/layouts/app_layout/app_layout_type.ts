import type { ReactNode } from 'react'
import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type AppLayoutProps = {
  title?: string
  children: ReactNode
  workspaces: WorkspacePublic[]
  activeWorkspaceId?: number | null
}
