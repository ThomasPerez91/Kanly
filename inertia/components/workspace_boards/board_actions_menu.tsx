import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { FiMoreVertical, FiActivity, FiArchive, FiEdit2, FiTrash2 } from 'react-icons/fi'

import type { BoardPublic } from '~/lib/types/board_public'
import { Dropdown } from '~/components/ui/dropdown/dropdown'
import { DropdownItem } from '~/components/ui/dropdown/dropdown_item'
import { ConfirmDeleteModal } from '~/components/ui/modal/confirm_delete_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { updateBoardAction } from '~/actions/board/update'
import { deleteBoardAction } from '~/actions/board/delete'
import { BoardEditModal } from '~/components/board/board_edit_modal/board_edit_modal'

type Props = {
  workspaceId: number
  board: BoardPublic
  variant: 'desktop' | 'mobile'
}

export const BoardActionsMenu: FC<Props> = ({ workspaceId, board, variant }) => {
  const { csrfToken } = useAuthUser()

  const doUpdate = useMemo(() => updateBoardAction(csrfToken), [csrfToken])
  const doDelete = useMemo(() => deleteBoardAction(csrfToken), [csrfToken])

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const showActivities = () => {
    // tu as déjà la page backend
    window.location.href = `/workspaces/${workspaceId}/activity?board=${board.id}`
  }

  const toggleArchive = async () => {
    await doUpdate({ id: board.id, archived: !board.archived })
  }

  const openEdit = () => setIsEditing(true)

  const openDelete = () => {
    setDeleteError(null)
    setIsDeleting(true)
  }

  const confirmDelete = async () => {
    if (isConfirmingDelete) return

    setIsConfirmingDelete(true)
    setDeleteError(null)

    const res = await doDelete({ id: board.id })
    setIsConfirmingDelete(false)

    if ((res as any).error) {
      setDeleteError((res as any).error)
      return
    }

    setIsDeleting(false)
  }

  // MOBILE footer : boutons avec icône + label
  if (variant === 'mobile') {
    return (
      <>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            className="btn-base btn-sm btn-secondary w-full"
            onClick={showActivities}
          >
            <FiActivity className="text-base" />
            <span className="btn-label">Activities</span>
          </button>

          <button
            type="button"
            className="btn-base btn-sm btn-secondary w-full"
            onClick={toggleArchive}
          >
            <FiArchive className="text-base" />
            <span className="btn-label">{board.archived ? 'Restore' : 'Archive'}</span>
          </button>

          <button type="button" className="btn-base btn-sm btn-secondary w-full" onClick={openEdit}>
            <FiEdit2 className="text-base" />
            <span className="btn-label">Edit</span>
          </button>

          <button type="button" className="btn-base btn-sm btn-danger w-full" onClick={openDelete}>
            <FiTrash2 className="text-base" />
            <span className="btn-label">Delete</span>
          </button>
        </div>

        <BoardEditModal
          open={isEditing}
          onClose={() => setIsEditing(false)}
          board={board}
          onSaved={() => setIsEditing(false)}
        />

        <ConfirmDeleteModal
          open={isDeleting}
          onClose={() => setIsDeleting(false)}
          title="Delete board"
          description="This action cannot be undone."
          confirmLabel="Delete"
          isConfirming={isConfirmingDelete}
          error={deleteError ?? undefined}
          onConfirm={confirmDelete}
        />
      </>
    )
  }

  // DESKTOP : icône settings + dropdown
  return (
    <>
      <Dropdown
        placement="bottom-end"
        widthClassName="w-64"
        trigger={
          <span className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-border bg-surface hover:bg-bg transition">
            <FiMoreVertical />
          </span>
        }
      >
        <div className="p-1">
          <DropdownItem
            type="button"
            label="Show activities"
            icon={<FiActivity />}
            onClick={showActivities}
          />

          <DropdownItem
            type="button"
            label={board.archived ? 'Restore' : 'Archive'}
            icon={<FiArchive />}
            onClick={toggleArchive}
          />

          <DropdownItem type="button" label="Edit" icon={<FiEdit2 />} onClick={openEdit} />

          <DropdownItem
            type="button"
            label="Delete"
            icon={<FiTrash2 />}
            className="dropdown-item-danger"
            onClick={openDelete}
          />
        </div>
      </Dropdown>

      <BoardEditModal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        board={board}
        onSaved={() => setIsEditing(false)}
      />

      <ConfirmDeleteModal
        open={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete board"
        description="This action cannot be undone."
        confirmLabel="Delete"
        isConfirming={isConfirmingDelete}
        error={deleteError ?? undefined}
        onConfirm={confirmDelete}
      />
    </>
  )
}
