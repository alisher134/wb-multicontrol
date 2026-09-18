import { useNavigate } from 'react-router'
import type { KeyboardEvent } from 'react'

import { OrderStatusBadge } from '@/components/order-status-badge'
import { Badge } from '@/components/ui/badge'
import { Show } from '@/components/ui/show'
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

import { OrderItemsThumbnails, OrderMobileCard } from './order-mobile-card'
import { getOrderItemsCount, getPositionsLabel } from './order-list-utils'

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

function OrderProductsCell({ order }: { order: Order }) {
  const firstItem = order.items[0]
  const totalQuantity = getOrderItemsCount(order)
  const hasMultipleItems = order.items.length > 1

  return (
    <Show when={firstItem != null} data={firstItem} fallback={null}>
      {(item) => (
        <div className="flex max-w-sm items-center gap-3">
          <OrderItemsThumbnails items={order.items} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate">{item.productName}</span>
            <span className="text-xs text-muted-foreground">
              <Show
                when={hasMultipleItems}
                fallback={
                  <>
                    {item.article} · ×{item.quantity}
                  </>
                }
              >
                {getPositionsLabel(order.items.length)} · всего ×{totalQuantity}
              </Show>
            </span>
          </div>
        </div>
      )}
    </Show>
  )
}

export function OrdersTable({ orders, sellers }: OrdersTableProps) {
  const navigate = useNavigate()

  const handleOpenOrder = (orderId: string) => {
    void navigate(routes.orderDetails(orderId))
  }

  const handleRowKeyDown = (
    event: KeyboardEvent<HTMLTableRowElement>,
    orderId: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    handleOpenOrder(orderId)
  }

  return (
    <>
      <div className="flex flex-col gap-2 md:hidden">
        {orders.map((order) => (
          <OrderMobileCard
            key={order.id}
            order={order}
            sellerLabel={getSellerShortName(sellers, order.accountId)}
            onOpen={() => handleOpenOrder(order.id)}
          />
        ))}
      </div>

      <div className="hidden md:block">
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
              <TableRow
                key={order.id}
                role="link"
                tabIndex={0}
                aria-label={`Открыть заказ ${order.wbOrderId}`}
                className="cursor-pointer"
                onClick={() => handleOpenOrder(order.id)}
                onKeyDown={(event) => handleRowKeyDown(event, order.id)}
              >
                <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                <TableCell className="font-mono text-xs text-primary">
                  {order.wbOrderId}
                </TableCell>
                <TableCell>
                  <OrderProductsCell order={order} />
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
      </div>
    </>
  )
}
