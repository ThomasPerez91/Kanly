import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { router, usePage } from '@inertiajs/react'

import type { WorkspaceCreateModalProps } from './workspace_create_modal_type'
import { Modal } from '~/components/ui/modal/modal'
import { WorkspaceNameInput } from '~/components/workspace/workspace_form/workspace_name_input'
import { Button } from '~/components/ui/button/button'
import { Avatar } from '~/components/ui/avatar/avatar'

type PagePropsWithErrors = {
  errors?: Record<string, string>
}

function getFirstLetter(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return ''
  return trimmed[0]!.toUpperCase()
}

export const WorkspaceCreateModal: FC<WorkspaceCreateModalProps> = ({ open, onClose }) => {
  const page = usePage()
  const errors = (page.props as PagePropsWithErrors).errors ?? {}

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const letter = useMemo(() => getFirstLetter(name), [name])
  const hasAvatar = useMemo(() => avatarUrl.trim().length > 0, [avatarUrl])

  useEffect(() => {
    if (!open) return
    setName('')
    setAvatarUrl('')
    setIsSubmitting(false)
  }, [open])

  const onSubmit = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    router.post(
      '/workspaces',
      { name: name.trim(), avatarUrl: avatarUrl.trim() || null },
      {
        onFinish: () => setIsSubmitting(false),
        onSuccess: () => onClose(),
        preserveScroll: true,
      }
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create workspace"
      description="Choose a name and an optional avatar."
      widthClassName="max-w-xl"
    >
      {/* Preview */}
      <div className="border border-border rounded-xl bg-bg/40 p-3">
        <div className="text-xs font-900 text-text-muted uppercase tracking-wide mb-2">Preview</div>

        <div className="flex items-center gap-3">
          {/* Left preview = aside button */}
          <div className="h-11 w-11 rounded-xl border border-border bg-surface overflow-hidden flex items-center justify-center">
            {hasAvatar ? (
              <Avatar name={name || '—'} src={avatarUrl} size="lg" />
            ) : (
              <span className="text-sm font-900">{letter || '—'}</span>
            )}
          </div>

          {/* Right preview = drawer row */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-900 text-text truncate">
              {name.trim() || 'Workspace name'}
            </div>
            <div className="text-xs text-text-muted truncate">
              {hasAvatar ? 'Avatar enabled' : 'Letter icon'}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mt-4 space-y-4">
        <WorkspaceNameInput value={name} onChange={setName} error={errors.name} />

        <div>
          <label className="label" htmlFor="workspace-avatar">
            Avatar URL (optional)
          </label>
          <input
            id="workspace-avatar"
            className="input"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            autoComplete="off"
          />
          {errors.avatarUrl ? <div className="error">{errors.avatarUrl}</div> : null}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" label="Cancel" type="button" onClick={onClose} />
          <Button
            variant="primary"
            size="sm"
            label="Create"
            type="button"
            loading={isSubmitting}
            disabled={!name.trim()}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  )
}
