import type { ReactNode } from 'react'

import { Show } from '@/components/ui/show'

type PageShellProps = {
  title: string
  description?: string
  children: ReactNode
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Show when={description != null}>
          <p className="text-sm text-muted-foreground">{description}</p>
        </Show>
      </header>
      {children}
    </div>
  )
}
