import { Navigate } from 'react-router'

import { routes } from '@/config/routes'
import { isMockAuthenticated } from '@/lib/mock-auth'
import { Show } from '@/components/ui/show'

import { LoginForm } from './login-form'

export function LoginPage() {
  const isAuthenticated = isMockAuthenticated()

  return (
    <Show
      when={!isAuthenticated}
      fallback={<Navigate to={routes.main} replace />}
    >
      <LoginForm />
    </Show>
  )
}
