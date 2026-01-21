import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import '../css/app.css'

import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import type { ComponentType, ReactNode } from 'react'

import { HomeLayout } from '~/layouts/home_layout/home_layout'
import { AppLayout } from '~/layouts/app_layout/app_layout'

type AnyPage = ComponentType<any>

const withDefaultLayout = (name: string, page: ReactNode) => {
  const normalized = name.toLowerCase()

  if (normalized.startsWith('home') || normalized.startsWith('auth')) {
    return <HomeLayout>{page}</HomeLayout>
  }

  return <AppLayout>{page}</AppLayout>
}

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,

    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      const mod = pages[`../pages/${name}.tsx`] as any

      const Page = ((mod as any)?.default ?? mod) as AnyPage

      const WrappedPage: AnyPage = (props: any) => {
        // @ts-ignore
        const layout = Page.layout
        if (typeof layout === 'function') return layout(<Page {...props} />)

        return withDefaultLayout(name, <Page {...props} />)
      }

      return WrappedPage
    },

    setup: ({ App, props }) => <App {...props} />,
  })
}
