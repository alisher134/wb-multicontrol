import { useCallback, useEffect, useRef, useState } from 'react'

import type { PaginatedResult, PaginationParams } from '@/lib/api'

const DEFAULT_PAGE_LIMIT = 20

type InfiniteQueryState<T> = {
  items: T[]
  isLoading: boolean
  isFetchingNextPage: boolean
  isError: boolean
  errorMessage: string | undefined
  hasMore: boolean
  loadMore: () => void
  refetch: () => void
}

export function useInfiniteQuery<T>(
  fetcher: (pagination: PaginationParams) => Promise<PaginatedResult<T>>,
  deps: unknown[],
  limit = DEFAULT_PAGE_LIMIT,
): InfiniteQueryState<T> {
  const [reloadKey, setReloadKey] = useState(0)
  const [items, setItems] = useState<T[]>([])
  const [nextOffset, setNextOffset] = useState<number | null>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const requestIdRef = useRef(0)
  const isFetchingNextPageRef = useRef(false)

  useEffect(() => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    isFetchingNextPageRef.current = false

    let isCancelled = false

    const loadFirstPage = async () => {
      setItems([])
      setNextOffset(0)
      setIsLoading(true)
      setIsFetchingNextPage(false)
      setIsError(false)
      setErrorMessage(undefined)

      try {
        const page = await fetcher({ offset: 0, limit })

        if (isCancelled || requestId !== requestIdRef.current) {
          return
        }

        setItems(page.items)
        setNextOffset(page.nextOffset)
        setIsLoading(false)
      } catch (error: unknown) {
        if (isCancelled || requestId !== requestIdRef.current) {
          return
        }

        setItems([])
        setNextOffset(null)
        setIsLoading(false)
        setIsError(true)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить данные',
        )
      }
    }

    void loadFirstPage()

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed by caller
  }, [...deps, limit, reloadKey])

  const loadMore = useCallback(() => {
    if (
      nextOffset == null ||
      isLoading ||
      isFetchingNextPageRef.current ||
      isError
    ) {
      return
    }

    const requestId = requestIdRef.current
    const offset = nextOffset
    isFetchingNextPageRef.current = true
    setIsFetchingNextPage(true)

    const loadNextPage = async () => {
      try {
        const page = await fetcher({ offset, limit })

        if (requestId !== requestIdRef.current) {
          return
        }

        setItems((currentItems) => [...currentItems, ...page.items])
        setNextOffset(page.nextOffset)
      } catch (error: unknown) {
        if (requestId !== requestIdRef.current) {
          return
        }

        setIsError(true)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить следующую страницу',
        )
      } finally {
        if (requestId === requestIdRef.current) {
          isFetchingNextPageRef.current = false
          setIsFetchingNextPage(false)
        }
      }
    }

    void loadNextPage()
  }, [fetcher, isError, isLoading, limit, nextOffset])

  const refetch = () => {
    setReloadKey((currentKey) => currentKey + 1)
  }

  return {
    items,
    isLoading,
    isFetchingNextPage,
    isError,
    errorMessage,
    hasMore: nextOffset != null,
    loadMore,
    refetch,
  }
}
