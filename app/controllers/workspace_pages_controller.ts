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

function parseArchivedFlag(input: unknown): boolean {
  // default: false
  if (input === undefined || input === null || input === '') return false

  const v = String(input).toLowerCase().trim()
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return true
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return false

  return false
}

export default class WorkspacePagesController {
  /**
   * GET /workspaces/:workspaceId/boards
   * - HTML: render inertia workspace/boards + boards
   * - JSON: { boards }
   *
   * Query:
   * - ?archived=1 => archived boards
   * - (default)   => active boards
   */
  async boards({ auth, params, request, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const archived = parseArchivedFlag(request.qs().archived)

    const boards = await Board.query()
      .where('workspace_id', workspaceId)
      .where('archived', archived)
      .orderBy('created_at', 'desc')

    const data: BoardPublicDTO[] = boards.map(boardToPublicDto)

    const accepted = request.accepts(['json', 'html'])
    if (accepted === 'json') {
      return response.ok({ boards: data })
    }

    return inertia.render('workspace/boards', {
      workspaceId,
      archived,
      boards: data,
    })
  }

  async views({ auth, params, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    return inertia.render('workspace/views', { workspaceId })
  }

  async activity({ auth, params, response, inertia }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    return inertia.render('workspace/activity', { workspaceId })
  }
}
