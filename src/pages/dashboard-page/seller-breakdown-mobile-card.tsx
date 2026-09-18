import { Badge } from '@/components/ui/badge'
import { SellerStatusBadge } from '@/components/seller-status-badge'
import type { SellerDashboardRow } from '@/lib/api'
import {
  formatCompactNumber,
  formatCurrencyRub,
  formatPercent,
} from '@/lib/format'

export function SellerBreakdownMobileCard({
  row,
}: {
  row: SellerDashboardRow
}) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{row.shortName}</Badge>
          <SellerStatusBadge status={row.status} />
        </div>
        <span className="text-xs text-muted-foreground">{row.sellerName}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Заказы</dt>
          <dd className="font-mono tabular-nums">{row.ordersCount}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Продажи</dt>
          <dd className="font-mono tabular-nums">{row.salesCount}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Выручка</dt>
          <dd className="font-mono tabular-nums">
            {formatCurrencyRub(row.revenue)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Ср. чек</dt>
          <dd className="font-mono tabular-nums">
            {formatCurrencyRub(row.averageCheck)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Выкуп</dt>
          <dd className="font-mono tabular-nums">
            {formatPercent(row.buyoutRate)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Остаток</dt>
          <dd className="font-mono tabular-nums">
            {formatCompactNumber(row.stocksUnits)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Отмены</dt>
          <dd className="font-mono tabular-nums">
            {row.cancelsCount} ({formatPercent(row.cancelRate)})
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Возвраты</dt>
          <dd className="font-mono tabular-nums">
            {row.returnsCount} ({formatPercent(row.returnRate)})
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Мало / Нет</dt>
          <dd className="font-mono tabular-nums">
            {row.lowStockCount} / {row.outOfStockCount}
          </dd>
        </div>
      </dl>
    </article>
  )
}
