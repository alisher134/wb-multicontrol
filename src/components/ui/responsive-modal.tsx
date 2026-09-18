import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { cn } from 'cn'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'

const MD_UP_QUERY = '(min-width: 768px)'

type ResponsiveModalContextValue = {
  isDesktop: boolean
}

const ResponsiveModalContext =
  createContext<ResponsiveModalContextValue | null>(null)

function useResponsiveModalContext(): ResponsiveModalContextValue {
  const context = useContext(ResponsiveModalContext)

  if (context == null) {
    throw new Error(
      'ResponsiveModal components must be used within ResponsiveModal',
    )
  }

  return context
}

type ResponsiveModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

function ResponsiveModal({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery(MD_UP_QUERY)

  return (
    <ResponsiveModalContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={onOpenChange}>
          {children}
        </Sheet>
      )}
    </ResponsiveModalContext.Provider>
  )
}

type ResponsiveModalContentProps = {
  className?: string
  children: ReactNode
  showCloseButton?: boolean
}

function ResponsiveModalContent({
  className,
  children,
  showCloseButton = true,
}: ResponsiveModalContentProps) {
  const { isDesktop } = useResponsiveModalContext()

  if (isDesktop) {
    return (
      <DialogContent
        className={cn('sm:max-w-md', className)}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    )
  }

  return (
    <SheetContent
      side="bottom"
      className={className}
      showCloseButton={showCloseButton}
    >
      {children}
    </SheetContent>
  )
}

function ResponsiveModalHeader({ className, ...props }: ComponentProps<'div'>) {
  const { isDesktop } = useResponsiveModalContext()

  if (isDesktop) {
    return <DialogHeader className={className} {...props} />
  }

  return <SheetHeader className={className} {...props} />
}

function ResponsiveModalFooter({ className, ...props }: ComponentProps<'div'>) {
  const { isDesktop } = useResponsiveModalContext()

  if (isDesktop) {
    return <DialogFooter className={className} {...props} />
  }

  return (
    <SheetFooter
      className={cn('grid grid-cols-2 gap-2', className)}
      {...props}
    />
  )
}

function ResponsiveModalTitle({
  className,
  ...props
}: ComponentProps<typeof DialogTitle>) {
  const { isDesktop } = useResponsiveModalContext()

  if (isDesktop) {
    return <DialogTitle className={className} {...props} />
  }

  return <SheetTitle className={className} {...props} />
}

function ResponsiveModalDescription({
  className,
  ...props
}: ComponentProps<typeof DialogDescription>) {
  const { isDesktop } = useResponsiveModalContext()

  if (isDesktop) {
    return <DialogDescription className={className} {...props} />
  }

  return <SheetDescription className={className} {...props} />
}

export {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
}
