import type { FC } from 'react'
import type { BoardPublic } from '~/lib/types/board_public'
import { router } from '@inertiajs/react'

import { BoardCard } from '~/components/board/board_card/board_card'
import { BoardStats } from '~/components/workspace_boards/board_stats'
import { BoardActionsMenu } from '~/components/workspace_boards/board_actions_menu'

type Props = {
  workspaceId: number
  board: BoardPublic
}

export const WorkspaceBoardRow: FC<Props> = ({ workspaceId, board }) => {
  const goToBoard = (boardId: number) => {
    router.visit(`/workspaces/${workspaceId}/views?board=${boardId}`)
  }

  return (
    <>
      {/* DESKTOP: row full-width + card IDENTIQUE dashboard (no shrink) */}
      <div className="hidden md:flex items-center gap-6 card px-4 py-3">
        <div className="shrink-0">
          <BoardCard board={board} onClick={goToBoard} />
        </div>

        <div className="min-w-0 flex-1">
          <BoardStats board={board} variant="desktop" />
        </div>

        <div className="shrink-0">
          <BoardActionsMenu workspaceId={workspaceId} board={board} variant="desktop" />
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden card overflow-hidden">
        <div className="p-0">
          <BoardCard
            board={board}
            onClick={goToBoard}
            fullWidth
            className="rounded-none border-0"
          />
        </div>

        <div className="p-3">
          <BoardStats board={board} variant="mobile" />
        </div>

        <div className="border-t border-border p-3">
          <BoardActionsMenu workspaceId={workspaceId} board={board} variant="mobile" />
        </div>
      </div>
    </>
  )
}
