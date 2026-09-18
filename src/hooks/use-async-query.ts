import { useEffect, useState } from 'react'

type AsyncQueryState<T> = {
  data: T | undefined
  isLoading: boolean
  isError: boolean
  errorMessage: string | undefined
}

export function useAsyncQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): AsyncQueryState<T> {
  const [state, setState] = useState<AsyncQueryState<T>>({
    data: undefined,
    isLoading: true,
    isError: false,
    errorMessage: undefined,
  })

  useEffect(() => {
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
  }, deps)

  return state
}
