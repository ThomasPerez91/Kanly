import type { BoardType } from '~/lib/types/board_public'

export type BoardPreviewProps = {
  name: string
  type: BoardType
  backgroundUrl?: string | null
  className?: string
}
