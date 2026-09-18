import { useCallback } from 'react'

import { getOrders, type OrdersFilters, type PaginationParams } from '@/lib/api'

import { useInfiniteQuery } from './use-infinite-query'

export function useOrders(filters: OrdersFilters) {
  const accountId = filters.accountId
  const status = filters.status

  const fetcher = useCallback(
    (pagination: PaginationParams) =>
      getOrders({ accountId, status }, pagination),
    [accountId, status],
  )

  return useInfiniteQuery(fetcher, [accountId, status])
}
