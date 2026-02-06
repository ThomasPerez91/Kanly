import type { FC } from 'react'
import { FiArchive } from 'react-icons/fi'
import { router } from '@inertiajs/react'

type Props = {
  workspaceId: number
  workspaceName: string
  archived: boolean
  count: number
}

export const WorkspaceBoardsHeader: FC<Props> = ({
  workspaceId,
  workspaceName,
  archived,
  count,
}) => {
  const label = count < 2 ? 'board' : 'boards'

  const toggleArchived = () => {
    router.visit(`/workspaces/${workspaceId}/boards`, {
      preserveScroll: true,
      preserveState: true,
      data: archived ? {} : { archived: 1 },
    })
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="h2 truncate">{workspaceName} - Boards</h1>
        <div className="mt-1 text-sm text-text-muted">
          {count} {label}
        </div>
      </div>

      <button
        type="button"
        onClick={toggleArchived}
        className="btn-base btn-sm btn-secondary gap-2"
      >
        <FiArchive className="text-lg" />
        {archived ? 'Hide archived' : 'Show archived'}
      </button>
    </div>
  )
}
