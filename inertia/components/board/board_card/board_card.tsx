import type { FC } from 'react'
import { FiCalendar, FiColumns, FiGrid, FiMap } from 'react-icons/fi'

import type { BoardCardProps } from './board_card_type'
import type { BoardType } from '~/lib/types/board_public'

const typeIcon = (type: BoardType) => {
  if (type === 'kanban') return <FiColumns className="text-lg" />
  if (type === 'table') return <FiGrid className="text-lg" />
  if (type === 'roadmap') return <FiMap className="text-lg" />
  if (type === 'calendar') return <FiCalendar className="text-lg" />
  return <FiColumns className="text-lg" />
}

const typeLabel = (type: BoardType) => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

export const BoardCard: FC<BoardCardProps> = ({ board, onClick }) => {
  const bg = board.backgroundUrl?.trim() ? `url(${board.backgroundUrl})` : null

  return (
    <button
      type="button"
      onClick={() => onClick?.(board.id)}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface text-left shadow-[0_10px_30px_rgba(15,23,42,0.08)] focus:outline-none focus:(ring-4 ring-brand-500/20)"
      aria-label={board.name}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={bg ? { backgroundImage: bg } : undefined}
        aria-hidden="true"
      />

      {/* overlay lisibilité */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/0 opacity-90 group-hover:opacity-100 transition"
        aria-hidden="true"
      />

      <div className="relative p-4 h-28 flex flex-col justify-end">
        <div className="text-base font-900 text-white leading-tight drop-shadow">{board.name}</div>

        <div className="mt-2 inline-flex items-center gap-2 text-white/90 text-sm font-800">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-white/15 border border-white/15">
            {typeIcon(board.type)}
          </span>
          <span className="drop-shadow">{typeLabel(board.type)}</span>
        </div>
      </div>
    </button>
  )
}
