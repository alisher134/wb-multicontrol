import { Navigate, Outlet } from 'react-router'

import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { isMockAuthenticated } from '@/lib/mock-auth'

export function MainLayout() {
  const isAuthenticated = isMockAuthenticated()

  return (
    <Show
      when={isAuthenticated}
      fallback={<Navigate to={routes.login} replace />}
    >
      <Outlet />
    </Show>
  )
}
