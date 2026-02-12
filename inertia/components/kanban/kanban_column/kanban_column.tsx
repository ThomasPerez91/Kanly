import type { FC, KeyboardEvent } from 'react'
import { useMemo, useState } from 'react'

import type { KanbanColumnProps } from './kanban_column_type'

import { Button } from '~/components/ui/button/button'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { updateKanbanListAction } from '~/actions/kanban/lists/update'

export const KanbanColumn: FC<KanbanColumnProps> = ({
  list,
}) => {
  const { csrfToken } = useAuthUser()
  const action = useMemo(() => updateKanbanListAction(csrfToken), [csrfToken])

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(list.name)
  const [isSaving, setIsSaving] = useState(false)

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed || trimmed === list.name) {
      setIsEditing(false)
      setName(list.name)
      return
    }

    setIsSaving(true)

    const res = await action({
      listId: list.id,
      name: trimmed,
    })

    setIsSaving(false)

    if (!res.error) {
      setIsEditing(false)
    } else {
      setName(list.name)
      setIsEditing(false)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') {
      setName(list.name)
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submit}
            onKeyDown={onKeyDown}
            className="input h-8 text-sm"
            disabled={isSaving}
          />
        ) : (
          <button
            type="button"
            className="text-sm font-900 text-text text-left truncate"
            onClick={() => setIsEditing(true)}
          >
            {list.name}
          </button>
        )}
      </div>

      {/* Cards area (vide pour l'instant) */}
      <div className="flex-1 p-2 space-y-2">
        {/* Placeholder skeleton cards */}
        <div className="h-8 bg-bg border border-border rounded-lg opacity-40" />
        <div className="h-7 bg-bg border border-border rounded-lg opacity-30" />
      </div>

      {/* Add card button (disabled) */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="w-full"
        >
          + Add card
        </Button>
      </div>
    </div>
  )
}
