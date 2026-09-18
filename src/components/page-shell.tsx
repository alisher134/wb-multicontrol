import type { ReactNode } from 'react'

import { Show } from '@/components/ui/show'

type PageShellProps = {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function PageShell({
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <Show when={description != null} data={description}>
            {(descriptionText) => (
              <p className="text-sm text-pretty text-muted-foreground">
                {descriptionText}
              </p>
            )}
          </Show>
        </div>
        <Show when={actions != null}>
          <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
            {actions}
          </div>
        </Show>
      </header>
      {children}
    </div>
  )
}
