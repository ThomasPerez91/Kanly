import type { FC } from 'react'
import { Head } from '@inertiajs/react'
import type { BaseLayoutProps } from './base_layout_type'

export const BaseLayout: FC<BaseLayoutProps> = ({ children, title }) => {
  return (
    <div className="app-shell">
      <Head title={title ?? 'Kanly'} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>

      <main id="main" className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
