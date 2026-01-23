import Workspace from '#models/workspace'
import { WorkspaceUserRoles } from '#enums/workspace_user_roles'
import type { WorkspacePublicDTO } from '#dtos/workspace/workspace_public_dto_type'

export function workspaceToPublicDto(workspace: Workspace): WorkspacePublicDTO {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    avatarUrl: workspace.avatarUrl,
    role: workspace.$extras.role as WorkspaceUserRoles,
  }
}
