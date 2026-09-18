import { useState, type ComponentType, type ReactNode } from 'react'
import { LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'
import { NavLink } from 'react-router'

import { Button } from '@/components/ui/button'
import { Show } from '@/components/ui/show'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from 'cn'
import { routes } from '@/config/routes'
import { useLogoutConfirm } from '@/hooks/use-logout-confirm'
import { appStorage } from '@/lib/storage'

import { APP_NAV_ITEMS } from './app-nav-items'

const SIDEBAR_COLLAPSED_KEY = 'wb-multicontrol-sidebar-collapsed'

const navLinkBaseClassName =
  'flex items-center gap-2 rounded-md border border-transparent text-sm font-medium transition-colors'

function getStoredCollapsed(): boolean {
  return appStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
}

function getNavLinkClassName(isActive: boolean, isCollapsed: boolean): string {
  const layoutClassName = isCollapsed
    ? 'size-10 justify-center gap-0 p-0'
    : 'px-3 py-2'

  if (isActive) {
    return cn(
      navLinkBaseClassName,
      layoutClassName,
      'border-active bg-active color-active',
    )
  }

  return cn(
    navLinkBaseClassName,
    layoutClassName,
    'text-sidebar-foreground hover:bg-sidebar-accent',
  )
}

function SidebarTooltip({
  label,
  isCollapsed,
  children,
}: {
  label: string
  isCollapsed: boolean
  children: ReactNode
}) {
  return (
    <Show when={isCollapsed} fallback={children}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{children}</span>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </Show>
  )
}

function SidebarNavItem({
  to,
  label,
  icon: Icon,
  isCollapsed,
}: {
  to: string
  label: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  isCollapsed: boolean
}) {
  return (
    <SidebarTooltip label={label} isCollapsed={isCollapsed}>
      <NavLink
        to={to}
        end={to === routes.main}
        className={({ isActive }) => getNavLinkClassName(isActive, isCollapsed)}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        <Show when={!isCollapsed}>
          <span>{label}</span>
        </Show>
      </NavLink>
    </SidebarTooltip>
  )
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(getStoredCollapsed)
  const { open: openLogoutConfirm } = useLogoutConfirm()

  const handleToggleCollapsed = () => {
    setIsCollapsed((current) => {
      const next = !current
      appStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          'sticky top-0 z-40 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] md:flex',
          isCollapsed ? 'w-14' : 'w-48',
        )}
      >
        <div
          className={cn(
            'flex items-center border-b border-sidebar-border p-2',
            isCollapsed ? 'justify-center' : 'justify-end',
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            aria-expanded={!isCollapsed}
            onClick={handleToggleCollapsed}
          >
            <Show
              when={isCollapsed}
              fallback={<PanelLeftCloseIcon className="size-4" aria-hidden />}
            >
              <PanelLeftOpenIcon className="size-4" aria-hidden />
            </Show>
          </Button>
        </div>

        <nav
          className={cn(
            'flex flex-1 flex-col gap-1 p-2',
            isCollapsed && 'items-center',
          )}
        >
          {APP_NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div
          className={cn(
            'flex border-t border-sidebar-border p-2',
            isCollapsed ? 'justify-center' : 'flex-col gap-2',
          )}
        >
          <SidebarTooltip label="Выйти" isCollapsed={isCollapsed}>
            <Button
              type="button"
              variant="outline"
              size={isCollapsed ? 'icon' : 'default'}
              className={cn(!isCollapsed && 'w-full justify-start gap-2')}
              aria-label="Выйти"
              onClick={openLogoutConfirm}
            >
              <LogOutIcon className="size-4" aria-hidden />
              <Show when={!isCollapsed}>Выйти</Show>
            </Button>
          </SidebarTooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
