import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

import type { AppLayoutProps } from './app_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { AppNavbar } from '~/components/app_navbar/app_navbar'
import { WorkspaceSwitcherAside } from '~/components/workspace/workspace_switcher/workspace_switcher_aside'
import { Drawer } from '~/components/ui/drawer/drawer'
import { WorkspaceCreateModal } from '~/components/workspace/workspace_create_modal/workspace_create_modal'

import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { logoutAction } from '~/actions/auth/logout'

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

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  const onWorkspaceClick = (workspaceId: number) => {
    router.visit(`/dashboard?workspace=${workspaceId}`, {
      preserveScroll: true,
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
      {/* Aside desktop */}
      <WorkspaceSwitcherAside
        className="hidden sm:flex"
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onWorkspaceClick={onWorkspaceClick}
        onCreateClick={() => setIsCreateWorkspaceOpen(true)}
      />

      {/* Drawer mobile */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Workspaces">
        <WorkspaceSwitcherAside
          inDrawer
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspaceId}
          onWorkspaceClick={(id) => {
            setDrawerOpen(false)
            onWorkspaceClick(id)
          }}
          onCreateClick={() => {
            setDrawerOpen(false)
            setIsCreateWorkspaceOpen(true)
          }}
        />
      </Drawer>

      {/* ✅ CREATE WORKSPACE MODAL (MANQUANTE AVANT) */}
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

      {/* Main content */}
      <div className="sm:pl-16">
        <div className="page px-3 sm:px-6 py-4 sm:py-6">{children}</div>
      </div>
    </BaseLayout>
  )
}
