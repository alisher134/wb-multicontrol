import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OrderStatusBadge } from '@/components/order-status-badge'
import { Show } from '@/components/ui/show'
import type { OrderDetails, OrderDetailsItem, SellerAccount } from '@/lib/api'
import { formatCurrencyRub, formatDateTime } from '@/lib/format'

type OrderDetailsContentProps = {
  order: OrderDetails
  seller: SellerAccount | undefined
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function OrderItemRow({ item }: { item: OrderDetailsItem }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-3 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-start">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <img
          src={item.photoUrl}
          alt=""
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-medium">{item.productName}</span>
          <span className="text-xs text-muted-foreground">{item.article}</span>
          <span className="font-mono text-xs break-all text-muted-foreground">
            Артикул WB {item.nmId} · Баркод {item.sku}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
        <span className="text-sm tabular-nums">×{item.quantity}</span>
        <span className="text-sm font-medium tabular-nums">
          {formatCurrencyRub(item.amount)}
        </span>
      </div>
    </div>
  )
}

export function OrderDetailsContent({
  order,
  seller,
}: OrderDetailsContentProps) {
  const sellerLabel = seller?.name ?? order.accountId
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">
              Заказ WB {order.wbOrderId}
            </CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <CardDescription>
            {formatDateTime(order.createdAt)} · {order.items.length}{' '}
            {order.items.length === 1 ? 'позиция' : 'позиции'} · всего ×
            {totalQuantity}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DetailRow label="ИП" value={sellerLabel} />
          <DetailRow label="Сумма" value={formatCurrencyRub(order.amount)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Товары</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Логистика</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <DetailRow label="Схема" value={order.deliveryType.toUpperCase()} />
            <DetailRow label="Склад" value={order.warehouseName} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Статусы WB</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                Статус продавца
              </span>
              <Badge variant="outline">{order.supplierStatus}</Badge>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Статус WB</span>
              <Badge variant="secondary">{order.wbStatus}</Badge>
            </div>
            <DetailRow label="orderUid" value={order.orderUid} />
          </CardContent>
        </Card>
      </div>

      <Show when={order.buyerComment != null} data={order.buyerComment}>
        {(buyerComment) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Комментарий покупателя
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{buyerComment}</p>
            </CardContent>
          </Card>
        )}
      </Show>
    </div>
  )
}
