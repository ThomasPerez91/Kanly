import type { FC } from 'react'
import { useMemo } from 'react'

import type { WorkspacePublic } from '~/lib/types/workspace_public'
import { AppLayout } from '~/layouts/app_layout/app_layout'
import { Skeleton } from '~/components/ui/skeleton/skeleton'
import { WorkspaceHeader } from '~/components/workspace/workspace_header/workspace_header'

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

  return (
    <div className="space-y-6">
      {activeWorkspace ? (
        <WorkspaceHeader workspace={activeWorkspace} />
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
