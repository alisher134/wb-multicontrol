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
import { StockLevelBadge } from '@/components/stock-level-badge'
import type { SellerAccount, StockItem } from '@/lib/api'
import { getStockLevel } from '@/lib/api'
import { formatDateTime } from '@/lib/format'

import { StockMobileCard } from './stock-mobile-card'

type StocksTableProps = {
  stocks: StockItem[]
  sellers: SellerAccount[]
}

function getSellerShortName(
  sellers: SellerAccount[],
  accountId: string,
): string {
  const seller = sellers.find((item) => item.id === accountId)
  return seller?.shortName ?? accountId
}

export function StocksTable({ stocks, sellers }: StocksTableProps) {
  return (
    <>
      <div className="flex flex-col gap-2 md:hidden">
        {stocks.map((stock) => (
          <StockMobileCard
            key={stock.id}
            stock={stock}
            sellerLabel={getSellerShortName(sellers, stock.accountId)}
          />
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Товар</TableHead>
              <TableHead>ИП</TableHead>
              <TableHead>Склад</TableHead>
              <TableHead
                className="text-right"
                title="Всего находится на складах"
              >
                На складах
              </TableHead>
              <TableHead className="text-right" title="В пути до получателей">
                До получателей
              </TableHead>
              <TableHead
                className="text-right"
                title="В пути возвраты на склад WB"
              >
                Возвраты на WB
              </TableHead>
              <TableHead>Уровень</TableHead>
              <TableHead>Обновлено</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>
                  <div className="flex max-w-xs items-center gap-3">
                    <img
                      src={stock.photoUrl}
                      alt=""
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{stock.productName}</span>
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
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getSellerShortName(sellers, stock.accountId)}
                  </Badge>
                </TableCell>
                <TableCell>{stock.warehouseName}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {stock.quantity}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {stock.inWayToClient}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {stock.inWayFromClient}
                </TableCell>
                <TableCell>
                  <StockLevelBadge stockLevel={getStockLevel(stock.quantity)} />
                </TableCell>
                <TableCell>{formatDateTime(stock.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
