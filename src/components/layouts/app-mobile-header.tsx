import { LogOutIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLogoutConfirm } from '@/hooks/use-logout-confirm'

export function AppMobileHeader() {
  const { open } = useLogoutConfirm()

  return (
    <header className="sticky top-0 z-top-nav flex items-center justify-between gap-3 border-b border-border bg-background/95 px-3 py-2 backdrop-blur-md md:hidden">
      <span className="truncate text-sm font-semibold tracking-tight">
        WB Multicontrol
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 gap-1.5 text-muted-foreground"
        onClick={open}
      >
        <LogOutIcon className="size-4" aria-hidden />
        Выйти
      </Button>
    </header>
  )
}
