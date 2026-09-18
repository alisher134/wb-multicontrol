import {
  BoxesIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShieldIcon,
  StoreIcon,
  type LucideIcon,
} from 'lucide-react'

import { routes } from '@/config/routes'

export type AppNavItem = {
  to: string
  label: string
  icon: LucideIcon
}

export const APP_NAV_ITEMS: AppNavItem[] = [
  { to: routes.main, label: 'Дашборд', icon: LayoutDashboardIcon },
  { to: routes.orders, label: 'Заказы', icon: PackageIcon },
  { to: routes.stocks, label: 'Остатки', icon: BoxesIcon },
  { to: routes.sellers, label: 'ИП', icon: StoreIcon },
  { to: routes.admins, label: 'Админы', icon: ShieldIcon },
]
