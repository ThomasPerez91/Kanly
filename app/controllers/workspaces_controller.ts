import type { HttpContext } from '@adonisjs/core/http'
import Workspace from '#models/workspace'
import { workspaceToPublicDto } from '#dtos/workspace/workspace_public_dto'
import type { WorkspacePublicDTO } from '#dtos/workspace/workspace_public_dto_type'

export default class WorkspacesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const workspaces = await Workspace.query()
      .select([
        'workspaces.id',
        'workspaces.name',
        'workspaces.slug',
        'workspaces.avatar_url',
        'workspaces_users.role as role',
      ])
      .whereHas('users', (q) => {
        q.where('users.id', user.id)
      })
      .join('workspaces_users', (join) => {
        join
          .on('workspaces_users.workspace_id', '=', 'workspaces.id')
          .andOnVal('workspaces_users.user_id', '=', user.id)
      })
      .orderBy('workspaces.name', 'asc')

    const data: WorkspacePublicDTO[] = workspaces.map(workspaceToPublicDto)

    return inertia.render('dashboard/dashboard', {
      workspaces: data,
    })
  }
}
