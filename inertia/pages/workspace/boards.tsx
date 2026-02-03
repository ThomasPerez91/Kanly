import type { FC } from 'react'
import { useMemo, useState } from 'react'

import type { WorkspaceBoardsPageProps } from './boards_type'
import { WorkspaceBoardsHeader } from '~/components/workspace_boards/workspace_boards_header'
import { BoardSearchFilter } from '~/components/workspace_boards/board_search_filter'
import { WorkspaceBoardRow } from '~/components/workspace_boards/workspace_board_row'

const BoardsPage: FC<WorkspaceBoardsPageProps> = ({ workspaceId, boards }) => {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return boards
    return boards.filter((b) => b.name.toLowerCase().includes(q))
  }, [boards, query])

  return (
    <div className="space-y-4">
      <WorkspaceBoardsHeader title="Boards" count={boards.length} />

      <BoardSearchFilter value={query} onChange={setQuery} />

      <div className="space-y-3">
        {filtered.map((board) => (
          <WorkspaceBoardRow key={board.id} workspaceId={workspaceId} board={board} />
        ))}

        {filtered.length === 0 ? (
          <div className="card p-4 text-sm text-text-muted">No boards match your search.</div>
        ) : null}
      </div>
    </div>
  )
}

export default BoardsPage
