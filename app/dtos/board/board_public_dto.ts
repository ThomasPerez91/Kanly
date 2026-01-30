import Board from '#models/board'
import type { BoardPublicDTO } from '#dtos/board/board_public_dto_type'

export function boardToPublicDto(board: Board): BoardPublicDTO {
  return {
    id: board.id,
    workspaceId: board.workspaceId,
    ownerId: board.ownerId,
    name: board.name,
    type: board.type,
    backgroundUrl: board.backgroundUrl,
    createdAt: board.createdAt.toISO()!,
    updatedAt: board.updatedAt.toISO()!,
  }
}
