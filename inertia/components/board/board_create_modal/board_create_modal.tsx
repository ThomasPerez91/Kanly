import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { PiKanbanFill } from 'react-icons/pi'
import { HiMiniTableCells } from 'react-icons/hi2'
import { MdViewTimeline } from 'react-icons/md'
import { IoCalendar } from 'react-icons/io5'

import type { BoardCreateModalProps } from './board_create_modal_type'
import { BoardBackgroundPickerModal } from '~/components/board/board_background_picker_modal/board_background_picker_modal'
import { Button } from '~/components/ui/button/button'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { createBoardAction } from '~/actions/board/create'

type BoardType = 'kanban' | 'table' | 'roadmap' | 'calendar'

const typeIcon = (type: BoardType) => {
  if (type === 'kanban') return <PiKanbanFill className="text-2xl" />
  if (type === 'table') return <HiMiniTableCells className="text-2xl" />
  if (type === 'roadmap') return <MdViewTimeline className="text-2xl" />
  if (type === 'calendar') return <IoCalendar className="text-2xl" />
  return <PiKanbanFill className="text-2xl" />
}

const typeLabel = (type: BoardType) => {
  if (type === 'kanban') return 'Kanban'
  if (type === 'table') return 'Table'
  if (type === 'roadmap') return 'Roadmap'
  if (type === 'calendar') return 'Calendar'
  return type
}

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

  if (!open) return null

  const bg = backgroundUrl.trim() ? `url(${backgroundUrl.trim()})` : null
  const previewTitle = name.trim() ? name.trim() : 'Untitled board'

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={close}
      />

      <div className="relative mx-auto mt-10 sm:mt-14 w-[min(92vw,980px)]">
        <div className="modal-shell">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-base font-900 text-text">Create board</div>
              <div className="mt-1 text-sm text-text-muted">Set a name, type and background.</div>
            </div>

            <button
              type="button"
              onClick={close}
              className="h-10 w-10 rounded-xl border border-border bg-surface hover:bg-bg transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="modal-body">
            <div className="board-create-grid">
              {/* left */}
              <div className="min-w-0 space-y-4">
                <div>
                  <label className="label" htmlFor="board-name">
                    Name
                  </label>
                  <input
                    id="board-name"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Product roadmap"
                  />
                </div>

                <div>
                  <div className="label">Type</div>

                  <div className="board-type-grid">
                    {(['kanban', 'table', 'roadmap', 'calendar'] as BoardType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={[
                          'board-type-btn',
                          type === t ? 'board-type-btn-active' : '',
                        ].join(' ')}
                        aria-label={typeLabel(t)}
                      >
                        <span className="board-type-ico">{typeIcon(t)}</span>
                        <span className="board-type-txt">{typeLabel(t)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="board-bg">
                    Background URL
                  </label>

                  <div className="relative">
                    <input
                      id="board-bg"
                      className="input pr-12"
                      value={backgroundUrl}
                      onChange={(e) => setBackgroundUrl(e.target.value)}
                      placeholder="https://..."
                    />

                    <button
                      type="button"
                      onClick={() => setIsPickingBg(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl border border-border bg-surface hover:bg-bg transition flex items-center justify-center"
                      aria-label="Choose a default background"
                    >
                      <FiImage className="text-lg" />
                    </button>
                  </div>

                  <div className="mt-1 text-xs text-text-muted">
                    Use an image URL, or pick a default.
                  </div>
                </div>

                {error ? <div className="text-sm text-danger-600 font-800">{error}</div> : null}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="ghost" size="sm" label="Cancel" onClick={close} />
                  <Button
                    variant="primary"
                    size="sm"
                    label="Create"
                    loading={isSubmitting}
                    onClick={onSubmit}
                  />
                </div>
              </div>

              {/* right preview */}
              <div className="board-preview-col">
                <div className="board-preview-sticky">
                  <div className="text-xs font-900 text-text-muted uppercase tracking-wide">
                    Preview
                  </div>

                  <div className="board-preview mt-2">
                    <div className="board-preview-inner">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={bg ? { backgroundImage: bg } : undefined}
                        aria-hidden="true"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/0"
                        aria-hidden="true"
                      />

                      <div className="relative h-full p-3 flex flex-col justify-end">
                        <div className="text-sm font-900 text-white drop-shadow">
                          {previewTitle}
                        </div>

                        <div className="mt-1 inline-flex items-center gap-2 text-white/90 text-xs font-800">
                          <span className="board-type-badge">{typeIcon(type)}</span>
                          <span className="drop-shadow">{typeLabel(type)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-xs text-text-muted truncate">
                        {backgroundUrl.trim() ? backgroundUrl.trim() : 'No background selected'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end grid */}
            </div>
          </div>
        </div>

        <BoardBackgroundPickerModal
          open={isPickingBg}
          onClose={() => setIsPickingBg(false)}
          onPick={(url) => setBackgroundUrl(url)}
        />
      </div>
    </div>
  )
}
