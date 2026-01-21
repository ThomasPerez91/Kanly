import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'

import { LoginForm } from '~/components/auth/auth_forms/login_form/login_form'
import { RegisterForm } from '~/components/auth/auth_forms/register_form/register_form'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'

type Mode = 'login' | 'register'

const normalizeMode = (raw: string | null): Mode => {
  if (raw === 'register') return 'register'
  return 'login'
}

export default function AuthPage() {
  const { isAuthenticated, requireGuest } = useAuthUser()
  const [mode, setMode] = useState<Mode>('login')

  useEffect(() => {
    requireGuest()

    const params = new URLSearchParams(window.location.search)
    setMode(normalizeMode(params.get('mode')))
  }, [requireGuest])

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      setMode(normalizeMode(params.get('mode')))
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // If authenticated, requireGuest will redirect in effect
  // render nothing to avoid flashing auth page
  if (isAuthenticated) return <div className="page" />

  return (
    <div className="page">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-6">
          <Link
            href="/auth?mode=login"
            preserveScroll
            className={[
              'text-sm font-700 transition',
              mode === 'login' ? 'text-text' : 'text-text-muted hover:text-text',
            ].join(' ')}
            onClick={() => setMode('login')}
          >
            Login
          </Link>

          <Link
            href="/auth?mode=register"
            preserveScroll
            className={[
              'text-sm font-700 transition',
              mode === 'register' ? 'text-text' : 'text-text-muted hover:text-text',
            ].join(' ')}
            onClick={() => setMode('register')}
          >
            Register
          </Link>
        </div>

        {mode === 'login' ? <LoginForm /> : <RegisterForm />}

        <p className="muted mt-4 text-center">
          {mode === 'login' ? (
            <>
              No account yet?{' '}
              <Link href="/auth?mode=register" className="text-brand-600 font-700">
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/auth?mode=login" className="text-brand-600 font-700">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
