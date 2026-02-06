import type { FC } from 'react'

import type { WorkspaceBoardsPageProps } from './boards_type'
import { WorkspaceBoardsHeader } from '~/components/workspace_boards/workspace_boards_header'
import { WorkspaceBoardRow } from '~/components/workspace_boards/workspace_board_row'
import { useWorkspaces } from '~/hooks/workspaces/use_workspaces'
import { Head } from '@inertiajs/react'

const BoardsPage: FC<WorkspaceBoardsPageProps> = ({ workspaceId, archived, boards }) => {
  const { workspaces } = useWorkspaces()

  const workspaceName = workspaces.find((w) => w.id === workspaceId)?.name ?? 'Workspace'

  return (
    <>
      <Head title={`${workspaceName} - Boards`} />
      <div className="space-y-4">
        <WorkspaceBoardsHeader
          workspaceId={workspaceId}
          workspaceName={workspaceName}
          archived={archived}
          count={boards.length}
        />

        <div className="space-y-3">
          {boards.map((board) => (
            <WorkspaceBoardRow key={board.id} workspaceId={workspaceId} board={board} />
          ))}

          {boards.length === 0 ? (
            <div className="card p-4 text-sm text-text-muted">
              {archived ? 'No archived boards.' : 'No active boards.'}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default BoardsPage
