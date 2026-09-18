import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Show } from '@/components/ui/show'
import type { OrderDetails, SellerAccount } from '@/lib/api'
import { formatCurrencyRub, formatDateTime } from '@/lib/format'

import { OrderStatusBadge } from '../orders-page/order-status-badge'

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

export function OrderDetailsContent({
  order,
  seller,
}: OrderDetailsContentProps) {
  const sellerLabel = seller?.name ?? order.accountId

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{order.productName}</CardTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <CardDescription>
            Заказ WB {order.wbOrderId} · {formatDateTime(order.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DetailRow label="ИП" value={sellerLabel} />
          <DetailRow label="Артикул" value={order.article} />
          <DetailRow label="Сумма" value={formatCurrencyRub(order.amount)} />
          <DetailRow label="Количество" value={String(order.quantity)} />
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
            <DetailRow label="SKU" value={order.sku} />
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
            <DetailRow label="nmId" value={String(order.nmId)} />
            <DetailRow label="chrtId" value={String(order.chrtId)} />
          </CardContent>
        </Card>
      </div>

      <Show when={order.buyerComment != null}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Комментарий покупателя</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.buyerComment}</p>
          </CardContent>
        </Card>
      </Show>
    </div>
  )
}
