import type { FC } from 'react'
import type { BoardType } from '~/lib/types/board_public'

import type { BoardTypePickerProps } from './board_type_picker_type'
import { BOARD_TYPES, BoardTypeIcon, boardTypeLabel } from '~/components/board/board_type/board_type'

export const BoardTypePicker: FC<BoardTypePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <div className="label">Type</div>

      <div className="board-type-grid">
        {(BOARD_TYPES as unknown as BoardType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={['board-type-btn', value === t ? 'board-type-btn-active' : ''].join(' ')}
            aria-label={boardTypeLabel(t)}
          >
            <span className="board-type-ico">
              <BoardTypeIcon type={t} className="text-2xl" />
            </span>
            <span className="board-type-txt">{boardTypeLabel(t)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
