import {
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  StoreIcon,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { routes } from '@/config/routes'
import { logoutMockSession } from '@/lib/mock-auth'

const navItems = [
  { to: routes.main, label: 'Дашборд', icon: LayoutDashboardIcon },
  { to: routes.orders, label: 'Заказы', icon: PackageIcon },
  { to: routes.sellers, label: 'ИП', icon: StoreIcon },
]

export function AppSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutMockSession()
    void navigate(routes.login, { replace: true })
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-4 py-5">
        <p className="text-sm font-semibold tracking-tight">Мультиконтроль</p>
        <p className="text-xs text-muted-foreground">Wildberries</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === routes.main}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
              )
            }
          >
            <item.icon className="size-4" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" aria-hidden />
          Выйти
        </Button>
      </div>
    </aside>
  )
}
