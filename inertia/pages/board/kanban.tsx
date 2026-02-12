import type { FC } from 'react'
import { useState } from 'react'
import { usePage, router } from '@inertiajs/react'

import type { BoardPublic } from '~/lib/types/board_public'
import type { BoardListPublic } from '~/lib/types/board_list_public'

import { KanbanBoard } from '~/components/kanban/kanban_board/kanban_board'
import { KanbanGenerateModal } from '~/components/kanban/kanban_generate_modal/kanban_generate_modal'

type PageProps = {
  boardId: number
  board: BoardPublic
  lists: BoardListPublic[]
}

const BoardKanbanPage: FC = () => {
  const { props } = usePage<PageProps>()
  const { boardId, board, lists } = props

  // open par défaut si aucune list
  const [isGenerateOpen, setIsGenerateOpen] = useState(lists.length === 0)

  return (
    <>
      <KanbanBoard board={board} lists={lists} />

      <KanbanGenerateModal
        open={isGenerateOpen}
        boardId={boardId}
        board={board}
        onClose={() => setIsGenerateOpen(false)}
        onGenerated={() => {
          setIsGenerateOpen(false)
          router.reload({ preserveUrl: true })
        }}
      />
    </>
  )
}

export default BoardKanbanPage
