import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  SellerAccount,
  StockFulfillmentType,
  StockLevel,
  StocksFilters,
} from '@/lib/api'
import { getStockFulfillmentLabel, getStockLevelLabel } from '@/lib/api'

const ALL_ACCOUNT_VALUE = 'all'
const ALL_FULFILLMENT_VALUE = 'all'
const ALL_STOCK_LEVEL_VALUE = 'all'

const FULFILLMENT_TYPES: StockFulfillmentType[] = ['fbs', 'fbo']

const STOCK_LEVELS: StockLevel[] = ['in_stock', 'low', 'out_of_stock']

function isStockFulfillmentType(value: string): value is StockFulfillmentType {
  return FULFILLMENT_TYPES.includes(value as StockFulfillmentType)
}

function isStockLevel(value: string): value is StockLevel {
  return STOCK_LEVELS.includes(value as StockLevel)
}

type StocksFiltersPanelProps = {
  sellers: SellerAccount[]
  filters: StocksFilters
  onFiltersChange: (filters: StocksFilters) => void
}

export function StocksFiltersPanel({
  sellers,
  filters,
  onFiltersChange,
}: StocksFiltersPanelProps) {
  const handleAccountChange = (value: string | null) => {
    if (value == null) {
      return
    }

    onFiltersChange({
      ...filters,
      accountId: value === ALL_ACCOUNT_VALUE ? 'all' : value,
    })
  }

  const handleFulfillmentChange = (value: string | null) => {
    if (value == null) {
      return
    }

    onFiltersChange({
      ...filters,
      fulfillmentType: isStockFulfillmentType(value) ? value : 'all',
    })
  }

  const handleStockLevelChange = (value: string | null) => {
    if (value == null) {
      return
    }

    onFiltersChange({
      ...filters,
      stockLevel: isStockLevel(value) ? value : 'all',
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
        <Label htmlFor="stocks-account-filter">ИП</Label>
        <Select value={filters.accountId} onValueChange={handleAccountChange}>
          <SelectTrigger
            id="stocks-account-filter"
            className="w-full sm:min-w-48"
          >
            <SelectValue placeholder="Все ИП" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ACCOUNT_VALUE}>Все ИП</SelectItem>
            {sellers.map((seller) => (
              <SelectItem key={seller.id} value={seller.id}>
                {seller.shortName} - {seller.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
        <Label htmlFor="stocks-fulfillment-filter">Схема</Label>
        <Select
          value={filters.fulfillmentType}
          onValueChange={handleFulfillmentChange}
        >
          <SelectTrigger
            id="stocks-fulfillment-filter"
            className="w-full sm:min-w-48"
          >
            <SelectValue placeholder="Все схемы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_FULFILLMENT_VALUE}>Все схемы</SelectItem>
            {FULFILLMENT_TYPES.map((fulfillmentType) => (
              <SelectItem key={fulfillmentType} value={fulfillmentType}>
                {getStockFulfillmentLabel(fulfillmentType)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
        <Label htmlFor="stocks-level-filter">Остаток</Label>
        <Select
          value={filters.stockLevel}
          onValueChange={handleStockLevelChange}
        >
          <SelectTrigger
            id="stocks-level-filter"
            className="w-full sm:min-w-48"
          >
            <SelectValue placeholder="Все уровни" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STOCK_LEVEL_VALUE}>Все уровни</SelectItem>
            {STOCK_LEVELS.map((stockLevel) => (
              <SelectItem key={stockLevel} value={stockLevel}>
                {getStockLevelLabel(stockLevel)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
