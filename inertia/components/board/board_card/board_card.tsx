import type { FC } from 'react'
import { FiColumns } from 'react-icons/fi'
import { PiKanbanFill } from 'react-icons/pi'
import { HiMiniTableCells } from 'react-icons/hi2'
import { MdViewTimeline } from 'react-icons/md'
import { IoCalendar } from 'react-icons/io5'

import type { BoardCardProps } from './board_card_type'
import type { BoardType } from '~/lib/types/board_public'

const typeIcon = (type: BoardType) => {
  if (type === 'kanban') return <PiKanbanFill className="text-lg" />
  if (type === 'table') return <HiMiniTableCells className="text-lg" />
  if (type === 'roadmap') return <MdViewTimeline className="text-lg" />
  if (type === 'calendar') return <IoCalendar className="text-lg" />
  return <FiColumns className="text-lg" />
}

const typeLabel = (type: BoardType) => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

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
      <div
        className="board-bg"
        style={bg ? { backgroundImage: bg } : undefined}
        aria-hidden="true"
      />
      <div className="board-overlay" aria-hidden="true" />

      <div className="board-content">
        <div className="board-title">{board.name}</div>

        <div className="board-meta">
          <span className="board-type-badge">{typeIcon(board.type)}</span>
          <span className="drop-shadow">{typeLabel(board.type)}</span>
        </div>
      </div>
    </button>
  )
}
