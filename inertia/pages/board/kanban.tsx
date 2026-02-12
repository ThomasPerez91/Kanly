import type { FC } from 'react'
import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'

import type { BoardListPublic } from '~/lib/types/board_list_public'
import type { BoardPublic } from '~/lib/types/board_public'

import { KanbanGenerateModal } from '~/components/kanban/kanban_generate_modal/kanban_generate_modal'

type PageProps = {
  boardId: number
  board: BoardPublic
  lists: BoardListPublic[]
}

const BoardKanbanPage: FC = () => {
  const { props } = usePage<PageProps>()
  const { boardId, board, lists } = props

  const [isGenerateOpen, setIsGenerateOpen] = useState(lists.length === 0)

  const refresh = () => {
    router.reload({ only: ['lists'] })
  }

  return (
    <>
      <div className="p-4">
        {lists.length === 0 ? (
          <div className="text-sm text-text-muted">
            No lists yet.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3">
            {lists.map((list) => (
              <div key={list.id} className="min-w-72 card p-3">
                <div className="font-600">{list.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <KanbanGenerateModal
        open={isGenerateOpen}
        boardId={boardId}
        board={board}
        onClose={() => setIsGenerateOpen(false)}
        onGenerated={() => {
          setIsGenerateOpen(false)
          refresh()
        }}
      />
    </>
  )
}

export default BoardKanbanPage
