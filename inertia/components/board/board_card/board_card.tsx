import type { FC } from 'react'

import type { BoardCardProps } from './board_card_type'
import { BoardTypeIcon, boardTypeLabel } from '~/components/board/board_type/board_type'

export const BoardCard: FC<BoardCardProps> = ({ board, onClick, className, fullWidth }) => {
  const bg = board.backgroundUrl?.trim() ? `url(${board.backgroundUrl})` : null
  const sizeClass = fullWidth ? 'w-full h-32' : 'board-card-size'

  return (
    <button
      type="button"
      onClick={() => onClick?.(board.id)}
      className={[
        'group board-card text-left focus:outline-none focus:(ring-4 ring-brand-500/20)',
        sizeClass,
        className ?? '',
      ].join(' ')}
      aria-label={board.name}
    >
      <div className="board-bg" style={bg ? { backgroundImage: bg } : undefined} aria-hidden="true" />
      <div className="board-overlay" aria-hidden="true" />

      <div className="board-content">
        <div className="board-title">{board.name}</div>

        <div className="board-meta">
          <span className="board-type-badge">
            <BoardTypeIcon type={board.type} className="text-lg" />
          </span>
          <span className="drop-shadow">{boardTypeLabel(board.type)}</span>
        </div>
      </div>
    </button>
  )
}
