import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { ErrorAlert } from '@/components/ui/error-alert'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'

import { DashboardOrdersTrendChart } from './dashboard-orders-trend-chart'
import { DashboardSellersBreakdown } from './dashboard-sellers-breakdown'
import { DashboardSellersRevenueChart } from './dashboard-sellers-revenue-chart'
import { DashboardStatsCards } from './dashboard-stats-cards'
import { DashboardStatusChart } from './dashboard-status-chart'

export function DashboardPage() {
  const { data, isLoading, isError, errorMessage } = useDashboardStats()

  return (
    <PageShell
      title="Дашборд"
      description="Сводка по всем кабинетам Wildberries за сегодня"
    >
      <AsyncWrapper
        isLoading={isLoading}
        isError={isError}
        data={data}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorAlert
            errorMessage={errorMessage ?? 'Не удалось загрузить дашборд'}
          />
        }
      >
        {(stats) => (
          <div className="flex flex-col gap-6">
            <DashboardStatsCards stats={stats} />
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <DashboardOrdersTrendChart stats={stats} />
              </div>
              <DashboardStatusChart stats={stats} />
            </div>
            <DashboardSellersRevenueChart stats={stats} />
            <DashboardSellersBreakdown stats={stats} />
          </div>
        )}
      </AsyncWrapper>
    </PageShell>
  )
}
