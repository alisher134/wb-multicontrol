import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getDashboardPeriodLabel,
  type DashboardFilters,
  type DashboardPeriod,
  type SellerAccount,
} from '@/lib/api'

const ALL_ACCOUNT_VALUE = 'all'

const DASHBOARD_PERIODS: DashboardPeriod[] = ['today', '7d', '30d']

type DashboardFiltersPanelProps = {
  sellers: SellerAccount[]
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export function DashboardFiltersPanel({
  sellers,
  filters,
  onFiltersChange,
}: DashboardFiltersPanelProps) {
  const handlePeriodChange = (period: DashboardPeriod) => {
    onFiltersChange({
      ...filters,
      period,
    })
  }

  const handleAccountChange = (value: string | null) => {
    if (value == null) {
      return
    }

    onFiltersChange({
      ...filters,
      accountId: value === ALL_ACCOUNT_VALUE ? 'all' : value,
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex flex-col gap-2">
        <Label>Период</Label>
        <div className="flex flex-wrap gap-1">
          {DASHBOARD_PERIODS.map((period) => (
            <Button
              key={period}
              type="button"
              size="sm"
              variant={filters.period === period ? 'default' : 'outline'}
              onClick={() => handlePeriodChange(period)}
            >
              {getDashboardPeriodLabel(period)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[200px]">
        <Label htmlFor="dashboard-account-filter">ИП</Label>
        <Select value={filters.accountId} onValueChange={handleAccountChange}>
          <SelectTrigger
            id="dashboard-account-filter"
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
    </div>
  )
}
