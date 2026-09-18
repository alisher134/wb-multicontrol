import { getOrders, type OrdersFilters } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useOrders(filters: OrdersFilters) {
  return useAsyncQuery(
    () => getOrders(filters),
    [filters.accountId, filters.status],
  )
}
