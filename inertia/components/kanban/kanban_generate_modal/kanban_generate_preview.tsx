import type { FC } from 'react'
import type { BoardPublic } from '~/lib/types/board_public'

type Props = {
  mode: 'default' | 'custom'
  board: BoardPublic
  listNames: string[]
}

const defaultLists = [
  'To Do',
  'Ready',
  'In Progress',
  'Review',
  'Done',
  'Blocked',
]

export const KanbanGeneratePreview: FC<Props> = ({
  mode,
  board,
  listNames,
}) => {
  const lists =
    mode === 'default'
      ? defaultLists
      : listNames.filter((n) => n.length > 0)

  return (
    <div className="board-preview">
      <div
        className="board-preview-inner relative overflow-hidden"
        style={{
          backgroundImage: board.backgroundUrl
            ? `url(${board.backgroundUrl})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay comme vraie page */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

        {/* Scroll horizontal */}
        <div className="relative h-full flex gap-3 p-3 overflow-x-auto no-scrollbar">
          {lists.map((name, i) => (
            <div
              key={i}
              className="
                flex-shrink-0
                w-40 sm:w-48
                rounded-xl
                bg-surface
                border border-border
                shadow-soft
                flex flex-col
              "
            >
              {/* Header colonne */}
              <div className="px-3 py-2 border-b border-border">
                <div className="text-xs sm:text-sm font-900 text-text truncate">
                  {name}
                </div>
              </div>

              {/* Fake cards */}
              <div className="p-2 space-y-2">
                <div className="h-7 rounded-lg bg-bg border border-border" />
                <div className="h-6 rounded-lg bg-bg border border-border opacity-70" />
                <div className="h-5 rounded-lg bg-bg border border-border opacity-50" />
              </div>
            </div>
          ))}

          {/* Si aucune liste custom encore */}
          {lists.length === 0 && (
            <div className="text-white/80 text-sm font-700 self-center px-3">
              Add your first column
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
