import { useEffect } from 'react'

import { AppForm } from '@/components/ui/app-form'
import { Button } from '@/components/ui/button'
import { InputField } from '@/components/ui/input-field'
import { LoaderGate } from '@/components/ui/loader-gate'
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
import { updateSeller } from '@/lib/api'

import {
  sellerDetailsFormSchema,
  type SellerDetailsFormValues,
} from './seller-form-schema'

type EditSellerDialogProps = {
  seller: SellerAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditSellerDialog({
  seller,
  open,
  onOpenChange,
  onSuccess,
}: EditSellerDialogProps) {
  const { isLoading, runMutation } = useSellerMutation(onSuccess)

  const form = useZodForm(sellerDetailsFormSchema, {
    defaultValues: { name: '', shortName: '' },
    mode: 'onSubmit',
  })

  useEffect(() => {
    if (seller == null) {
      return
    }

    form.reset({
      name: seller.name,
      shortName: seller.shortName,
    })
  }, [seller, form])

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (values: SellerDetailsFormValues) => {
    if (seller == null) {
      return
    }

    const isSuccess = await runMutation(async () => {
      await updateSeller({
        id: seller.id,
        name: values.name,
        shortName: values.shortName,
      })
    }, 'Кабинет обновлён')

    if (isSuccess) {
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
                <ResponsiveModalTitle>
                  Редактировать кабинет
                </ResponsiveModalTitle>
                <ResponsiveModalDescription>
                  {sellerData.shortName}
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
                      error={formState.errors.name?.message}
                      {...register('name')}
                    />
                    <InputField
                      label="Короткое имя"
                      error={formState.errors.shortName?.message}
                      {...register('shortName')}
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
