import type { FC } from 'react'
import { usePage } from '@inertiajs/react'

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

  return (
    <>
      <KanbanBoard board={board} lists={lists} />

      {lists.length === 0 && (
        <KanbanGenerateModal
          open
          boardId={boardId}
          board={board}
          onClose={() => {}}
          onGenerated={() => window.location.reload()}
        />
      )}
    </>
  )
}

export default BoardKanbanPage
