/// <reference path='../../adonisrc.ts' />
/// <reference path='../../config/inertia.ts' />

import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'
import '../css/app.css'

import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import type { ComponentType, ReactNode } from 'react'

import { HomeLayout } from '~/layouts/home_layout/home_layout'
import { AppLayout } from '~/layouts/app_layout/app_layout'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

type AnyPage = ComponentType<any>

const withDefaultLayout = (name: string, page: ReactNode) => {
  const normalized = name.toLowerCase()

  if (normalized.startsWith('home') || normalized.startsWith('auth')) {
    return <HomeLayout>{page}</HomeLayout>
  }

  return <AppLayout>{page}</AppLayout>
}

createInertiaApp({
  progress: { color: '#5468FF' },
  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const mod = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )

    const Page = ((mod as any)?.default ?? mod) as AnyPage

    const WrappedPage: AnyPage = (props: any) => {
      // optional per-page layout override if you add it later
      // @ts-ignore
      const layout = Page.layout
      if (typeof layout === 'function') return layout(<Page {...props} />)

      return withDefaultLayout(name, <Page {...props} />)
    }

    return WrappedPage
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
