import { AppForm } from '@/components/ui/app-form'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui/input-field'
import { LoaderGate } from '@/components/ui/loader-gate'
import { PasswordField } from '@/components/ui/password-field'
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/ui/responsive-modal'
import { Spinner } from '@/components/ui/spinner'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { useZodForm } from '@/hooks/use-zod-form'
import { createAdmin } from '@/lib/api'

import {
  createAdminFormSchema,
  type CreateAdminFormValues,
} from './admin-form-schema'

const DEFAULT_VALUES: CreateAdminFormValues = {
  name: '',
  username: '',
  password: '',
}

type AddAdminDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddAdminDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAdminDialogProps) {
  const { isLoading, runMutation } = useAdminMutation(onSuccess)

  const form = useZodForm(createAdminFormSchema, {
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(DEFAULT_VALUES)
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (values: CreateAdminFormValues) => {
    const isSuccess = await runMutation(async () => {
      await createAdmin(values)
    }, 'Админ добавлен')

    if (isSuccess) {
      form.reset(DEFAULT_VALUES)
      onOpenChange(false)
    }
  }

  const isSubmitting = form.formState.isSubmitting || isLoading

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Добавить админа</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Новый пользователь получит роль ADMIN и доступ к мультиконтролю
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <AppForm
          form={form}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {({ register, formState }) => (
            <>
              <InputField
                label="Имя"
                placeholder="Иван Иванов"
                error={formState.errors.name?.message}
                {...register('name')}
              />
              <InputField
                label="Логин"
                placeholder="ivan"
                autoComplete="off"
                error={formState.errors.username?.message}
                {...register('username')}
              />
              <PasswordField
                label="Пароль"
                placeholder="••••••••"
                autoComplete="new-password"
                error={formState.errors.password?.message}
                {...register('password')}
              />
              <ResponsiveModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <LoaderGate isLoading={isSubmitting} loaderSlot={<Spinner />}>
                    Добавить
                  </LoaderGate>
                </Button>
              </ResponsiveModalFooter>
            </>
          )}
        </AppForm>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
