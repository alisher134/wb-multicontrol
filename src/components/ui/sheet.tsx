import * as React from 'react'
import { cn } from 'cn'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

function Sheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 isolate z-drawer-backdrop bg-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className,
      )}
      {...props}
    />
  )
}

const sheetContentVariants = cva(
  'fixed z-drawer-content flex flex-col gap-4 bg-popover text-sm text-popover-foreground shadow-lg duration-200 outline-none data-open:animate-in data-closed:animate-out',
  {
    variants: {
      side: {
        bottom:
          'inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border border-b-0 border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] data-open:slide-in-from-bottom data-closed:slide-out-to-bottom',
        top: 'inset-x-0 top-0 max-h-[85vh] rounded-b-2xl border border-t-0 border-border p-4 data-open:slide-in-from-top data-closed:slide-out-to-top',
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border p-4 data-open:slide-in-from-left data-closed:slide-out-to-left',
        right:
          'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border p-4 data-open:slide-in-from-right data-closed:slide-out-to-right',
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  },
)

function SheetContent({
  className,
  children,
  side = 'bottom',
  showCloseButton = true,
  showHandle = side === 'bottom',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants> & {
    showCloseButton?: boolean
    showHandle?: boolean
  }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(sheetContentVariants({ side }), className)}
        {...props}
      >
        {showHandle ? (
          <div
            className="mx-auto h-1 w-10 shrink-0 rounded-full bg-muted"
            aria-hidden
          />
        ) : null}
        {children}
        {showCloseButton ? (
          <DialogPrimitive.Close data-slot="sheet-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-2 text-left', className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-base leading-none font-medium', className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
}
