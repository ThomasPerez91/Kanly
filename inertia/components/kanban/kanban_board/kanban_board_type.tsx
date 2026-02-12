import type { BoardPublic } from '~/lib/types/board_public'
import type { BoardListPublic } from '~/lib/types/board_list_public'

export type KanbanBoardProps = {
  board: BoardPublic
  lists: BoardListPublic[]
}
