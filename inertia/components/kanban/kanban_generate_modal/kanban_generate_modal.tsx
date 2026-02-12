import type { FC } from 'react'
import { useMemo, useState } from 'react'

import type { KanbanGenerateModalProps } from './kanban_generate_modal_type'

import { Modal } from '~/components/ui/modal/modal'
import { Button } from '~/components/ui/button/button'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { generateKanbanListsAction } from '~/actions/kanban/lists/generate'

import { KanbanGenerateForm } from './kanban_generate_form'
import { KanbanGeneratePreview } from './kanban_generate_preview'

type Mode = 'default' | 'custom'

export const KanbanGenerateModal: FC<KanbanGenerateModalProps> = ({
  open,
  boardId,
  board,
  onClose,
  onGenerated,
}) => {
  const { csrfToken } = useAuthUser()
  const action = useMemo(() => generateKanbanListsAction(csrfToken), [csrfToken])

  const [mode, setMode] = useState<Mode>('default')
  const [listNames, setListNames] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setMode('default')
    setListNames([''])
    setIsSubmitting(false)
    setError(null)
  }

  const close = () => {
    reset()
    onClose()
  }

  const trimmed = listNames.map((n) => n.trim())
  const validCustom = trimmed.filter((n) => n.length > 0)

  const isValid =
    mode === 'default' ||
    (mode === 'custom' && validCustom.length > 0)

  const onSubmit = async () => {
    if (isSubmitting || !isValid) return

    setIsSubmitting(true)
    setError(null)

    const res = await action({
      boardId,
      mode,
      lists:
        mode === 'custom'
          ? validCustom.map((name) => ({ name }))
          : undefined,
    })

    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
      return
    }

    onGenerated?.()
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Generate lists"
      description="Choose default or create custom columns."
      widthClassName="max-w-[980px]"
    >
      <div className="board-create-grid">
        <KanbanGenerateForm
          mode={mode}
          onModeChange={setMode}
          listNames={listNames}
          onListNamesChange={setListNames}
          submitting={isSubmitting}
          error={error}
          isValid={isValid}
          onCancel={close}
          onSubmit={onSubmit}
        />

        <KanbanGeneratePreview
          mode={mode}
          board={board}
          listNames={trimmed}
        />
      </div>
    </Modal>
  )
}
