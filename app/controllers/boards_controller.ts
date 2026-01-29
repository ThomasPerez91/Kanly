// app/controllers/boards_controller.ts
import type { HttpContext } from '@adonisjs/core/http'

import Board from '#models/board'
import Workspace from '#models/workspace'
import { WorkspaceUserRoles } from '#enums/workspace_user_roles'
import { createBoardValidator, updateBoardValidator } from '#validators/board'

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

export default class BoardsController {
  async index({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const boards = await Board.query()
      .where('workspace_id', workspaceId)
      .orderBy('created_at', 'desc')
    return response.ok({ boards })
  }

  async store({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const workspaceId = Number(params.workspaceId)

    const membership = await getWorkspaceMembership(user.id, workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    // payload vine
    const payload = await request.validateUsing(createBoardValidator)

    // compat camel/snake
    const backgroundUrl = (request.input('backgroundUrl') ??
      request.input('background_url') ??
      payload.backgroundUrl ??
      null) as string | null

    const board = await Board.create({
      workspaceId,
      ownerId: user.id,
      name: payload.name,
      type: payload.type,
      backgroundUrl,
    })

    return response.created({ board })
  }

  async show({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.id)

    const board = await Board.find(boardId)
    if (!board) return response.notFound({ message: 'Board not found' })

    const membership = await getWorkspaceMembership(user.id, board.workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    return response.ok({ board })
  }

  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.id)

    const board = await Board.find(boardId)
    if (!board) return response.notFound({ message: 'Board not found' })

    const membership = await getWorkspaceMembership(user.id, board.workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const canEdit = board.ownerId === user.id || membership.isOwner || membership.isAdmin
    if (!canEdit) return response.unauthorized({ message: 'Not allowed' })

    // payload vine
    const payload = await request.validateUsing(updateBoardValidator)

    if (payload.name !== undefined) board.name = payload.name
    if (payload.type !== undefined) board.type = payload.type

    // compat camel/snake + possibilité de null
    const backgroundUrl = request.input('backgroundUrl') ?? request.input('background_url')
    if (backgroundUrl !== undefined) {
      board.backgroundUrl = backgroundUrl
    } else if (payload.backgroundUrl !== undefined) {
      board.backgroundUrl = payload.backgroundUrl
    }

    await board.save()
    return response.ok({ board })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.id)

    const board = await Board.find(boardId)
    if (!board) return response.notFound({ message: 'Board not found' })

    const membership = await getWorkspaceMembership(user.id, board.workspaceId)
    if (!membership) return response.unauthorized({ message: 'Not allowed' })

    const canDelete = board.ownerId === user.id || membership.isOwner || membership.isAdmin
    if (!canDelete) return response.unauthorized({ message: 'Not allowed' })

    await board.delete()
    return response.noContent()
  }
}
