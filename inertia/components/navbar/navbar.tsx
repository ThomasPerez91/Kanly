import type { FC } from 'react'
import { Link } from '@inertiajs/react'
import type { NavbarProps } from './navbar_type'
import { Button } from '~/components/ui/button/button'

import { FaTasks } from 'react-icons/fa'

export const Navbar: FC<NavbarProps> = ({ brand = 'Kanly' }) => {
  return (
    <header className="navbar-home">
      <div className="container-app flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-800 tracking-tight">
          <FaTasks className="text-brand-600 text-lg" />
          <span>{brand}</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/auth?mode=login" className="navbar-link">
            Login
          </Link>

          <Link href="/auth?mode=register" preserveScroll>
            <Button variant="primary" size="sm" label="Get started" type="button" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
