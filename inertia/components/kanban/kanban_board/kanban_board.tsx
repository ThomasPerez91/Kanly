import type { FC } from 'react'
import type { KanbanBoardProps } from './kanban_board_type'

import { KanbanColumn } from '../kanban_column/kanban_column'

export const KanbanBoard: FC<KanbanBoardProps> = ({
  board,
  lists,
}) => {
  return (
    <div
      className="relative min-h-[calc(100vh-64px)]"
      style={{
        backgroundImage: board.backgroundUrl
          ? `url(${board.backgroundUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

      <div className="relative flex gap-4 p-4 overflow-x-auto no-scrollbar">
        {lists.map((list) => (
          <KanbanColumn key={list.id} list={list} />
        ))}
      </div>
    </div>
  )
}
