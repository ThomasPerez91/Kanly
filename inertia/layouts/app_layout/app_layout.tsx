import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'

import type { AppLayoutProps } from './app_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { logoutAction } from '~/actions/auth/logout'

import { AppNavbar } from '~/components/app_navbar/app_navbar'
import { WorkspaceSwitcherAside } from '~/components/workspace_switcher/workspace_switcher_aside'
import { Drawer } from '~/components/ui/drawer/drawer'

export const AppLayout: FC<AppLayoutProps> = ({ children, title }) => {
  const { isAuthenticated, user, csrfToken, requireAuth } = useAuthUser()

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isWorkspaceDrawerOpen, setIsWorkspaceDrawerOpen] = useState(false)

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

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

  const onOpenWorkspaceDrawer = () => setIsWorkspaceDrawerOpen(true)
  const onCloseWorkspaceDrawer = () => setIsWorkspaceDrawerOpen(false)

  return (
    <BaseLayout title={title}>
      <div className="min-h-screen">
        {/* Desktop workspace switcher (Discord style) */}
        <WorkspaceSwitcherAside className="hidden sm:flex" />

        {/* Mobile workspace switcher drawer */}
        <Drawer open={isWorkspaceDrawerOpen} onClose={onCloseWorkspaceDrawer} title="Workspaces">
          <WorkspaceSwitcherAside className="flex" inDrawer />
        </Drawer>

        {/* Main shell */}
        <div className="sm:pl-16">
          <AppNavbar
            user={user}
            isAuthenticated={isAuthenticated}
            onOpenWorkspaceDrawer={onOpenWorkspaceDrawer}
            onLogout={onLogout}
            isLoggingOut={isLoggingOut}
          />

          {isAuthenticated ? (
            <div className="page px-3 sm:px-6 py-4 sm:py-6">{children}</div>
          ) : (
            <div className="page" />
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
