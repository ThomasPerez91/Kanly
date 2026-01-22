import type { FC } from 'react'
import { Link } from '@inertiajs/react'
import { FaTasks } from 'react-icons/fa'
import { FiMenu, FiSearch } from 'react-icons/fi'

import type { AppNavbarProps } from './app_navbar_type'
import { UserMenu } from '~/components/user_menu/user_menu'

export const AppNavbar: FC<AppNavbarProps> = ({
  isAuthenticated,
  user,
  onOpenWorkspaceDrawer,
  onLogout,
  isLoggingOut,
  rightSlot,
}) => {
  return (
    <header className="navbar-app">
      <div className="navbar-app-inner">
        {/* Mobile: open workspace drawer */}
        <button
          type="button"
          onClick={onOpenWorkspaceDrawer}
          className="sm:hidden h-10 w-10 rounded-xl border border-border bg-surface flex items-center justify-center hover:bg-bg transition"
          aria-label="Open workspaces"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Brand */}
        <Link href="/dashboard" className="navbar-brand" aria-label="Go to dashboard">
          <FaTasks className="text-brand-600 text-lg" />
          <span className="hidden sm:inline">Kanly</span>
        </Link>

        {/* Search */}
        <div className="navbar-search-wrap">
          <div className="w-full max-w-xl">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="search-input pl-9"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="navbar-actions">
          {rightSlot}

          {isAuthenticated && user ? (
            <UserMenu user={user} onLogout={onLogout} isLoggingOut={Boolean(isLoggingOut)} />
          ) : null}
        </div>
      </div>
    </header>
  )
}
