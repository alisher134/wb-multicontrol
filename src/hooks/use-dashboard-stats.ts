import { getDashboardStats } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useDashboardStats() {
  return useAsyncQuery(() => getDashboardStats(), [])
}
