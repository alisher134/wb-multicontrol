import { getOrderById } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useOrderDetails(orderId: string, isEnabled = true) {
  return useAsyncQuery(() => getOrderById(orderId), [orderId], {
    enabled: isEnabled && orderId.length > 0,
  })
}
