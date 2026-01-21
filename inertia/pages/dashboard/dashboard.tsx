import { useEffect } from 'react'
import { useAuthUser } from '~/hooks/auth_user/use_auth_user'

export default function Dashboard() {
  const { isAuthenticated, user, requireAuth } = useAuthUser()

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  // Pendant SSR / avant redirect client, éviter de montrer le contenu
  if (!isAuthenticated) return <div className="page" />

  return (
    <div className="page">
      <div className="card p-4 sm:p-6">
        <p className="text-sm font-800">Dashboard</p>
        <p className="muted mt-1">
          Logged in as <span className="font-700">{user?.email}</span>
        </p>
      </div>
    </div>
  )
}
