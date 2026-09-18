import { useState } from 'react'
import { useNavigate } from 'react-router'

import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { ErrorAlert } from '@/components/ui/error-alert'
import { ErrorPageElement } from '@/components/ui/error-page-element'
import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import type { DashboardFilters } from '@/lib/api'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { useSellers } from '@/hooks/use-sellers'

import { DashboardFiltersPanel } from './dashboard-filters-panel'
import { DashboardOrdersTrendChart } from './dashboard-orders-trend-chart'
import { DashboardSellersBreakdown } from './dashboard-sellers-breakdown'
import { DashboardSellersCards } from './dashboard-sellers-cards'
import { DashboardSellersRevenueChart } from './dashboard-sellers-revenue-chart'
import { DashboardStatsCards } from './dashboard-stats-cards'
import { DashboardStatusChart } from './dashboard-status-chart'
import { DashboardStocksCards } from './dashboard-stocks-cards'
import { DashboardStocksChart } from './dashboard-stocks-chart'

const DEFAULT_FILTERS: DashboardFilters = {
  period: 'today',
  accountId: 'all',
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS)
  const sellersQuery = useSellers()
  const { data, isLoading, isError, errorMessage, refetch } =
    useDashboardStats(filters)

  const handleRetry = () => {
    sellersQuery.refetch()
    refetch()
  }

  const handleGoHome = () => {
    void navigate(routes.main)
  }

  const handleSelectSeller = (sellerId: string) => {
    setFilters((current) => ({
      ...current,
      accountId: sellerId,
    }))
  }

  return (
    <PageShell
      title="Дашборд"
      description="Централизованная статистика Wildberries по всем кабинетам: продажи, выкуп, отмены, остатки и логистика"
    >
      <div className="flex flex-col gap-4">
        <Show when={sellersQuery.isError}>
          <ErrorAlert
            errorMessage={
              sellersQuery.errorMessage ?? 'Не удалось загрузить список ИП'
            }
          />
        </Show>

        <DashboardFiltersPanel
          sellers={sellersQuery.data ?? []}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <AsyncWrapper
          isLoading={isLoading}
          isError={isError}
          data={data}
          loaderSlot={<CenteredSpinner />}
          errorSlot={
            <ErrorPageElement
              title="Не удалось загрузить дашборд"
              description={errorMessage}
              onRetry={handleRetry}
              onGoHome={handleGoHome}
            />
          }
        >
          {(stats) => (
            <div className="flex flex-col gap-6">
              <DashboardStatsCards stats={stats} />
              <DashboardStocksCards stats={stats} />

              <div className="grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <DashboardOrdersTrendChart stats={stats} />
                </div>
                <DashboardStatusChart stats={stats} />
              </div>

              <Show when={stats.accountId === 'all'}>
                <DashboardSellersRevenueChart stats={stats} />
              </Show>

              <DashboardStocksChart stats={stats} />
              <DashboardSellersCards
                stats={stats}
                onSelectSeller={handleSelectSeller}
              />
              <DashboardSellersBreakdown stats={stats} />
            </div>
          )}
        </AsyncWrapper>
      </div>
    </PageShell>
  )
}
