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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SellerStatusBadge } from '@/components/seller-status-badge'
import { getDashboardPeriodLabel, type DashboardStats } from '@/lib/api'
import {
  formatCompactNumber,
  formatCurrencyRub,
  formatPercent,
} from '@/lib/format'

import { SellerBreakdownMobileCard } from './seller-breakdown-mobile-card'

type DashboardSellersBreakdownProps = {
  stats: DashboardStats
}

export function DashboardSellersBreakdown({
  stats,
}: DashboardSellersBreakdownProps) {
  const periodLabel = getDashboardPeriodLabel(stats.period)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Статистика по каждому ИП</CardTitle>
        <CardDescription>
          Продажи, качество и остатки · {periodLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Show
          when={stats.bySeller.length > 0}
          fallback={<EmptyState title="Нет кабинетов для отображения" />}
        >
          <>
            <div className="flex flex-col gap-2 md:hidden">
              {stats.bySeller.map((row) => (
                <SellerBreakdownMobileCard key={row.sellerId} row={row} />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ИП</TableHead>
                    <TableHead className="text-right">Заказы</TableHead>
                    <TableHead className="text-right">Продажи</TableHead>
                    <TableHead className="text-right">Выручка</TableHead>
                    <TableHead className="text-right">Ср. чек</TableHead>
                    <TableHead className="text-right">Выкуп</TableHead>
                    <TableHead className="text-right">Отмены</TableHead>
                    <TableHead className="text-right">Возвраты</TableHead>
                    <TableHead className="text-right">Остаток</TableHead>
                    <TableHead className="text-right">Мало / Нет</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.bySeller.map((row) => (
                    <TableRow key={row.sellerId}>
                      <TableCell>
                        <div className="flex min-w-40 flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{row.shortName}</Badge>
                            <SellerStatusBadge status={row.status} />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {row.sellerName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.ordersCount}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.salesCount}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrencyRub(row.revenue)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCurrencyRub(row.averageCheck)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatPercent(row.buyoutRate)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.cancelsCount}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({formatPercent(row.cancelRate)})
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.returnsCount}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({formatPercent(row.returnRate)})
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {formatCompactNumber(row.stocksUnits)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.lowStockCount} / {row.outOfStockCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        </Show>
      </CardContent>
    </Card>
  )
}
