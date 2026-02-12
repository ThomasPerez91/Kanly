import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import Board from '#models/board'
import BoardList from '#models/board_list'
import Workspace from '#models/workspace'

import { boardListToPublicDto } from '#dtos/list/board_list_public_dto'
import { DefaultList } from '#enums/default_list'
import { BoardListVisibility } from '#enums/board_list_visibility'
import { ListCreator } from '#services/lists/list_creator'
import {
  generateBoardListsValidator,
  reorderBoardListsValidator,
} from '#validators/board_list_validator'

@inject()
export default class BoardListsController {
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
      return response.badRequest({ message: 'This endpoint is only for kanban boards.' })
    }
    return null
  }

  /**
   * GET /boards/:boardId/kanban
   * Page + datas
   */
  async show({ auth, inertia, params, request, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.boardId)

    const board = await Board.findOrFail(boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const lists = await BoardList.query().where('board_id', board.id).orderBy('position', 'asc')

    const props = {
      boardId: board.id,
      board,
      lists: lists.map(boardListToPublicDto),
    }

    if (request.accepts(['json'])) return props

    // TODO: ajuste au vrai path inertia (ex: 'workspace/board/kanban' etc.)
    return inertia.render('board/kanban', props)
  }

  /**
   * PATCH /boards/:boardId/kanban/lists/reorder
   * orderedIds: [3,1,2]
   * reindex: true => 100,200,300...
   */
  async reorder({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.boardId)

    const board = await Board.findOrFail(boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const payload = await request.validateUsing(reorderBoardListsValidator)

    const lists = await BoardList.query()
      .where('board_id', board.id)
      .whereIn('id', payload.orderedIds)

    const byId = new Map(lists.map((l) => [l.id, l]))
    const missing = payload.orderedIds.filter((id: number) => !byId.has(id))
    if (missing.length > 0) {
      return response.badRequest({ message: 'Some lists do not belong to this board.', missing })
    }

    const doReindex = payload.reindex ?? true
    if (doReindex) {
      let pos = 100
      for (const id of payload.orderedIds) {
        const list = byId.get(id)!
        list.position = pos
        pos += 100
        await list.save()
      }
      await BoardList.transaction(async (trx) => {
        for (const id of payload.orderedIds) {
          const list = byId.get(id)!
          list.useTransaction(trx)
          await list.save()
        }
      })
    }

    const fresh = await BoardList.query().where('board_id', board.id).orderBy('position', 'asc')
    return { lists: fresh.map(boardListToPublicDto) }
  }

  /**
   * POST /boards/:boardId/kanban/lists/generate
   *
   * mode: "default" | "custom"
   * - default: crée les DefaultList (ToDo, Ready, InProgress, Review, Done, Blocked)
   * - custom: crée les colonnes passées depuis la modal
   *
   * IMPORTANT:
   * Ici on n'appelle pas ListsController.create, car controllers != services.
   * On réutilise le même service (ListCreator) que ListsController.create.
   */
  async generateBoardLists({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const boardId = Number(params.boardId)

    const board = await Board.findOrFail(boardId)
    await this.assertBoardMembership(user.id, board)

    const notKanban = this.assertKanban(board, response)
    if (notKanban) return notKanban

    const payload = await request.validateUsing(generateBoardListsValidator)

    // MVP safe: évite double génération
    const hasAny = await BoardList.query().where('board_id', board.id).limit(1)
    if (hasAny.length > 0) {
      return response.badRequest({ message: 'Lists already generated for this board.' })
    }

    if (payload.mode === 'default') {
      const names: string[] = [
        DefaultList.ToDo,
        DefaultList.Ready,
        DefaultList.InProgress,
        DefaultList.Review,
        DefaultList.Done,
        DefaultList.Blocked,
      ]

      const created = await this.creator.createMany({
        board,
        lists: names.map((name) => ({
          name,
          visibility: BoardListVisibility.Showed,
        })),
      })

      return response.created({ lists: created.map(boardListToPublicDto) })
    }

    // custom
    const customLists = payload.lists ?? []
    if (customLists.length === 0) {
      return response.badRequest({ message: 'Custom mode requires lists.' })
    }

    const created = await this.creator.createMany({
      board,
      lists: customLists.map((l: { name: any; visibility: any }) => ({
        name: l.name,
        visibility: l.visibility ?? BoardListVisibility.Showed,
      })),
    })

    return response.created({ lists: created.map(boardListToPublicDto) })
  }
}
