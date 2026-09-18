import { useState } from 'react'

import { PageShell } from '@/components/page-shell'
import { AsyncWrapper } from '@/components/ui/async-wrapper'
import { CenteredSpinner } from '@/components/ui/centered-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorAlert } from '@/components/ui/error-alert'
import { Show } from '@/components/ui/show'
import type { OrdersFilters } from '@/lib/api'
import { useOrders } from '@/hooks/use-orders'
import { useSellers } from '@/hooks/use-sellers'

import { OrdersFiltersPanel } from './orders-filters'
import { OrdersTable } from './orders-table'

const DEFAULT_FILTERS: OrdersFilters = {
  accountId: 'all',
  status: 'all',
}

export function OrdersPage() {
  const [filters, setFilters] = useState<OrdersFilters>(DEFAULT_FILTERS)
  const sellersQuery = useSellers()
  const ordersQuery = useOrders(filters)

  const isPageLoading = sellersQuery.isLoading || ordersQuery.isLoading
  const isPageError = sellersQuery.isError || ordersQuery.isError
  const pageErrorMessage = sellersQuery.errorMessage ?? ordersQuery.errorMessage

  const pageData =
    sellersQuery.data != null && ordersQuery.data != null
      ? { sellers: sellersQuery.data, orders: ordersQuery.data }
      : undefined

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
          <ErrorAlert
            errorMessage={pageErrorMessage ?? 'Не удалось загрузить заказы'}
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
              <OrdersTable orders={data.orders} sellers={data.sellers} />
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </PageShell>
  )
}
