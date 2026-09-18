import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { routes } from '@/config/routes'
import {
  LOGOUT_CONFIRM_COPY,
  type LogoutConfirmApi,
} from '@/lib/logout-confirm'
import { logoutMockSession } from '@/lib/mock-auth'

import { LogoutConfirmContext } from './logout-confirm-context'

export function LogoutConfirmProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const confirm = () => {
    logoutMockSession()
    setIsOpen(false)
    void navigate(routes.login, { replace: true })
  }

  const value: LogoutConfirmApi = {
    isOpen,
    open,
    close,
    setIsOpen,
    confirm,
    copy: LOGOUT_CONFIRM_COPY,
  }

  return (
    <LogoutConfirmContext.Provider value={value}>
      {children}
    </LogoutConfirmContext.Provider>
  )
}
