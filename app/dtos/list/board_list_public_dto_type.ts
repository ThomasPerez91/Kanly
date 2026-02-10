import type { BoardListVisibility } from '#enums/board_list_visibility'

export type BoardListPublic = {
  id: number
  boardId: number
  name: string
  position: number
  visibility: BoardListVisibility
  createdAt: string
  updatedAt: string
}
