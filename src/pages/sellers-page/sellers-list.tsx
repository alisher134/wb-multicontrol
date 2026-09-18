import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { SellerAccount } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { SellerStatusBadge } from './seller-status-badge'

type SellersListProps = {
  sellers: SellerAccount[]
}

export function SellersList({ sellers }: SellersListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sellers.map((seller) => (
        <Card key={seller.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">{seller.name}</CardTitle>
                <CardDescription>Кабинет Wildberries</CardDescription>
              </div>
              <Badge variant="outline">{seller.shortName}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Статус</span>
              <SellerStatusBadge status={seller.status} />
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                Последняя синхронизация
              </span>
              <span className="tabular-nums">
                {formatDateTime(seller.lastSyncedAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
