import { Navigate, Outlet } from 'react-router'

import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { isMockAuthenticated } from '@/lib/mock-auth'

import { AppSidebar } from './app-sidebar'

export function MainLayout() {
  const isAuthenticated = isMockAuthenticated()

  return (
    <Show
      when={isAuthenticated}
      fallback={<Navigate to={routes.login} replace />}
    >
      <div className="flex min-h-svh bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </Show>
  )
}
