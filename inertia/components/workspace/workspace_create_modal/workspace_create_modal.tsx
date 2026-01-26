import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { WorkspaceCreateModalProps } from './workspace_create_modal_type'
import { Modal } from '~/components/ui/modal/modal'
import { WorkspaceNameInput } from '~/components/workspace/workspace_form/workspace_name_input'
import { Button } from '~/components/ui/button/button'
import { Avatar } from '~/components/ui/avatar/avatar'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { createWorkspaceAction } from '~/actions/workspace/create'

type FieldErrors = {
  name?: string[]
  avatarUrl?: string[]
}

export const WorkspaceCreateModal: FC<WorkspaceCreateModalProps> = ({ open, onClose }) => {
  const { csrfToken } = useAuthUser()
  const action = useMemo(() => createWorkspaceAction(csrfToken), [csrfToken])

  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState<string | null>(null)

  const hasAvatar = useMemo(() => avatarUrl.trim().length > 0, [avatarUrl])

  useEffect(() => {
    if (!open) return
    setName('')
    setAvatarUrl('')
    setIsSubmitting(false)
    setFieldErrors({})
    setError(null)
  }, [open])

  const onSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    setFieldErrors({})
    setError(null)

    const res = await action({
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || null,
    })

    setIsSubmitting(false)

    if (res.fieldErrors) {
      setFieldErrors(res.fieldErrors as any)
      return
    }

    if (res.error) {
      setError(res.error)
      return
    }

    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create workspace"
      description="Choose a name and an optional avatar."
      widthClassName="max-w-4xl"
    >
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {/* Preview (mobile first) */}
        <div className="sm:order-2 sm:pl-4 sm:border-l sm:border-border">
          <div className="sm:sticky sm:top-20">
            <div className="text-xs font-900 text-text-muted uppercase tracking-wide mb-2">
              Preview
            </div>

            <div className="border border-border rounded-xl bg-bg/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl border border-border bg-surface overflow-hidden flex items-center justify-center">
                  <Avatar
                    name={name || '—'}
                    src={hasAvatar ? avatarUrl : null}
                    size="lg"
                    bordered={true}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-900 text-text truncate">
                    {name.trim() || 'Workspace name'}
                  </div>
                  <div className="text-xs text-text-muted truncate">
                    {hasAvatar ? 'Avatar enabled' : 'Letter icon'}
                  </div>
                </div>
              </div>

              <div className="divider my-4" />

              <div className="text-xs text-text-muted">
                This is how the workspace will appear in the sidebar and in mobile drawer lists.
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 sm:order-1 sm:pr-4">
          <WorkspaceNameInput
            value={name}
            onChange={(v) => {
              setName(v)
              if (fieldErrors.name?.length) setFieldErrors((p) => ({ ...p, name: undefined }))
            }}
            error={fieldErrors.name?.[0]}
          />

          <div>
            <label className="label" htmlFor="workspace-avatar">
              Avatar URL (optional)
            </label>
            <input
              id="workspace-avatar"
              className="input"
              value={avatarUrl}
              onChange={(e) => {
                setAvatarUrl(e.target.value)
                if (fieldErrors.avatarUrl?.length)
                  setFieldErrors((p) => ({ ...p, avatarUrl: undefined }))
              }}
              placeholder="https://..."
              autoComplete="off"
            />
            {fieldErrors.avatarUrl?.[0] ? (
              <div className="error">{fieldErrors.avatarUrl[0]}</div>
            ) : null}
          </div>

          {error ? (
            <div className="text-sm text-danger-600 border border-danger-500/20 bg-danger-500/10 rounded-xl p-3">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              label="Cancel"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            />
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
      </div>
    </Modal>
  )
}
