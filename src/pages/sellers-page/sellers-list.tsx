import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SellerAccount } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { SellerStatusBadge } from '@/components/seller-status-badge'

import { SellerActions } from './seller-actions'
import { SellerMobileCard } from './seller-mobile-card'

type SellersListProps = {
  sellers: SellerAccount[]
  onEdit: (seller: SellerAccount) => void
  onUpdateToken: (seller: SellerAccount) => void
  onDelete: (seller: SellerAccount) => void
}

export function SellersList({
  sellers,
  onEdit,
  onUpdateToken,
  onDelete,
}: SellersListProps) {
  return (
    <>
      <div className="flex flex-col gap-2 md:hidden">
        {sellers.map((seller) => (
          <SellerMobileCard
            key={seller.id}
            seller={seller}
            onEdit={onEdit}
            onUpdateToken={onUpdateToken}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Краткое имя</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Токен</TableHead>
              <TableHead>Синхронизация</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">{seller.name}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs tabular-nums">
                    {seller.shortName}
                  </span>
                </TableCell>
                <TableCell>
                  <SellerStatusBadge status={seller.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {seller.hasToken ? 'Задан' : 'Не задан'}
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">
                  {formatDateTime(seller.lastSyncedAt)}
                </TableCell>
                <TableCell>
                  <SellerActions
                    seller={seller}
                    onEdit={onEdit}
                    onUpdateToken={onUpdateToken}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
