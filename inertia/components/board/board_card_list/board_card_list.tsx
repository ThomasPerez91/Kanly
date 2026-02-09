import type { FC } from 'react'

import type { BoardCardListProps } from './board_card_list_type'
import { BoardTypeIcon, boardTypeLabel } from '~/components/board/board_type/board_type'

export const BoardCardList: FC<BoardCardListProps> = ({ board, onClick }) => {
  const bg = board.backgroundUrl?.trim() ? `url(${board.backgroundUrl})` : undefined

  return (
    <button
      type="button"
      onClick={() => onClick?.(board.id)}
      className="flex items-center gap-3 w-full h-16 text-left"
      aria-label={board.name}
    >
      {/* Thumbnail */}
      <div
        className="h-12 w-20 shrink-0 rounded-lg overflow-hidden border border-border bg-bg"
        style={
          bg
            ? { backgroundImage: bg, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      />

      {/* Text */}
      <div className="min-w-0">
        <div className="text-sm font-900 text-text truncate">{board.name}</div>
        <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-text-muted font-700">
          <BoardTypeIcon type={board.type} />
          <span className="drop-shadow">{boardTypeLabel(board.type)}</span>
        </div>
      </div>
    </button>
  )
}
