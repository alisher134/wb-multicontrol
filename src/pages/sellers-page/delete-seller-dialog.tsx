import { Button } from '@/components/ui/button'
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
import { useSellerMutation } from '@/hooks/use-seller-mutation'
import type { SellerAccount } from '@/lib/api'
import { deleteSeller } from '@/lib/api'

type DeleteSellerDialogProps = {
  seller: SellerAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteSellerDialog({
  seller,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSellerDialogProps) {
  const { isLoading, runMutation } = useSellerMutation(onSuccess)

  const handleDelete = async () => {
    if (seller == null) {
      return
    }

    const isSuccess = await runMutation(async () => {
      await deleteSeller(seller.id)
    }, 'Кабинет удалён')

    if (isSuccess) {
      onOpenChange(false)
    }
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <Show when={seller != null} data={seller}>
          {(sellerData) => (
            <>
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>Удалить кабинет?</ResponsiveModalTitle>
                <ResponsiveModalDescription>
                  {sellerData.name} ({sellerData.shortName}) будет удалён из
                  мультиконтроля. Токен в кабинете WB не отзывается.
                </ResponsiveModalDescription>
              </ResponsiveModalHeader>

              <ResponsiveModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <LoaderGate isLoading={isLoading} loaderSlot={<Spinner />}>
                    Удалить
                  </LoaderGate>
                </Button>
              </ResponsiveModalFooter>
            </>
          )}
        </Show>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
