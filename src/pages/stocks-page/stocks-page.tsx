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
import { useSellers } from '@/hooks/use-sellers'
import { useStocks } from '@/hooks/use-stocks'
import type { StocksFilters } from '@/lib/api'

import { StocksFiltersPanel } from './stocks-filters-panel'
import { StocksTable } from './stocks-table'

const DEFAULT_FILTERS: StocksFilters = {
  accountId: 'all',
  fulfillmentType: 'all',
  stockLevel: 'all',
}

export function StocksPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<StocksFilters>(DEFAULT_FILTERS)
  const sellersQuery = useSellers()
  const stocksQuery = useStocks(filters)

  const isInitialStocksLoading =
    stocksQuery.isLoading && stocksQuery.items.length === 0
  const isPageLoading = sellersQuery.isLoading || isInitialStocksLoading
  const isPageError = sellersQuery.isError || stocksQuery.isError
  const pageErrorMessage = sellersQuery.errorMessage ?? stocksQuery.errorMessage

  const pageData =
    sellersQuery.data != null && !isInitialStocksLoading
      ? { sellers: sellersQuery.data, stocks: stocksQuery.items }
      : undefined

  const handleRetry = () => {
    sellersQuery.refetch()
    stocksQuery.refetch()
  }

  const handleGoHome = () => {
    void navigate(routes.main)
  }

  return (
    <PageShell
      title="Остатки"
      description="Как в отчёте WB: остатки на складах и товар в пути"
    >
      <AsyncWrapper
        isLoading={isPageLoading}
        isError={isPageError}
        data={pageData}
        loaderSlot={<CenteredSpinner />}
        errorSlot={
          <ErrorPageElement
            title="Не удалось загрузить остатки"
            description={pageErrorMessage}
            onRetry={handleRetry}
            onGoHome={handleGoHome}
          />
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <StocksFiltersPanel
              sellers={data.sellers}
              filters={filters}
              onFiltersChange={setFilters}
            />

            <Show
              when={data.stocks.length > 0}
              fallback={
                <EmptyState
                  title="Остатков не найдено"
                  description="Измените фильтры или выберите другой кабинет"
                />
              }
            >
              <div className="flex flex-col">
                <StocksTable stocks={data.stocks} sellers={data.sellers} />
                <InfiniteScrollSentinel
                  hasMore={stocksQuery.hasMore}
                  isLoading={stocksQuery.isFetchingNextPage}
                  onLoadMore={stocksQuery.loadMore}
                />
              </div>
            </Show>
          </div>
        )}
      </AsyncWrapper>
    </PageShell>
  )
}
