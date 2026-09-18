import { OrderStatusBadge } from '@/components/order-status-badge'
import { Badge } from '@/components/ui/badge'
import { Show } from '@/components/ui/show'
import type { Order, OrderItem } from '@/lib/api'
import { formatCurrencyRub, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

import { getOrderItemsCount, getPositionsLabel } from './order-list-utils'

const VISIBLE_THUMBNAILS = 3

export function OrderItemsThumbnails({ items }: { items: OrderItem[] }) {
  const visibleItems = items.slice(0, VISIBLE_THUMBNAILS)
  const overflowCount = items.length - visibleItems.length

  return (
    <div className="flex shrink-0 items-center">
      {visibleItems.map((item, index) => (
        <img
          key={item.id}
          src={item.photoUrl}
          alt=""
          className={cn(
            'relative size-10 rounded-full object-cover',
            index > 0 && '-ml-2.5',
          )}
          style={{ zIndex: visibleItems.length - index }}
        />
      ))}
      <Show when={overflowCount > 0}>
        <span className="-ml-2.5 flex size-10 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground tabular-nums">
          +{overflowCount}
        </span>
      </Show>
    </div>
  )
}

export function OrderMobileCard({
  order,
  sellerLabel,
  onOpen,
}: {
  order: Order
  sellerLabel: string
  onOpen: () => void
}) {
  const firstItem = order.items[0]

  return (
    <button
      type="button"
      className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors active:bg-muted/50"
      onClick={onOpen}
      aria-label={`Открыть заказ ${order.wbOrderId}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-mono text-xs text-primary">
            {order.wbOrderId}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <Show when={firstItem != null} data={firstItem}>
        {(item) => (
          <div className="flex items-center gap-3">
            <OrderItemsThumbnails items={order.items} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">
                {item.productName}
              </span>
              <span className="text-xs text-muted-foreground">
                <Show
                  when={order.items.length > 1}
                  fallback={
                    <>
                      {item.article} · ×{item.quantity}
                    </>
                  }
                >
                  {getPositionsLabel(order.items.length)} · всего ×
                  {getOrderItemsCount(order)}
                </Show>
              </span>
            </div>
          </div>
        )}
      </Show>

      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary">{sellerLabel}</Badge>
        <span className="text-sm font-medium tabular-nums">
          {formatCurrencyRub(order.amount)}
        </span>
      </div>
    </button>
  )
}
