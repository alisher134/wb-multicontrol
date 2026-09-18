import { getMockSession, logoutMockSession } from '@/lib/mock-auth'
import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'
import { useNavigate } from 'react-router'
import { Show } from '@/components/ui/show'

export function MainPage() {
  const navigate = useNavigate()
  const session = getMockSession()

  const handleLogout = () => {
    logoutMockSession()
    void navigate(routes.login, { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Мультиконтроль</h1>
      <Show when={session != null} data={session}>
        {(sessionData) => (
          <p className="text-sm text-muted-foreground">
            Вы вошли как {sessionData?.username}
          </p>
        )}
      </Show>
      <Button type="button" variant="outline" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  )
}
