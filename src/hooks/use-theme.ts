import { useCallback, useSyncExternalStore } from 'react'

import {
  getStoredTheme,
  resolveTheme,
  setTheme,
  type Theme,
  toggleTheme,
} from '@/lib/theme'

function subscribe(onStoreChange: () => void): () => void {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (getStoredTheme() == null) {
      onStoreChange()
    }
  }

  media.addEventListener('change', handleChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    media.removeEventListener('change', handleChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

function getThemeSnapshot(): Theme {
  return resolveTheme()
}

function getThemeServerSnapshot(): Theme {
  return 'light'
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getThemeServerSnapshot,
  )

  const handleSetTheme = useCallback((next: Theme) => {
    setTheme(next)
    window.dispatchEvent(new Event('storage'))
  }, [])

  const handleToggleTheme = useCallback(() => {
    toggleTheme()
    window.dispatchEvent(new Event('storage'))
  }, [])

  return {
    theme,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
  }
}
