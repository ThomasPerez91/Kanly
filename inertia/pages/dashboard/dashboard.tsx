import type { JSX, FC } from 'react'

import { AppLayout } from '~/layouts/app_layout/app_layout'
import { Skeleton } from '~/components/ui/skeleton/skeleton'

type DashboardPageProps = {
  // plus tard: activeWorkspace, recentBoards, recentViews, activityFeed...
}

type PageWithLayout = FC<DashboardPageProps> & {
  layout: (page: any) => JSX.Element
}

const DashboardPage: FC<DashboardPageProps> = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="h2">Dashboard</h1>
        <p className="muted">
          Select a workspace on the left to see boards, views and recent activity.
        </p>
      </div>

      {/* Sections (placeholders for now) */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Active boards */}
        <section className="card p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-900 text-text">Active boards</h2>
            <span className="text-xs font-800 text-text-muted">Soon</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">Project Alpha</div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-18 rounded-lg" label="Tag" />
                <Skeleton className="h-4 w-14 rounded-lg" label="Tag" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-9 w-full rounded-xl" label="Button" />
              </div>
            </div>

            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">Sprint Q1</div>
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-4 w-20 rounded-lg" label="Tag" />
                <Skeleton className="h-4 w-10 rounded-lg" label="Tag" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-9 w-full rounded-xl" label="Button" />
              </div>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <section className="card p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-900 text-text">Recent activity</h2>
            <span className="text-xs font-800 text-text-muted">Soon</span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" label="Avatar" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" label="Line" />
                <Skeleton className="h-3 w-28 rounded-lg" label="Line" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" label="Avatar" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" label="Line" />
                <Skeleton className="h-3 w-24 rounded-lg" label="Line" />
              </div>
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" label="Avatar" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" label="Line" />
                <Skeleton className="h-3 w-32 rounded-lg" label="Line" />
              </div>
            </div>
          </div>
        </section>

        {/* Views */}
        <section className="card p-4 sm:p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-900 text-text">Views</h2>
            <span className="text-xs font-800 text-text-muted">Soon</span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">Frontend (Kanban)</div>
              <div className="mt-2">
                <Skeleton className="h-4 w-40 rounded-lg" label="Line" />
              </div>
            </div>

            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">All tasks (Table)</div>
              <div className="mt-2">
                <Skeleton className="h-4 w-44 rounded-lg" label="Line" />
              </div>
            </div>

            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">Roadmap</div>
              <div className="mt-2">
                <Skeleton className="h-4 w-36 rounded-lg" label="Line" />
              </div>
            </div>

            <div className="border border-border rounded-xl p-3 bg-bg/40">
              <div className="text-sm font-900 text-text">My tasks</div>
              <div className="mt-2">
                <Skeleton className="h-4 w-32 rounded-lg" label="Line" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

;(DashboardPage as PageWithLayout).layout = (page: any) => (
  <AppLayout title="Dashboard">{page}</AppLayout>
)

export default DashboardPage as PageWithLayout
