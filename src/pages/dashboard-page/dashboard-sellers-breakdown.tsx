import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DashboardStats } from '@/lib/api'
import { formatCurrencyRub } from '@/lib/format'

type DashboardSellersBreakdownProps = {
  stats: DashboardStats
}

export function DashboardSellersBreakdown({
  stats,
}: DashboardSellersBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сводка по ИП за сегодня</CardTitle>
        <CardDescription>Заказы и выручка по каждому кабинету</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ИП</TableHead>
              <TableHead className="text-right">Заказы</TableHead>
              <TableHead className="text-right">Выручка</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.bySeller.map((row) => (
              <TableRow key={row.sellerId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{row.shortName}</Badge>
                    <span className="text-muted-foreground">
                      {row.sellerName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {row.ordersCount}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrencyRub(row.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
