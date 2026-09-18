import { type ReactNode } from 'react'

export function Show<Data>({
  data,
  when,
  children,
  fallback = null,
}: {
  data?: Data
  when: boolean
  children: ReactNode | ((data: NonNullable<Data>, when: boolean) => ReactNode)
  fallback?: ReactNode
}) {
  if (!when) {
    return fallback
  }

  if (typeof children === 'function') {
    return children(data as NonNullable<Data>, when)
  }

  return children
}
