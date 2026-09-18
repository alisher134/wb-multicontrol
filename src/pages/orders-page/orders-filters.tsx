import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { OrderStatus, OrdersFilters, SellerAccount } from '@/lib/api'
import { getOrderStatusLabel } from '@/lib/api'

const ALL_ACCOUNT_VALUE = 'all'
const ALL_STATUS_VALUE = 'all'

const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'confirm',
  'assemble',
  'deliver',
  'cancel',
  'return',
]

type OrdersFiltersProps = {
  sellers: SellerAccount[]
  filters: OrdersFilters
  onFiltersChange: (filters: OrdersFilters) => void
}

export function OrdersFiltersPanel({
  sellers,
  filters,
  onFiltersChange,
}: OrdersFiltersProps) {
  const handleAccountChange = (value: string) => {
    onFiltersChange({
      ...filters,
      accountId: value === ALL_ACCOUNT_VALUE ? 'all' : value,
    })
  }

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === ALL_STATUS_VALUE ? 'all' : (value as OrderStatus),
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex min-w-[200px] flex-col gap-2">
        <Label htmlFor="orders-account-filter">ИП</Label>
        <Select value={filters.accountId} onValueChange={handleAccountChange}>
          <SelectTrigger id="orders-account-filter" className="w-full min-w-48">
            <SelectValue placeholder="Все ИП" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ACCOUNT_VALUE}>Все ИП</SelectItem>
            {sellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.id}>
                {seller.shortName} — {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex min-w-[200px] flex-col gap-2">
        <Label htmlFor="orders-status-filter">Статус</Label>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="orders-status-filter" className="w-full min-w-48">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUS_VALUE}>Все статусы</SelectItem>
            {ORDER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {getOrderStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
