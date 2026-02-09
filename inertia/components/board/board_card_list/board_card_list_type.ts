import type { BoardPublic } from '~/lib/types/board_public'

export type BoardCardListProps = {
  board: BoardPublic
  onClick?: (boardId: number) => void
}
