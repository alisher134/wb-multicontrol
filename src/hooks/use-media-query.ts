import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void): (() => void) => {
      const media = window.matchMedia(query)

      media.addEventListener('change', onStoreChange)

      return () => {
        media.removeEventListener('change', onStoreChange)
      }
    },
    [query],
  )

  const getSnapshot = useCallback((): boolean => {
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback((): boolean => {
    return false
  }, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
