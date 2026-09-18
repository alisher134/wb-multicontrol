import { Badge } from '@/components/ui/badge'
import { Show } from '@/components/ui/show'
import { StockLevelBadge } from '@/components/stock-level-badge'
import type { StockItem } from '@/lib/api'
import { getStockLevel } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

export function StockMobileCard({
  stock,
  sellerLabel,
}: {
  stock: StockItem
  sellerLabel: string
}) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <img
          src={stock.photoUrl}
          alt=""
          className="size-12 shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate font-medium">{stock.productName}</span>
          <span className="text-xs text-muted-foreground">
            Артикул продавца {stock.article}
            <Show when={stock.size != null} data={stock.size}>
              {(size) => <> · Размер {size}</>}
            </Show>
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Артикул WB {stock.nmId}
          </span>
        </div>
        <StockLevelBadge stockLevel={getStockLevel(stock.quantity)} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{sellerLabel}</Badge>
        <span className="text-xs text-muted-foreground">
          {stock.warehouseName}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
          <dt className="text-[0.65rem] text-muted-foreground">На складах</dt>
          <dd className="text-sm font-medium tabular-nums">{stock.quantity}</dd>
        </div>
        <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
          <dt className="text-[0.65rem] text-muted-foreground">К клиенту</dt>
          <dd className="text-sm font-medium tabular-nums">
            {stock.inWayToClient}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
          <dt className="text-[0.65rem] text-muted-foreground">Возвраты</dt>
          <dd className="text-sm font-medium tabular-nums">
            {stock.inWayFromClient}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground">
        Обновлено {formatDateTime(stock.updatedAt)}
      </p>
    </article>
  )
}
