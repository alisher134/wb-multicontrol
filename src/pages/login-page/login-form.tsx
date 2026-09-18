import { useState } from 'react'
import { useNavigate } from 'react-router'

import { AppForm } from '@/components/ui/app-form'
import { Button } from '@/components/ui/button'
import { ErrorGate } from '@/components/ui/error-gate'
import { InputField } from '@/components/ui/input-field'
import { LoaderGate } from '@/components/ui/loader-gate'
import { PasswordField } from '@/components/ui/password-field'
import { Spinner } from '@/components/ui/spinner'
import { routes } from '@/config/routes'
import { useZodForm } from '@/hooks/use-zod-form'
import { loginWithMockCredentials } from '@/lib/mock-auth'

import { LOGIN_FORM_DEFAULT_VALUES, MOCK_LOGIN_DELAY_MS } from './constants'
import { loginFormSchema, type LoginFormValues } from './login-form-schema'

export function LoginForm() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useZodForm(loginFormSchema, {
    defaultValues: LOGIN_FORM_DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  const isSubmitting = form.formState.isSubmitting

  const handleSubmit = async (values: LoginFormValues) => {
    setAuthError(null)

    await new Promise((resolve) => {
      setTimeout(resolve, MOCK_LOGIN_DELAY_MS)
    })

    const result = loginWithMockCredentials(values.username, values.password)

    if (!result.success) {
      setAuthError(result.message)
      return
    }

    void navigate(routes.main, { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center text-2xl font-semibold tracking-tight">
        Вход
      </h1>

      <ErrorGate isError={authError != null} errorMessage={authError ?? ''} />

      <AppForm
        form={form}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {({ register, formState }) => (
          <>
            <InputField
              label="Имя пользователя"
              placeholder="admin"
              autoComplete="username"
              error={formState.errors.username?.message}
              {...register('username')}
            />

            <PasswordField
              label="Пароль"
              placeholder="••••••••"
              autoComplete="current-password"
              error={formState.errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              <LoaderGate isLoading={isSubmitting} loaderSlot={<Spinner />}>
                Войти
              </LoaderGate>
            </Button>
          </>
        )}
      </AppForm>
    </div>
  )
}
