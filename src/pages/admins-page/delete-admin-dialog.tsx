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
import { useAdminMutation } from '@/hooks/use-admin-mutation'
import type { AdminUser } from '@/lib/api'
import { deleteAdmin } from '@/lib/api'

type DeleteAdminDialogProps = {
  admin: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteAdminDialog({
  admin,
  open,
  onOpenChange,
  onSuccess,
}: DeleteAdminDialogProps) {
  const { isLoading, runMutation } = useAdminMutation(onSuccess)

  const handleDelete = async () => {
    if (admin == null) {
      return
    }

    const isSuccess = await runMutation(async () => {
      await deleteAdmin(admin.id)
    }, 'Админ удалён')

    if (isSuccess) {
      onOpenChange(false)
    }
  }

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <Show when={admin != null} data={admin}>
          {(adminData) => (
            <>
              <ResponsiveModalHeader>
                <ResponsiveModalTitle>Удалить админа?</ResponsiveModalTitle>
                <ResponsiveModalDescription>
                  {adminData.name} ({adminData.username}) потеряет доступ к
                  мультиконтролю.
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
