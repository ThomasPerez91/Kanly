// BoardsSection.tsx
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiSettings } from 'react-icons/fi'
import { router } from '@inertiajs/react'

import type { BoardsSectionProps } from './boards_section_type'
import type { BoardPublic } from '~/lib/types/board_public'

import { Skeleton } from '~/components/ui/skeleton/skeleton'
import { Button } from '~/components/ui/button/button'
import { BoardCard } from '~/components/board/board_card/board_card'
import { BoardCreateModal } from '~/components/board/board_create_modal/board_create_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { listBoardsAction } from '~/actions/board/list'

export const BoardsSection: FC<BoardsSectionProps> = ({ workspaceId }) => {
  const { csrfToken } = useAuthUser()
  const listAction = useMemo(() => listBoardsAction(csrfToken), [csrfToken])

  const [boards, setBoards] = useState<BoardPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const reload = async () => {
    setIsLoading(true)
    setError(null)

    const res = await listAction({ workspaceId })

    if (res.fieldErrors) {
      setError('Invalid request')
      setIsLoading(false)
      return
    }

    if (res.error) {
      setError(res.error)
      setIsLoading(false)
      return
    }

    setBoards(res.data?.boards ?? [])
    setIsLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      await reload()
      if (!isMounted) return
    })()

    return () => {
      isMounted = false
    }
  }, [workspaceId, listAction])

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-900 text-text">Boards</h2>

        <button
          type="button"
          className={[
            'h-9 w-9 rounded-lg inline-flex items-center justify-center',
            'text-text-muted hover:text-text hover:bg-black/5 transition',
            'focus:outline-none focus:(ring-4 ring-brand-500/20)',
          ].join(' ')}
          aria-label="Boards settings"
          onClick={() => router.visit(`/workspaces/${workspaceId}/boards`)}
        >
          <FiSettings className="h-5 w-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4">
          <div className="boards-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="board-card board-card-size">
                <Skeleton className="h-full w-full rounded-none" label="Board" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
          <div className="text-sm font-900 text-text">Unable to load boards</div>
          <div className="mt-1 text-sm text-text-muted">{error}</div>
        </div>
      ) : boards.length === 0 ? (
        <div className="mt-4 rounded-xl border border-border bg-bg/40 p-4 text-center">
          <div className="text-sm font-900 text-text">No boards yet</div>

          <Button
            variant="ghost"
            size="sm"
            label="Create your first board to get started."
            onClick={() => setIsCreateOpen(true)}
            className="mt-2"
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="boards-row">
            {boards.map((b) => (
              // ✅ wrapper pour appliquer hover/ombre sans dépendre du contenu interne
              <div key={b.id} className="board-card board-card-size board-card-hover">
                <BoardCard board={b} onClick={(id) => router.visit(`/boards/${id}/kanban`)} />
              </div>
            ))}

            {/* Add board */}
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="board-add-card group"
              aria-label="Create board"
            >
              <div className="board-add-inner">
                <div className="board-add-icon">
                  <FiPlus className="text-xl" />
                </div>
                <div className="board-add-label">New board</div>
              </div>
            </button>
          </div>
        </div>
      )}

      <BoardCreateModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        workspaceId={workspaceId}
        onCreated={reload}
      />
    </section>
  )
}
