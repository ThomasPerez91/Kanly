import type { FC } from 'react'
import type { BoardPublic, BoardType } from '~/lib/types/board_public'

type Props = {
  board: BoardPublic
  variant: 'desktop' | 'mobile'
}

const typeLabel = (type: BoardType) => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

export const BoardStats: FC<Props> = ({ board, variant }) => {
  if (variant === 'desktop') {
    return (
      <div className="flex items-center justify-center">
        <div className="text-sm font-900 text-text">
          Type: <span className="text-text-muted font-800">{typeLabel(board.type)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="text-sm font-900 text-text">Type</div>
      <div className="text-sm text-text-muted">{typeLabel(board.type)}</div>
    </div>
  )
}
