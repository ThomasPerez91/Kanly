import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { router } from '@inertiajs/react'

import type { BoardsSectionProps } from './boards_section_type'
import type { BoardPublic } from '~/lib/types/board_public'

import { Skeleton } from '~/components/ui/skeleton/skeleton'
import { BoardCard } from '~/components/board/board_card/board_card'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { listBoardsAction } from '~/actions/board/list'

export const BoardsSection: FC<BoardsSectionProps> = ({ workspaceId }) => {
  const { csrfToken } = useAuthUser()
  const listAction = useMemo(() => listBoardsAction(csrfToken), [csrfToken])

  const [boards, setBoards] = useState<BoardPublic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      setIsLoading(true)
      setError(null)

      const res = await listAction({ workspaceId })
      if (!isMounted) return

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
    })()

    return () => {
      isMounted = false
    }
  }, [listAction, workspaceId])

  const onOpenBoard = (boardId: number) => {
    router.visit(`/boards/${boardId}`)
  }

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-900 text-text">Boards</h2>
        <span className="text-xs font-800 text-text-muted">Soon</span>
      </div>

      {isLoading ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface">
              <Skeleton className="h-28 w-full rounded-none" label="Board" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-4 rounded-xl border border-border bg-bg/40 p-3">
          <div className="text-sm font-900 text-text">Unable to load boards</div>
          <div className="mt-1 text-sm text-text-muted">{error}</div>
        </div>
      ) : boards.length === 0 ? (
        <div className="mt-4 rounded-xl border border-border bg-bg/40 p-4 text-center">
          <div className="text-sm font-900 text-text">No boards yet</div>
          <div className="mt-1 text-sm text-text-muted">Create your first board to get started.</div>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </div>
      )}
    </section>
  )
}
