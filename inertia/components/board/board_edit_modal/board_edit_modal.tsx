import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { BoardEditModalProps } from './board_edit_modal_type'
import type { BoardType } from '~/lib/types/board_public'

import { Modal } from '~/components/ui/modal/modal'
import { BoardForm } from '~/components/board/board_form/board_form'
import { BoardPreview } from '~/components/board/board_form/board_preview'
import { BoardBackgroundPickerModal } from '~/components/board/board_background_picker_modal/board_background_picker_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { updateBoardAction } from '~/actions/board/update'

export const BoardEditModal: FC<BoardEditModalProps> = ({ open, onClose, board, onSaved }) => {
  const { csrfToken } = useAuthUser()
  const action = useMemo(() => updateBoardAction(csrfToken), [csrfToken])

  const [name, setName] = useState(board.name)
  const [type, setType] = useState<BoardType>(board.type)
  const [backgroundUrl, setBackgroundUrl] = useState<string>(board.backgroundUrl ?? '')

  const [isPickingBg, setIsPickingBg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setName(board.name)
    setType(board.type)
    setBackgroundUrl(board.backgroundUrl ?? '')
    setError(null)
    setIsSubmitting(false)
    setIsPickingBg(false)
  }, [open, board.id, board.name, board.type, board.backgroundUrl])

  const close = () => {
    setError(null)
    setIsSubmitting(false)
    setIsPickingBg(false)
    onClose()
  }

  const onSubmit = async () => {
    if (isSubmitting) return

    const nextName = name.trim()
    if (!nextName) {
      setError('Please enter a board name')
      return
    }

    const nextBgTrimmed = (backgroundUrl ?? '').toString().trim()
    const nextBg = nextBgTrimmed ? nextBgTrimmed : null

    // Determine changed fields
    const nameChanged = nextName !== board.name
    const typeChanged = type !== board.type
    const bgChanged = (board.backgroundUrl ?? null) !== nextBg

    // Nothing changed => close (no request)
    if (!nameChanged && !typeChanged && !bgChanged) {
      close()
      return
    }

    setIsSubmitting(true)
    setError(null)

    const res = await action({
      id: board.id,
      ...(nameChanged ? { name: nextName } : {}),
      ...(typeChanged ? { type } : {}),
      ...(bgChanged ? { backgroundUrl: nextBg } : {}),
    })

    setIsSubmitting(false)

    if ((res as any).fieldErrors) {
      const fe = (res as any).fieldErrors
      const msg = fe?.name?.[0] ?? fe?.type?.[0] ?? fe?.backgroundUrl?.[0] ?? 'Invalid input'
      setError(msg)
      return
    }

    if ((res as any).error) {
      setError((res as any).error)
      return
    }

    onSaved?.()
    close()
  }

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        title="Edit board"
        description="Update name, type or background."
        widthClassName="max-w-[980px]"
      >
        <div className="board-create-grid">
          <BoardForm
            name={name}
            onNameChange={setName}
            type={type}
            onTypeChange={setType}
            backgroundUrl={backgroundUrl}
            onBackgroundUrlChange={setBackgroundUrl}
            onOpenBackgroundPicker={() => setIsPickingBg(true)}
            error={error}
            submitLabel="Save"
            submitting={isSubmitting}
            onCancel={close}
            onSubmit={onSubmit}
          />

          <BoardPreview name={name} type={type} backgroundUrl={backgroundUrl} />
        </div>
      </Modal>

      <BoardBackgroundPickerModal
        open={isPickingBg}
        onClose={() => setIsPickingBg(false)}
        onPick={(url) => setBackgroundUrl(url)}
      />
    </>
  )
}
