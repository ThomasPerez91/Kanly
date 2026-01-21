import type { FC } from 'react'
import type { HomeLayoutProps } from './home_layout_type'
import { BaseLayout } from '~/layouts/base_layout/base_layout'
import { Navbar } from '~/components/navbar/navbar'

export const HomeLayout: FC<HomeLayoutProps> = ({ children, title, showNavbar = true }) => {
  return (
    <BaseLayout title={title}>
      {showNavbar ? <Navbar /> : null}

      <div className="container-app">
        <div className="py-8 sm:py-10">{children}</div>
      </div>
    </BaseLayout>
  )
}
