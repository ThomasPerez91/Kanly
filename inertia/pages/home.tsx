import { Head } from '@inertiajs/react'
import { ButtonLink } from '~/components/ui/button_link/button_link'

export default function Home() {
  return (
    <>
      <Head title="Home" />
      <div className="page">
        <section className="flex flex-col gap-6">
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <h1 className="h1">Organize work like Trello, track like Jira</h1>

              <p className="muted">
                Kanly brings boards, lists, cards, and workflow tracking together in one fast app.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href="/auth?mode=register"
                  variant="primary"
                  className="w-full sm:w-auto"
                  label="Create an account"
                />

                <ButtonLink
                  href="/auth?mode=login"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  label="Sign in"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm font-700">Boards & Lists</p>
              <p className="muted mt-1">Kanban structure that stays simple on mobile.</p>
            </div>

            <div className="card p-5">
              <p className="text-sm font-700">Workflow</p>
              <p className="muted mt-1">Statuses, assignments and progress like Jira.</p>
            </div>

            <div className="card p-5">
              <p className="text-sm font-700">Fast & SSR</p>
              <p className="muted mt-1">Server-rendered pages for instant first load.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
