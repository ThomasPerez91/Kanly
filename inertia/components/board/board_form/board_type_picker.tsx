import type { FC, ReactNode } from 'react'
import { PiKanbanFill } from 'react-icons/pi'
import { HiMiniTableCells } from 'react-icons/hi2'
import { MdViewTimeline } from 'react-icons/md'
import { IoCalendar } from 'react-icons/io5'
import type { BoardType } from '~/lib/types/board_public'

type BoardTypePickerProps = {
  value: BoardType
  onChange: (type: BoardType) => void
}

export const boardTypeIcon = (type: BoardType): ReactNode => {
  if (type === 'kanban') return <PiKanbanFill className="text-2xl" />
  if (type === 'table') return <HiMiniTableCells className="text-2xl" />
  if (type === 'roadmap') return <MdViewTimeline className="text-2xl" />
  if (type === 'calendar') return <IoCalendar className="text-2xl" />
  return <PiKanbanFill className="text-2xl" />
}

export const boardTypeLabel = (type: BoardType) => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

export const BoardTypePicker: FC<BoardTypePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <div className="label">Type</div>

      <div className="board-type-grid">
        {(['kanban', 'table', 'roadmap', 'calendar'] as BoardType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={['board-type-btn', value === t ? 'board-type-btn-active' : ''].join(' ')}
            aria-label={boardTypeLabel(t)}
          >
            <span className="board-type-ico">{boardTypeIcon(t)}</span>
            <span className="board-type-txt">{boardTypeLabel(t)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
