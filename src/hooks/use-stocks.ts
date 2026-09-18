import { useCallback } from 'react'

import { getStocks, type PaginationParams, type StocksFilters } from '@/lib/api'

import { useInfiniteQuery } from './use-infinite-query'

export function useStocks(filters: StocksFilters) {
  const accountId = filters.accountId
  const fulfillmentType = filters.fulfillmentType
  const stockLevel = filters.stockLevel

  const fetcher = useCallback(
    (pagination: PaginationParams) =>
      getStocks({ accountId, fulfillmentType, stockLevel }, pagination),
    [accountId, fulfillmentType, stockLevel],
  )

  return useInfiniteQuery(fetcher, [accountId, fulfillmentType, stockLevel])
}
