import { SellerStatusBadge } from '@/components/seller-status-badge'
import type { SellerAccount } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { SellerActions } from './seller-actions'

type SellerMobileCardProps = {
  seller: SellerAccount
  onEdit: (seller: SellerAccount) => void
  onUpdateToken: (seller: SellerAccount) => void
  onDelete: (seller: SellerAccount) => void
}

export function SellerMobileCard({
  seller,
  onEdit,
  onUpdateToken,
  onDelete,
}: SellerMobileCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-medium">{seller.name}</span>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {seller.shortName}
          </span>
        </div>
        <SellerStatusBadge status={seller.status} />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Токен</dt>
          <dd>{seller.hasToken ? 'Задан' : 'Не задан'}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs text-muted-foreground">Синхронизация</dt>
          <dd className="font-mono text-xs tabular-nums">
            {formatDateTime(seller.lastSyncedAt)}
          </dd>
        </div>
      </dl>

      <SellerActions
        seller={seller}
        onEdit={onEdit}
        onUpdateToken={onUpdateToken}
        onDelete={onDelete}
        isCompact
      />
    </article>
  )
}
