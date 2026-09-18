import type { DashboardFilters } from '@/lib/api'
import { getDashboardStats } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useDashboardStats(filters: DashboardFilters) {
  return useAsyncQuery(
    () => getDashboardStats(filters),
    [filters.period, filters.accountId],
  )
}
