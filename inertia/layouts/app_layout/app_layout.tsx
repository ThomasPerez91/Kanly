import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { router, usePage, useRemember } from '@inertiajs/react'

import type { AppLayoutProps } from './app_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { AppNavbar } from '~/components/app_navbar/app_navbar'
import { WorkspaceSwitcherAside } from '~/components/workspace/workspace_switcher/workspace_switcher_aside'
import { WorkspaceNavAside } from '~/components/workspace/workspace_nav/workspace_nav_aside'
import { Drawer } from '~/components/ui/drawer/drawer'
import { WorkspaceCreateModal } from '~/components/workspace/workspace_create_modal/workspace_create_modal'

import { useWorkspaces } from '~/hooks/workspaces/use_workspaces'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { logoutAction } from '~/actions/auth/logout'

type NavKey = 'dashboard' | 'boards' | 'views' | 'activity'

const getActiveKeyFromUrl = (url: string): NavKey => {
  if (url.includes('/workspaces/') && url.includes('/boards')) return 'boards'
  if (url.includes('/workspaces/') && url.includes('/views')) return 'views'
  if (url.includes('/workspaces/') && url.includes('/activity')) return 'activity'
  return 'dashboard'
}

const getWorkspaceIdFromUrl = (url: string): number | null => {
  const m = url.match(/\/workspaces\/(\d+)(\/|$)/)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) ? n : null
}

export const AppLayout: FC<AppLayoutProps> = ({ title, children }) => {
  const { user, isAuthenticated, csrfToken, requireAuth } = useAuthUser()
  const { workspaces, activeWorkspaceId } = useWorkspaces()
  const { url } = usePage()

  // ✅ Prevent SSR->client clipping: disable transitions until mounted
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ IMPORTANT: defaultOpen = true reduces SSR "closed then open" flash
  const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useRemember(true, 'ws-nav-open')
  const [navWorkspaceId, setNavWorkspaceId] = useRemember<number | null>(null, 'ws-nav-id')

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  const urlWorkspaceId = useMemo(() => getWorkspaceIdFromUrl(url), [url])
  const activeKey = useMemo(() => getActiveKeyFromUrl(url), [url])

  /**
   * ✅ Stable workspace id for the layout:
   * - On workspace pages, URL id is the truth.
   * - On dashboard, use remembered navWorkspaceId, else backend activeWorkspaceId.
   */
  const resolvedWorkspaceId = useMemo(() => {
    return urlWorkspaceId ?? navWorkspaceId ?? activeWorkspaceId ?? null
  }, [urlWorkspaceId, navWorkspaceId, activeWorkspaceId])

  /**
   * ✅ Keep navWorkspaceId aligned with the page we are viewing.
   * This does NOT touch open/close state (no more auto toggles).
   */
  useEffect(() => {
    if (!urlWorkspaceId) return
    if (navWorkspaceId !== urlWorkspaceId) setNavWorkspaceId(urlWorkspaceId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlWorkspaceId])

  /**
   * Navigation inside a workspace.
   * ✅ NEVER closes the workspace nav.
   * ✅ NEVER triggers open/close by side-effects.
   */
  const navigateWorkspace = (workspaceId: number, key: NavKey) => {
    // keep the "current workspace" consistent across pages (dashboard included)
    setNavWorkspaceId(workspaceId)

    // keep it open if it's already open, and if user wants it open we keep it open
    // (we do NOT force toggle / auto-close here)
    // If you want to force open on any navigation, uncomment next line:
    // setIsWorkspaceNavOpen(true)

    if (key === 'dashboard') {
      router.visit(`/dashboard?workspace=${workspaceId}`, {
        preserveScroll: true,
        preserveState: true,
      })
      return
    }

    router.visit(`/workspaces/${workspaceId}/${key}`, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  /**
   * Workspace switcher click.
   * - Clicking ACTIVE workspace => toggle open/close (ONLY case where it closes)
   * - Clicking another workspace => select + open (no surprise closes)
   */
  const onWorkspaceClick = (workspaceId: number) => {
    const current = resolvedWorkspaceId

    if (current && workspaceId === current) {
      setNavWorkspaceId(workspaceId)
      setIsWorkspaceNavOpen((v) => !v)
      return
    }

    setNavWorkspaceId(workspaceId)
    setIsWorkspaceNavOpen(true)

    router.visit(`/dashboard?workspace=${workspaceId}`, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  const onLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    const res = await logoutAction(csrfToken)
    setIsLoggingOut(false)

    if (!res.ok) {
      console.error(res.error)
      return
    }

    router.visit('/auth?mode=login', { replace: true })
  }

  // ✅ No flash: compute classes without transition until mounted
  const leftPaddingClass = isWorkspaceNavOpen ? 'sm:pl-32' : 'sm:pl-16'

  const transitionClass = hasMounted ? 'transition-[padding] duration-250 ease-out' : '' // no transition during SSR hydration

  return (
    <BaseLayout title={title}>
      <WorkspaceSwitcherAside
        className="hidden sm:flex"
        workspaces={workspaces}
        activeWorkspaceId={resolvedWorkspaceId}
        onWorkspaceClick={onWorkspaceClick}
        onCreateClick={() => setIsCreateWorkspaceOpen(true)}
      />

      {resolvedWorkspaceId && (
        <WorkspaceNavAside
          className="hidden sm:flex"
          workspaceId={resolvedWorkspaceId}
          activeKey={activeKey}
          isOpen={isWorkspaceNavOpen}
          onNavigate={(key: string) => navigateWorkspace(resolvedWorkspaceId, key as NavKey)}
          disableAnimation={!hasMounted}
        />
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Workspaces">
        <div className="relative">
          <WorkspaceSwitcherAside
            inDrawer
            compactInDrawer
            workspaces={workspaces}
            activeWorkspaceId={resolvedWorkspaceId}
            onWorkspaceClick={(id) => onWorkspaceClick(id)}
            onCreateClick={() => setIsCreateWorkspaceOpen(true)}
          />

          <button
            type="button"
            aria-label="Close workspace navigation"
            onClick={() => setIsWorkspaceNavOpen(false)}
            className={[
              'aside-workspace-nav-overlay',
              isWorkspaceNavOpen
                ? 'aside-workspace-nav-overlay-open'
                : 'aside-workspace-nav-overlay-closed',
            ].join(' ')}
          />

          {resolvedWorkspaceId && (
            <WorkspaceNavAside
              variant="drawer"
              className="absolute left-14 top-2"
              workspaceId={resolvedWorkspaceId}
              activeKey={activeKey}
              isOpen={isWorkspaceNavOpen}
              onNavigate={(key: string) => navigateWorkspace(resolvedWorkspaceId, key as NavKey)}
              disableAnimation={!hasMounted}
            />
          )}
        </div>
      </Drawer>

      <WorkspaceCreateModal
        open={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />

      <AppNavbar
        isAuthenticated={isAuthenticated}
        user={user}
        onOpenWorkspaceDrawer={() => setDrawerOpen(true)}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className={`${transitionClass} ${leftPaddingClass}`}>
        <div className="page px-3 sm:px-6 py-4 sm:py-6">{children}</div>
      </div>
    </BaseLayout>
  )
}
