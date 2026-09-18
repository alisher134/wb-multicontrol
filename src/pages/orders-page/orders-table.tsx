import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { routes } from '@/config/routes'
import type { Order, SellerAccount } from '@/lib/api'
import { formatCurrencyRub, formatDateTime } from '@/lib/format'

import { OrderStatusBadge } from './order-status-badge'

type OrdersTableProps = {
  orders: Order[]
  sellers: SellerAccount[]
}

function getSellerShortName(
  sellers: SellerAccount[],
  accountId: string,
): string {
  const seller = sellers.find((item) => item.id === accountId)
  return seller?.shortName ?? accountId
}

export function OrdersTable({ orders, sellers }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>WB ID</TableHead>
          <TableHead>Товар</TableHead>
          <TableHead>ИП</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{formatDateTime(order.createdAt)}</TableCell>
            <TableCell>
              <Link
                to={routes.orderDetails(order.id)}
                className="font-mono text-xs text-primary hover:underline"
              >
                {order.wbOrderId}
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex max-w-xs flex-col">
                <Link
                  to={routes.orderDetails(order.id)}
                  className="truncate hover:text-primary hover:underline"
                >
                  {order.productName}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {order.article}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {getSellerShortName(sellers, order.accountId)}
              </Badge>
            </TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCurrencyRub(order.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
