import type { BoardPublic } from '~/lib/types/board_public'

export type BoardCardProps = {
  board: BoardPublic
  onClick?: (boardId: number) => void
}
