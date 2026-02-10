import type BoardList from '#models/board_list'
import type { BoardListPublic } from '#dtos/list/board_list_public_dto_type'

export const boardListToPublicDto = (list: BoardList): BoardListPublic => {
  const pos =
    typeof list.position === 'string' ? Number.parseFloat(list.position) : Number(list.position)

  return {
    id: list.id,
    boardId: list.boardId,
    name: list.name,
    position: Number.isFinite(pos) ? pos : 0,
    visibility: list.visibility,
    createdAt: list.createdAt.toISO() ?? '',
    updatedAt: list.updatedAt.toISO() ?? '',
  }
}
