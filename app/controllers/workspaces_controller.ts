import type { HttpContext } from '@adonisjs/core/http'
import Workspace from '#models/workspace'
import { workspaceToPublicDto, type WorkspacePublicDTO } from '#dtos/workspace/workspace_public_dto'

export default class WorkspacesController {
  async index({ auth, inertia }: HttpContext) {
    const user = auth.user!

    const workspaces = await Workspace.query()
      .select([
        'workspaces.id',
        'workspaces.name',
        'workspaces.slug',
        'workspace_users.role as role',
      ])
      .whereHas('users', (q) => {
        q.where('users.id', user.id)
      })
      .join('workspace_users', (join) => {
        join
          .on('workspace_users.workspace_id', '=', 'workspaces.id')
          .andOnVal('workspace_users.user_id', '=', user.id)
      })
      .orderBy('workspaces.name', 'asc')

    const data: WorkspacePublicDTO[] = workspaces.map(workspaceToPublicDto)

    return inertia.render('dashboard/dashboard', {
      workspaces: data,
    })
  }
}
