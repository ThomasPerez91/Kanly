import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

import Workspace from '#models/workspace'

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

    /**
     * ✅ Always provide workspaces for AppLayout (robust: pivot OR owner)
     */
    workspaces: async (ctx) => {
      await ctx.auth?.check()
      const user = ctx.auth?.user
      if (!user) return []

      const workspaces = await Workspace.query()
        .select([
          'workspaces.id',
          'workspaces.name',
          'workspaces.slug',
          'workspaces.avatar_url',
          'workspaces.owner_id',
          'workspaces.created_at',
          'workspaces.updated_at',
        ])
        .leftJoin('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
        .where((q) => {
          q.where('workspaces_users.user_id', user.id).orWhere('workspaces.owner_id', user.id)
        })
        // Needed with leftJoin to avoid duplicates if user has multiple pivot rows (safety)
        .groupBy([
          'workspaces.id',
          'workspaces.name',
          'workspaces.slug',
          'workspaces.avatar_url',
          'workspaces.owner_id',
          'workspaces.created_at',
          'workspaces.updated_at',
        ])
        .orderBy('workspaces.created_at', 'desc')

      return workspaces.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        avatarUrl: w.avatarUrl ?? null,
        ownerId: w.ownerId,
        createdAt: w.createdAt?.toISO?.() ?? null,
        updatedAt: w.updatedAt?.toISO?.() ?? null,
      }))
    },

    activeWorkspaceId: async (ctx) => {
      await ctx.auth?.check()
      const user = ctx.auth?.user
      if (!user) return null

      const toId = (v: unknown): number | null => {
        if (v === undefined || v === null) return null
        const n = Number(v)
        return Number.isFinite(n) ? n : null
      }

      // 1) URL param has priority (workspace pages)
      // ✅ Support multiple possible route param names
      const fromParams =
        toId(ctx.params?.workspaceId) ??
        toId(ctx.params?.id) ??
        toId(ctx.params?.workspace) ??
        toId(ctx.params?.wsId)

      if (fromParams) return fromParams

      // 1b) If params are missing due to route naming, parse URL as fallback
      const url = ctx.request.url()
      const m = url.match(/\/workspaces\/(\d+)(\/|$)/)
      if (m) {
        const n = Number(m[1])
        if (Number.isFinite(n)) return n
      }

      // 2) fallback to query string (dashboard)
      const qsWs = ctx.request.qs()?.workspace
      const fromQs = toId(qsWs)
      if (fromQs) return fromQs

      // 3) fallback to first workspace
      const first = await Workspace.query()
        .select(['workspaces.id'])
        .leftJoin('workspaces_users', 'workspaces_users.workspace_id', 'workspaces.id')
        .where((q) => {
          q.where('workspaces_users.user_id', user.id).orWhere('workspaces.owner_id', user.id)
        })
        .groupBy(['workspaces.id'])
        .orderBy('workspaces.created_at', 'desc')
        .first()

      return first?.id ?? null
    },
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
