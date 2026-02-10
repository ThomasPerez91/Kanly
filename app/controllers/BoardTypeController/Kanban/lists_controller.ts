import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import Board from '#models/board'
import BoardList from '#models/board_list'
import Workspace from '#models/workspace'

import { boardListToPublicDto } from '#dtos/lists/board_list_public_dto'
import { createBoardListValidator, updateBoardListValidator } from '#validators/board_list_validator'
import { BoardListVisibility } from '#enums/board_list_visibility'
import { ListCreator } from '#services/lists/list_creator'

@inject()
export default class ListsController {
  constructor(private creator: ListCreator) {}

  private async assertBoardMembership(userId: number, board: Board) {
    const membership = await Workspace.query()
      .where('workspaces.id', board.workspaceId)
      .join('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
      .where('workspaces_users.user_id', userId)
      .first()

    if (!membership) {
      const err: any = new Error('Unauthorized')
      err.status = 401
      throw err
    }
  }

  private assertKanban(board: Board, response: HttpContext['response']) {
    if (board.type !== 'kanban') {
      return response.badRequest({ message: 'Lists are only available for kanban boards for now.' })
    }
    return null
  }

  /**
   * GET /boards/:boardId/lists
   */
  async index({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.boardId)

    const board = await Board.findOrFail(boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const lists = await BoardList.query().where('board_id', board.id).orderBy('position', 'asc')
    return { lists: lists.map(boardListToPublicDto) }
  }

  /**
   * POST /boards/:boardId/lists
   * Supporte:
   * - single: { name, position?, visibility? } (validator officiel)
   * - bulk:   { lists: [{ name, position?, visibility? }, ...] } (utile modal)
   */
  async create({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.boardId)

    const board = await Board.findOrFail(boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const raw = request.body()

    // Bulk create (modal custom / etc.)
    if (Array.isArray(raw?.lists)) {
      const lists = raw.lists
        .filter((x: any) => x && typeof x.name === 'string')
        .map((x: any) => ({
          name: String(x.name),
          position: typeof x.position === 'number' ? x.position : undefined,
          visibility:
            x.visibility && Object.values(BoardListVisibility).includes(x.visibility)
              ? x.visibility
              : undefined,
        }))

      if (lists.length === 0) {
        return response.badRequest({ message: 'No lists provided.' })
      }

      const created = await this.creator.createMany({ board, lists })
      return response.created({ lists: created.map(boardListToPublicDto) })
    }

    // Single create (avec ton validator officiel)
    const payload = await request.validateUsing(createBoardListValidator)

    const list = await this.creator.createOne({
      board,
      name: payload.name,
      position: payload.position,
      visibility: payload.visibility,
    })

    return response.created({ list: boardListToPublicDto(list) })
  }

  /**
   * PATCH /lists/:id
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const id = Number(params.id)

    const list = await BoardList.findOrFail(id)
    const board = await Board.findOrFail(list.boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const payload = await request.validateUsing(updateBoardListValidator)

    if (payload.name !== undefined) list.name = payload.name
    if (payload.position !== undefined) list.position = payload.position
    if (payload.visibility !== undefined) list.visibility = payload.visibility

    await list.save()
    return { list: boardListToPublicDto(list) }
  }

  /**
   * DELETE /lists/:id
   */
  async delete({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const id = Number(params.id)

    const list = await BoardList.findOrFail(id)
    const board = await Board.findOrFail(list.boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    await list.delete()
    return response.noContent()
  }
}
