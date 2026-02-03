import type { BoardPublic } from '~/lib/types/board_public'

export type BoardEditModalProps = {
  open: boolean
  onClose: () => void
  board: BoardPublic
  onSaved?: () => void
}
