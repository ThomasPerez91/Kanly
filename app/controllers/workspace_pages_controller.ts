import type { HttpContext } from '@adonisjs/core/http'

import Board from '#models/board'
import Workspace from '#models/workspace'
import { WorkspaceUserRoles } from '#enums/workspace_user_roles'
import { boardToPublicDto } from '#dtos/board/board_public_dto'
import type { BoardPublicDTO } from '#dtos/board/board_public_dto_type'

async function getWorkspaceMembership(userId: number, workspaceId: number) {
  const membership = await Workspace.query()
    .select(['workspaces.id', 'workspaces.owner_id', 'workspaces_users.role as role'])
    .join('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
    .where('workspaces.id', workspaceId)
    .where('workspaces_users.user_id', userId)
    .first()

  if (!membership) return null

  const role = (membership as any).$extras.role as WorkspaceUserRoles
  const isOwner = membership.ownerId === userId || role === WorkspaceUserRoles.owner
  const isAdmin = role === WorkspaceUserRoles.admin

  return { membership, role, isOwner, isAdmin }
}

export default class WorkspacePagesController {
  /**
   * GET /workspaces/:workspaceId/boards
   * - HTML: render inertia workspace/boards + boards
   * - JSON: { boards }
   */
  async boards({ auth, params, request, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const boards = await Board.query().where('workspace_id', workspaceId).orderBy('created_at', 'desc')
    const data: BoardPublicDTO[] = boards.map(boardToPublicDto)

    // Si le client demande du JSON (fetch / actions), on répond JSON
    const accepted = request.accepts(['json', 'html'])
    if (accepted === 'json') {
      return response.ok({ boards: data })
    }

    // Sinon, page inertia
    return inertia.render('workspace/boards', {
      workspaceId,
      boards: data,
    })
  }

  /**
   * GET /workspaces/:workspaceId/views
   * (pas de data pour le moment)
   */
  async views({ auth, params, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    return inertia.render('workspace/views', { workspaceId })
  }

  /**
   * GET /workspaces/:workspaceId/activity
   * (pas de data pour le moment)
   */
  async activity({ auth, params, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    return inertia.render('workspace/activity', { workspaceId })
  }
}
