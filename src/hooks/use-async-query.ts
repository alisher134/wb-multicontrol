import { useEffect, useState } from 'react'

type AsyncQueryState<T> = {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  errorMessage: string | undefined
  refetch: () => void
}

type UseAsyncQueryOptions = {
  enabled?: boolean
}

export function useAsyncQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncQueryOptions = {},
): AsyncQueryState<T> {
  const isEnabled = options.enabled ?? true
  const [reloadKey, setReloadKey] = useState(0)
  const [state, setState] = useState({
    data: undefined as T | undefined,
    isLoading: isEnabled,
    isError: false,
    errorMessage: undefined as string | undefined,
  })

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let isCancelled = false

    const load = async () => {
      await Promise.resolve()

      if (isCancelled) {
        return
      }

      setState({
        data: undefined,
        isLoading: true,
        isError: false,
        errorMessage: undefined,
      })

      try {
        const data = await fetcher()

        if (isCancelled) {
          return
        }

        setState({
          data,
          isLoading: false,
          isError: false,
          errorMessage: undefined,
        })
      } catch (error: unknown) {
        if (isCancelled) {
          return
        }

        const message =
          error instanceof Error ? error.message : 'Не удалось загрузить данные'

        setState({
          data: undefined,
          isLoading: false,
          isError: true,
          errorMessage: message,
        })
      }
    }

    void load()

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps passed by caller
  }, [...deps, isEnabled, reloadKey])

  const refetch = () => {
    setReloadKey((currentKey) => currentKey + 1)
  }

  return {
    ...state,
    isLoading: isEnabled ? state.isLoading : false,
    refetch,
  }
}
