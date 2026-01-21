import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { Link, router } from '@inertiajs/react'

import type { AppLayoutProps } from './app_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'
import { Button } from '~/components/ui/button/button'
import { logoutAction } from '~/actions/auth/logout'

export const AppLayout: FC<AppLayoutProps> = ({ children, title }) => {
  const { isAuthenticated, user, csrfToken, requireAuth } = useAuthUser()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  return (
    <BaseLayout title={title}>
      <div className="container-app">
        <div className="py-4 sm:py-6">
          <header className="mb-4 flex items-center justify-between">
            <Link href="/" className="text-sm font-800 tracking-tight">
              Taskify
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-text-muted">{user?.email}</span>

                <Button
                  variant="ghost"
                  size="sm"
                  label="Logout"
                  loading={isLoggingOut}
                  onClick={onLogout}
                  type="button"
                />
              </div>
            ) : null}
          </header>

          {isAuthenticated ? (
            <div className="min-h-[60vh]">{children}</div>
          ) : (
            <div className="min-h-[60vh]" />
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
