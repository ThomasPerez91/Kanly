import type { FC, KeyboardEvent } from 'react'
import { useState } from 'react'

import type { KanbanColumnProps } from './kanban_column_type'

import { Button } from '~/components/ui/button/button'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { updateKanbanListAction } from '~/actions/kanban/lists/update'
import { useAction } from '~/hooks/utils/use_action'

export const KanbanColumn: FC<KanbanColumnProps> = ({ list }) => {
  const { csrfToken } = useAuthUser()
  const action = updateKanbanListAction(csrfToken)

  const [currentName, setCurrentName] = useState(list.name)
  const [draftName, setDraftName] = useState(list.name)
  const [isEditing, setIsEditing] = useState(false)

  const { execute, isLoading } = useAction(action, {
    onSuccess: (data) => {
      setCurrentName(data.list.name)
    },
  })

  const submit = async () => {
    const trimmed = draftName.trim()

    if (!trimmed || trimmed === currentName) {
      setIsEditing(false)
      setDraftName(currentName)
      return
    }

    await execute({
      id: list.id,
      name: trimmed,
    })

    setIsEditing(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()

    if (e.key === 'Escape') {
      setDraftName(currentName)
      setIsEditing(false)
    }
  }

  return (
    <div className="w-64 flex-shrink-0 rounded-xl bg-surface border border-border shadow-soft flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between gap-2">
        {isEditing ? (
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={submit}
            onKeyDown={onKeyDown}
            className="input h-8 text-sm"
            disabled={isLoading}
          />
        ) : (
          <button
            type="button"
            className="text-sm font-900 text-text text-left truncate"
            onClick={() => setIsEditing(true)}
          >
            {currentName}
          </button>
        )}
      </div>

      {/* Cards placeholder */}
      <div className="flex-1 p-2 space-y-2">
        <div className="h-8 bg-bg border border-border rounded-lg opacity-40" />
        <div className="h-7 bg-bg border border-border rounded-lg opacity-30" />
      </div>

      {/* Add card button */}
      <div className="p-2 border-t border-border">
        <Button variant="ghost" size="sm" label="+ Add card" fullWidth disabled />
      </div>
    </div>
  )
}
