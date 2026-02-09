import type { BoardType } from '~/lib/types/board_public'

export type BoardTypePickerProps = {
  value: BoardType
  onChange: (type: BoardType) => void
}
