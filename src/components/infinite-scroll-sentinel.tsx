import { useEffect, useRef } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { Show } from '@/components/ui/show'

type InfiniteScrollSentinelProps = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
}

export function InfiniteScrollSentinel({
  hasMore,
  isLoading,
  onLoadMore,
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = sentinelRef.current

    if (node == null || !hasMore) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry?.isIntersecting) {
          onLoadMore()
        }
      },
      { root: null, rootMargin: '200px 0px', threshold: 0 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, onLoadMore])

  return (
    <Show when={hasMore || isLoading}>
      <div
        ref={sentinelRef}
        className="flex min-h-12 items-center justify-center py-4"
        aria-hidden={!isLoading}
      >
        <Show when={isLoading}>
          <Spinner className="size-5" />
        </Show>
      </div>
    </Show>
  )
}
