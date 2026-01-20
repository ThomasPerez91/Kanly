import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({

  rootView: 'inertia_layout',

 
  sharedData: {
    auth: async (ctx) => {
      await ctx.auth?.check()
      return {
        user: ctx.auth?.user || null,
        isAuthenticated: ctx.auth?.isAuthenticated || false,
      }
    },
    csrfToken: async (ctx) => ctx.request.csrfToken,
  },

  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
