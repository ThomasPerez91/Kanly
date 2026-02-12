import type { FC } from 'react'
import { useState } from 'react'
import { router } from '@inertiajs/react'

import type { KanbanGenerateModalProps } from './kanban_generate_modal_type'

import { Modal } from '~/components/ui/modal/modal'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { useAction } from '~/hooks/utils/use_action'
import { generateKanbanListsAction } from '~/actions/kanban/lists/generate'

import { KanbanGenerateForm } from './kanban_generate_form'
import { KanbanGeneratePreview } from './kanban_generate_preview'

type Mode = 'default' | 'custom'

export const KanbanGenerateModal: FC<KanbanGenerateModalProps> = ({
  open,
  boardId,
  board,
  onClose,
}) => {
  const { csrfToken } = useAuthUser()
  const action = generateKanbanListsAction(csrfToken)

  const [mode, setMode] = useState<Mode>('default')
  const [listNames, setListNames] = useState<string[]>([''])

  const { execute, isLoading, error } = useAction(action, {
    onSuccess: () => {
      router.reload({ preserveUrl: true })
    },
  })

  const trimmed = listNames.map((n) => n.trim())
  const validCustom = trimmed.filter((n) => n.length > 0)

  const isValid = mode === 'default' || (mode === 'custom' && validCustom.length > 0)

  const onSubmit = async () => {
    if (!isValid) return

    await execute({
      boardId,
      mode,
      lists: mode === 'custom' ? validCustom.map((name) => ({ name })) : undefined,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate lists"
      description="Choose default or create custom columns."
      widthClassName="max-w-[1100px]"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_480px] items-start">
        <KanbanGenerateForm
          mode={mode}
          onModeChange={setMode}
          listNames={listNames}
          onListNamesChange={setListNames}
          submitting={isLoading}
          error={error ?? null}
          isValid={isValid}
          onCancel={onClose}
          onSubmit={onSubmit}
        />

        <KanbanGeneratePreview mode={mode} board={board} listNames={trimmed} />
      </div>
    </Modal>
  )
}
