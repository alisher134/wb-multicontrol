import { useEffect } from 'react'

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
import { Show } from '@/components/ui/show'
import { Spinner } from '@/components/ui/spinner'
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import { useZodForm } from '@/hooks/use-zod-form'
import type { AdminUser } from '@/lib/api'
import { updateAdmin } from '@/lib/api'

import {
  editAdminFormSchema,
  type EditAdminFormValues,
} from './admin-form-schema'

type EditAdminDialogProps = {
  admin: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditAdminDialog({
  admin,
  open,
  onOpenChange,
  onSuccess,
}: EditAdminDialogProps) {
  const { isLoading, runMutation } = useAdminMutation(onSuccess)

  const form = useZodForm(editAdminFormSchema, {
    defaultValues: { name: '', username: '', password: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (admin == null) {
      return
    }

    form.reset({
      name: admin.name,
      username: admin.username,
      password: '',
    })
  }, [admin, form])

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (values: EditAdminFormValues) => {
    if (admin == null) {
      return
    }

    const isSuccess = await runMutation(async () => {
      await updateAdmin({
        id: admin.id,
        name: values.name,
        username: values.username,
        password: values.password.length > 0 ? values.password : undefined,
      })
    }, 'Админ обновлён')

    if (isSuccess) {
      onOpenChange(false)
    }
  }

  const isSubmitting = form.formState.isSubmitting || isLoading

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalContent>
        <Show when={admin != null} data={admin}>
          {(adminData) => (
            <>
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>
                  Редактировать админа
                </ResponsiveModalTitle>
                <ResponsiveModalDescription>
                  {adminData.username}
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
                      error={formState.errors.name?.message}
                      {...register('name')}
                    />
                    <InputField
                      label="Логин"
                      autoComplete="off"
                      error={formState.errors.username?.message}
                      {...register('username')}
                    />
                    <PasswordField
                      label="Новый пароль"
                      placeholder="Оставьте пустым, чтобы не менять"
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
                        <LoaderGate
                          isLoading={isSubmitting}
                          loaderSlot={<Spinner />}
                        >
                          Сохранить
                        </LoaderGate>
                      </Button>
                    </ResponsiveModalFooter>
                  </>
                )}
              </AppForm>
            </>
          )}
        </Show>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
