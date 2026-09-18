import { useState } from 'react'
import { useNavigate } from 'react-router'

import { InfiniteScrollSentinel } from '@/components/infinite-scroll-sentinel'
import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorPageElement } from '@/components/ui/error-page-element'
import { Show } from '@/components/ui/show'
import { routes } from '@/config/routes'
import { useOrders } from '@/hooks/use-orders'
import { useSellers } from '@/hooks/use-sellers'
import type { OrdersFilters } from '@/lib/api'

import { OrdersFiltersPanel } from './orders-filters-panel'
import { OrdersTable } from './orders-table'

const DEFAULT_FILTERS: OrdersFilters = {
  accountId: 'all',
  status: 'all',
}

export function OrdersPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<OrdersFilters>(DEFAULT_FILTERS)
  const sellersQuery = useSellers()
  const ordersQuery = useOrders(filters)

  const isInitialOrdersLoading =
    ordersQuery.isLoading && ordersQuery.items.length === 0
  const isPageLoading = sellersQuery.isLoading || isInitialOrdersLoading
  const isPageError = sellersQuery.isError || ordersQuery.isError
  const pageErrorMessage = sellersQuery.errorMessage ?? ordersQuery.errorMessage

  const pageData =
    sellersQuery.data != null && !isInitialOrdersLoading
      ? { sellers: sellersQuery.data, orders: ordersQuery.items }
      : undefined

  const handleRetry = () => {
    sellersQuery.refetch()
    ordersQuery.refetch()
  }

  const handleGoHome = () => {
    void navigate(routes.main)
  }

  return (
    <PageShell
      title="Заказы"
      description="Все заказы со всех кабинетов в одном списке"
    >
      <AsyncWrapper
        isLoading={isPageLoading}
        isError={isPageError}
        data={pageData}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorPageElement
            title="Не удалось загрузить заказы"
            description={pageErrorMessage}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <OrdersFiltersPanel
              sellers={data.sellers}
              filters={filters}
              onFiltersChange={setFilters}
            />

            <Show
              when={data.orders.length > 0}
              fallback={
                <EmptyState
                  title="Заказов не найдено"
                  description="Измените фильтры или выберите другой кабинет"
                />
              }
            >
              <div className="flex flex-col">
                <OrdersTable orders={data.orders} sellers={data.sellers} />
                <InfiniteScrollSentinel
                  hasMore={ordersQuery.hasMore}
                  isLoading={ordersQuery.isFetchingNextPage}
                  onLoadMore={ordersQuery.loadMore}
                />
              </div>
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </PageShell>
  )
}
