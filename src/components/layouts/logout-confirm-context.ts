import { createContext } from 'react'

import type { LogoutConfirmApi } from '@/lib/logout-confirm'

export const LogoutConfirmContext = createContext<LogoutConfirmApi | null>(null)
