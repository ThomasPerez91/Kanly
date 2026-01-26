import type { FC } from 'react'
import { useMemo, useState } from 'react'

import type { WorkspacePublic } from '~/lib/types/workspace_public'
import { AppLayout } from '~/layouts/app_layout/app_layout'
import { Skeleton } from '~/components/ui/skeleton/skeleton'
import { WorkspaceHeader } from '~/components/workspace/workspace_header/workspace_header'

import { WorkspaceEditModal } from '~/components/workspace/workspace_edit_modal/workspace_edit_modal'
import { ConfirmDeleteModal } from '~/components/ui/modal/confirm_delete_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { deleteWorkspaceAction } from '~/actions/workspace/delete'

type DashboardPageProps = {
  workspaces: WorkspacePublic[]
  activeWorkspaceId: number | null
}

type DashboardPageComponent = FC<DashboardPageProps> & {
  layout: (page: any) => React.ReactNode
}

const DashboardPage: DashboardPageComponent = ({ workspaces, activeWorkspaceId }) => {
  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w.id === activeWorkspaceId) ?? null
  }, [workspaces, activeWorkspaceId])

  const { csrfToken } = useAuthUser()
  const deleteAction = useMemo(() => deleteWorkspaceAction(csrfToken), [csrfToken])

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const onConfirmDelete = async () => {
    if (!activeWorkspace) return
    if (isDeleting) return

    setIsDeleting(true)
    setDeleteError(null)

    const res = await deleteAction({ id: activeWorkspace.id })

    setIsDeleting(false)

    if (res.fieldErrors) {
      // normalement pas de fieldErrors ici, mais on garde safe
      setDeleteError('Invalid request')
      return
    }

    if (res.error) {
      setDeleteError(res.error)
      return
    }

    setIsDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      {activeWorkspace ? (
        <>
          <WorkspaceHeader
            workspace={activeWorkspace}
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => setIsDeleteOpen(true)}
          />

          {/* Modals */}
          <WorkspaceEditModal
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            workspace={activeWorkspace}
          />

          <ConfirmDeleteModal
            open={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false)
              setDeleteError(null)
              setIsDeleting(false)
            }}
            title="Delete workspace"
            description={`Delete "${activeWorkspace.name}"? This action cannot be undone.`}
            confirmLabel="Delete"
            isConfirming={isDeleting}
            error={deleteError}
            onConfirm={onConfirmDelete}
          />
        </>
      ) : (
        <div className="space-y-1">
          <h1 className="h2">Dashboard</h1>
          <p className="muted">Create or select a workspace to get started.</p>
        </div>
      )}

      {!activeWorkspace ? (
        <div className="card p-6 text-center">
          <div className="text-sm font-900">No workspace selected</div>
          <p className="mt-1 text-sm text-text-muted">
            Use the sidebar to select or create a workspace.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <section className="card p-4 sm:p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-900 text-text">Active boards</h2>
              <span className="text-xs font-800 text-text-muted">Soon</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-border rounded-xl p-3 bg-bg/40">
                <Skeleton className="h-4 w-32 rounded-lg" label="Title" />
                <Skeleton className="mt-3 h-9 w-full rounded-xl" label="Button" />
              </div>
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-900 text-text">Recent activity</h2>
              <span className="text-xs font-800 text-text-muted">Soon</span>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

DashboardPage.layout = (page: any) => (
  <AppLayout
    title="Dashboard"
    workspaces={page.props.workspaces}
    activeWorkspaceId={page.props.activeWorkspaceId}
  >
    {page}
  </AppLayout>
)

export default DashboardPage
