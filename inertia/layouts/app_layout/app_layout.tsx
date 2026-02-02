import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { router, useRemember } from '@inertiajs/react' // ✅ add useRemember

import type { AppLayoutProps } from './app_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { AppNavbar } from '~/components/app_navbar/app_navbar'
import { WorkspaceSwitcherAside } from '~/components/workspace/workspace_switcher/workspace_switcher_aside'
import { WorkspaceNavAside } from '~/components/workspace/workspace_nav/workspace_nav_aside'
import { Drawer } from '~/components/ui/drawer/drawer'
import { WorkspaceCreateModal } from '~/components/workspace/workspace_create_modal/workspace_create_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { logoutAction } from '~/actions/auth/logout'

type NavKey = 'dashboard' | 'boards' | 'views' | 'activity'

export const AppLayout: FC<AppLayoutProps> = ({
  title,
  children,
  workspaces,
  activeWorkspaceId,
}) => {
  const { user, isAuthenticated, csrfToken, requireAuth } = useAuthUser()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // ✅ REMEMBERED state (survit aux visits)
  const [isWorkspaceNavOpen, setIsWorkspaceNavOpen] = useRemember(false, 'ws-nav-open')
  const [navWorkspaceId, setNavWorkspaceId] = useRemember<number | null>(null, 'ws-nav-id')

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  const effectiveWorkspaceId = useMemo(() => {
    return navWorkspaceId ?? activeWorkspaceId ?? null
  }, [navWorkspaceId, activeWorkspaceId])

  const navigateWorkspace = (workspaceId: number, key: NavKey) => {
    router.visit(`/dashboard?workspace=${workspaceId}&section=${key}`, {
      preserveScroll: true,
      preserveState: true, // ✅ keep layout state
    })
  }

  const onWorkspaceClick = (workspaceId: number) => {
    if (activeWorkspaceId && workspaceId === activeWorkspaceId) {
      setNavWorkspaceId(workspaceId)
      setIsWorkspaceNavOpen((v) => !v)
      return
    }

    // ✅ set desired state BEFORE navigation
    setNavWorkspaceId(workspaceId)
    setIsWorkspaceNavOpen(true)

    router.visit(`/dashboard?workspace=${workspaceId}`, {
      preserveScroll: true,
      preserveState: true, // ✅ critical
      // pas besoin de onSuccess maintenant
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

  return (
    <BaseLayout title={title}>
      <WorkspaceSwitcherAside
        className="hidden sm:flex"
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceClick={onWorkspaceClick}
        onCreateClick={() => setIsCreateWorkspaceOpen(true)}
      />

      {effectiveWorkspaceId && (
        <WorkspaceNavAside
          className="hidden sm:flex"
          workspaceId={effectiveWorkspaceId}
          activeKey={null}
          isOpen={isWorkspaceNavOpen}
          onNavigate={(key) => navigateWorkspace(effectiveWorkspaceId, key)}
        />
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Workspaces">
        <div className="relative">
          <WorkspaceSwitcherAside
            inDrawer
            compactInDrawer
            workspaces={workspaces}
            activeWorkspaceId={activeWorkspaceId}
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

          {effectiveWorkspaceId && (
            <WorkspaceNavAside
              variant="drawer"
              className="absolute left-14 top-2"
              workspaceId={effectiveWorkspaceId}
              activeKey={null}
              isOpen={isWorkspaceNavOpen}
              onNavigate={(key) => navigateWorkspace(effectiveWorkspaceId, key)}
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

      <div
        className={`transition-[padding] duration-250 ease-out ${isWorkspaceNavOpen ? 'sm:pl-32' : 'sm:pl-16'}`}
      >
        <div className="page px-3 sm:px-6 py-4 sm:py-6">{children}</div>
      </div>
    </BaseLayout>
  )
}
