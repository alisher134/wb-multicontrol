import { AppForm } from '@/components/ui/app-form'
import { Button } from '@/components/ui/button'
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
import { useZodForm } from '@/hooks/use-zod-form'
import { useSellerMutation } from '@/hooks/use-seller-mutation'
import type { SellerAccount } from '@/lib/api'
import { updateSellerToken } from '@/lib/api'

import {
  updateSellerTokenFormSchema,
  type UpdateSellerTokenFormValues,
} from './seller-form-schema'

const DEFAULT_VALUES: UpdateSellerTokenFormValues = {
  token: '',
}

type UpdateSellerTokenDialogProps = {
  seller: SellerAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UpdateSellerTokenDialog({
  seller,
  open,
  onOpenChange,
  onSuccess,
}: UpdateSellerTokenDialogProps) {
  const { isLoading, runMutation } = useSellerMutation(onSuccess)

  const form = useZodForm(updateSellerTokenFormSchema, {
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(DEFAULT_VALUES)
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async (values: UpdateSellerTokenFormValues) => {
    if (seller == null) {
      return
    }

    const isSuccess = await runMutation(async () => {
      await updateSellerToken({
        id: seller.id,
        token: values.token,
      })
    }, 'Токен обновлён')

    if (isSuccess) {
      form.reset(DEFAULT_VALUES)
      onOpenChange(false)
    }
  }

  const isSubmitting = form.formState.isSubmitting || isLoading

  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalContent>
        <Show when={seller != null} data={seller}>
          {(sellerData) => (
            <>
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>Обновить токен</ResponsiveModalTitle>
                <ResponsiveModalDescription>
                  {sellerData.name}: вставьте новый API-токен из кабинета WB
                </ResponsiveModalDescription>
              </ResponsiveModalHeader>

              <AppForm
                form={form}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                {({ register, formState }) => (
                  <>
                    <PasswordField
                      label="Новый API-токен"
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
                        <LoaderGate
                          isLoading={isSubmitting}
                          loaderSlot={<Spinner />}
                        >
                          Обновить
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
