import { getAdmins } from '@/lib/api'

import { useAsyncQuery } from './use-async-query'

export function useAdmins() {
  return useAsyncQuery(() => getAdmins(), [])
}
