import { getOrderById } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useOrderDetails(orderId: string) {
  return useAsyncQuery(() => getOrderById(orderId), [orderId])
}
