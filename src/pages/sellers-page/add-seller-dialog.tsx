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
import { useZodForm } from '@/hooks/use-zod-form'
import { useSellerMutation } from '@/hooks/use-seller-mutation'
import { createSeller } from '@/lib/api'

import {
  createSellerFormSchema,
  type CreateSellerFormValues,
} from './seller-form-schema'

const DEFAULT_VALUES: CreateSellerFormValues = {
  name: '',
  shortName: '',
  token: '',
}

type AddSellerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddSellerDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddSellerDialogProps) {
  const { isLoading, runMutation } = useSellerMutation(onSuccess)

  const form = useZodForm(createSellerFormSchema, {
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(DEFAULT_VALUES)
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (values: CreateSellerFormValues) => {
    const isSuccess = await runMutation(async () => {
      await createSeller(values)
    }, 'Кабинет добавлен')

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
          <ResponsiveModalTitle>Добавить кабинет</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Вставьте API-токен из кабинета Wildberries
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
                label="Название"
                placeholder="ИП Иванов А.С."
                error={formState.errors.name?.message}
                {...register('name')}
              />
              <InputField
                label="Короткое имя"
                placeholder="ИП-6"
                error={formState.errors.shortName?.message}
                {...register('shortName')}
              />
              <PasswordField
                label="API-токен"
                placeholder="••••••••••••"
                autoComplete="off"
                error={formState.errors.token?.message}
                {...register('token')}
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
