import { NavLink } from 'react-router'

import { routes } from '@/config/routes'
import { cn } from 'cn'

import { APP_NAV_ITEMS } from './app-nav-items'

function getTabLinkClassName(isActive: boolean): string {
  return cn(
    'flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1.5 text-[0.7rem] font-medium transition-transform active:scale-[0.96]',
    isActive
      ? 'color-active'
      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground',
  )
}

export function AppTabBar() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-top-nav border-t border-sidebar-border bg-sidebar/95 text-sidebar-foreground backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {APP_NAV_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === routes.main}
              className={({ isActive }) => getTabLinkClassName(isActive)}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'size-5 shrink-0',
                      isActive && 'color-active',
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
