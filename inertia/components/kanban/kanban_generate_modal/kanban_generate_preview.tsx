import type { FC } from 'react'
import type { BoardPublic } from '~/lib/types/board_public'

type Props = {
  mode: 'default' | 'custom'
  board: BoardPublic
  listNames: string[]
}

const defaultLists = ['To Do', 'Ready', 'In Progress', 'Review', 'Done', 'Blocked']

export const KanbanGeneratePreview: FC<Props> = ({ mode, board, listNames }) => {
  const lists = mode === 'default' ? defaultLists : listNames.filter((n) => n.length > 0)

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-soft">
      <div
        className="relative h-72"
        style={{
          backgroundImage: board.backgroundUrl ? `url(${board.backgroundUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        <div className="relative flex gap-5 p-5 overflow-x-auto no-scrollbar">
          {lists.map((name, i) => (
            <div
              key={i}
              className="w-56 flex-shrink-0 bg-surface border border-border rounded-xl shadow-soft"
            >
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-900 text-text truncate">{name}</div>
              </div>

              <div className="p-3 space-y-3">
                <div className="h-8 bg-bg border border-border rounded-lg" />
                <div className="h-7 bg-bg border border-border rounded-lg opacity-70" />
                <div className="h-6 bg-bg border border-border rounded-lg opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
