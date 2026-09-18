import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { DashboardStats } from '@/lib/api'
import { formatCurrencyRub } from '@/lib/format'

type DashboardStatsCardsProps = {
  stats: DashboardStats
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Заказы сегодня</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {stats.ordersToday}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Выручка сегодня</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatCurrencyRub(stats.revenueToday)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Возвраты сегодня</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {stats.returnsCount}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Проблемные ИП</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {stats.problemSellersCount}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Истёкший токен или ошибка синхронизации
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
