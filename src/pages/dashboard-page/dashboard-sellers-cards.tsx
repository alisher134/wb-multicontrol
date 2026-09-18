import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Show } from '@/components/ui/show'
import {
  getDashboardPeriodLabel,
  type DashboardStats,
  type SellerDashboardRow,
} from '@/lib/api'
import {
  formatCompactNumber,
  formatCurrencyRub,
  formatPercent,
} from '@/lib/format'

import { SellerStatusBadge } from '@/components/seller-status-badge'

type DashboardSellersCardsProps = {
  stats: DashboardStats
  onSelectSeller: (sellerId: string) => void
}

type SellerMetric = {
  label: string
  value: string
}

function buildSellerMetrics(row: SellerDashboardRow): SellerMetric[] {
  return [
    { label: 'Заказы', value: String(row.ordersCount) },
    { label: 'Продажи', value: String(row.salesCount) },
    { label: 'Выручка', value: formatCurrencyRub(row.revenue) },
    { label: 'Выкуп', value: formatPercent(row.buyoutRate) },
    {
      label: 'Отмены',
      value: `${row.cancelsCount} (${formatPercent(row.cancelRate)})`,
    },
    {
      label: 'Возвраты',
      value: `${row.returnsCount} (${formatPercent(row.returnRate)})`,
    },
    {
      label: 'Остаток',
      value: `${formatCompactNumber(row.stocksUnits)} · FBO ${formatCompactNumber(row.fboUnits)} / FBS ${formatCompactNumber(row.fbsUnits)}`,
    },
    {
      label: 'Риски остатков',
      value: `мало ${row.lowStockCount} · нет ${row.outOfStockCount}`,
    },
  ]
}

export function DashboardSellersCards({
  stats,
  onSelectSeller,
}: DashboardSellersCardsProps) {
  const periodLabel = getDashboardPeriodLabel(stats.period)

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Карточки ИП</h2>
        <p className="text-xs text-muted-foreground">
          Нажмите карточку, чтобы отфильтровать дашборд · {periodLabel}
        </p>
      </div>

      <Show
        when={stats.bySeller.length > 0}
        fallback={<EmptyState title="Нет кабинетов для отображения" />}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stats.bySeller.map((row) => (
            <button
              key={row.sellerId}
              type="button"
              className="text-left transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => onSelectSeller(row.sellerId)}
            >
              <Card className="h-full">
                <CardHeader className="gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{row.shortName}</Badge>
                    <SellerStatusBadge status={row.status} />
                  </div>
                  <CardTitle className="text-sm">{row.sellerName}</CardTitle>
                  <CardDescription>
                    Ср. чек {formatCurrencyRub(row.averageCheck)} · в пути{' '}
                    {row.inWayToClient + row.inWayFromClient}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {buildSellerMetrics(row).map((metric) => (
                      <div key={metric.label} className="flex flex-col gap-0.5">
                        <dt className="text-[11px] text-muted-foreground">
                          {metric.label}
                        </dt>
                        <dd className="font-mono text-xs tabular-nums">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </Show>
    </section>
  )
}
