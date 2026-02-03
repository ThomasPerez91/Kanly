import type { FC } from 'react'
import { useMemo, useState } from 'react'

import type { BoardCreateModalProps } from './board_create_modal_type'
import { BoardBackgroundPickerModal } from '~/components/board/board_background_picker_modal/board_background_picker_modal'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { createBoardAction } from '~/actions/board/create'
import type { BoardType } from '~/lib/types/board_public'

import { Modal } from '~/components/ui/modal/modal'
import { BoardForm } from '~/components/board/board_form/board_form'
import { BoardPreview } from '~/components/board/board_form/board_preview'

export const BoardCreateModal: FC<BoardCreateModalProps> = ({
  open,
  onClose,
  workspaceId,
  onCreated,
}) => {
  const { csrfToken } = useAuthUser()
  const action = useMemo(() => createBoardAction(csrfToken), [csrfToken])

  const [name, setName] = useState('')
  const [type, setType] = useState<BoardType>('kanban')
  const [backgroundUrl, setBackgroundUrl] = useState<string>('')

  const [isPickingBg, setIsPickingBg] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setName('')
    setType('kanban')
    setBackgroundUrl('')
    setError(null)
    setIsSubmitting(false)
    setIsPickingBg(false)
  }

  const close = () => {
    reset()
    onClose()
  }

  const onSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    const res = await action({
      workspaceId,
      name,
      type,
      backgroundUrl: backgroundUrl.trim() ? backgroundUrl.trim() : null,
    })

    setIsSubmitting(false)

    if (res.fieldErrors) {
      const msg =
        (res.fieldErrors as any)?.name?.[0] ??
        (res.fieldErrors as any)?.type?.[0] ??
        (res.fieldErrors as any)?.backgroundUrl?.[0] ??
        'Invalid input'
      setError(msg)
      return
    }

    if (res.error) {
      setError(res.error)
      return
    }

    onCreated?.()
    close()
  }

  return (
    <>
      <Modal
        open={open}
        onClose={close}
        title="Create board"
        description="Set a name, type and background."
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
            submitLabel="Create"
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
