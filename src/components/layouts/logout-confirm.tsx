import { Button } from '@/components/ui/button'
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/ui/responsive-modal'
import { useLogoutConfirm } from '@/hooks/use-logout-confirm'

export function LogoutConfirm() {
  const { isOpen, setIsOpen, close, confirm, copy } = useLogoutConfirm()

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveModalContent showCloseButton={false}>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{copy.title}</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            {copy.description}
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <ResponsiveModalFooter>
          <Button type="button" variant="outline" onClick={close}>
            {copy.cancelLabel}
          </Button>
          <Button type="button" variant="destructive" onClick={confirm}>
            {copy.confirmLabel}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
