import type { FC } from 'react'
import { FiColumns } from 'react-icons/fi'
import { PiKanbanFill } from 'react-icons/pi'
import { HiMiniTableCells } from 'react-icons/hi2'
import { MdViewTimeline } from 'react-icons/md'
import { IoCalendar } from 'react-icons/io5'

import type { BoardPublic, BoardType } from '~/lib/types/board_public'

type Props = {
  board: BoardPublic
  onClick?: (boardId: number) => void
}

const typeIcon = (type: BoardType) => {
  if (type === 'kanban') return <PiKanbanFill />
  if (type === 'table') return <HiMiniTableCells />
  if (type === 'roadmap') return <MdViewTimeline />
  if (type === 'calendar') return <IoCalendar />
  return <FiColumns />
}

export const BoardCardList: FC<Props> = ({ board, onClick }) => {
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
          {typeIcon(board.type)}
          <span className="capitalize">{board.type}</span>
        </div>
      </div>
    </button>
  )
}
