import { WorkspaceUserRoles } from '#enum/workspace_user_roles'

export type WorkspacePublicDTO = {
  id: number
  name: string
  slug: string
  avatarUrl: string | null
  role: WorkspaceUserRoles
}