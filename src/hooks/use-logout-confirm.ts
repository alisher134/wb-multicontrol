import { useContext } from 'react'

import { LogoutConfirmContext } from '@/components/layouts/logout-confirm-context'
import type { LogoutConfirmApi } from '@/lib/logout-confirm'

export function useLogoutConfirm(): LogoutConfirmApi {
  const context = useContext(LogoutConfirmContext)

  if (context == null) {
    throw new Error(
      'useLogoutConfirm must be used within LogoutConfirmProvider',
    )
  }

  return context
}
