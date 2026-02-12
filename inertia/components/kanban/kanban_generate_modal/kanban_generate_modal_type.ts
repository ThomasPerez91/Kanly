import type { BoardPublic } from '~/lib/types/board_public'

export type KanbanGenerateModalProps = {
  open: boolean
  boardId: number
  board: BoardPublic
  onClose: () => void
  onGenerated?: () => void
}
