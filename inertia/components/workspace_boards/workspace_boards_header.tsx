import type { FC } from 'react'
import { router } from '@inertiajs/react'
import { FiArchive } from 'react-icons/fi'

type Props = {
  workspaceId: number
  archived: boolean
  count?: number
}

export const WorkspaceBoardsHeader: FC<Props> = ({ workspaceId, archived, count }) => {
  const toggle = () => {
    const nextArchived = !archived

    router.visit(`/workspaces/${workspaceId}/boards`, {
      method: 'get',
      data: nextArchived ? { archived: 1 } : {}, // archived absent => active boards
      preserveScroll: true,
      preserveState: false, // on veut refresh complet de la liste
    })
  }

  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <div className="text-xl font-950 text-text">
          {archived ? 'Archived boards' : 'Boards'}
        </div>

        {typeof count === 'number' ? (
          <div className="mt-1 text-sm text-text-muted">{count} board(s)</div>
        ) : null}
      </div>

      <button type="button" className="btn-base btn-sm btn-secondary" onClick={toggle}>
        <FiArchive className="text-base" />
        <span className="btn-label">{archived ? 'Show active' : 'Show archived'}</span>
      </button>
    </div>
  )
}
