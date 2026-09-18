import { getSellers } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useSellers() {
  return useAsyncQuery(() => getSellers(), [])
}
