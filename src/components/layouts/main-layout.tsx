import { Navigate, Outlet } from 'react-router'

import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { LogoutConfirmProvider } from './logout-confirm-provider'
import { isMockAuthenticated } from '@/lib/mock-auth'

import { AppMobileHeader } from './app-mobile-header'
import { AppSidebar } from './app-sidebar'
import { AppTabBar } from './app-tabbar'
import { LogoutConfirm } from './logout-confirm'

export function MainLayout() {
  const isAuthenticated = isMockAuthenticated()

  return (
    <Show
      when={isAuthenticated}
      fallback={<Navigate to={routes.login} replace />}
    >
      <LogoutConfirmProvider>
        <div className="flex h-svh bg-background">
          <AppSidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto pb-tabbar md:pb-0">
            <AppMobileHeader />
            <Outlet />
          </div>
          <AppTabBar />
        </div>
        <LogoutConfirm />
      </LogoutConfirmProvider>
    </Show>
  )
}
