const THEME_STORAGE_KEY = 'wb-multicontrol-theme'

export type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return null
}

export function resolveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function toggleTheme(): Theme {
  const next = resolveTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

export function initTheme(): Theme {
  const theme = resolveTheme()
  applyTheme(theme)
  return theme
}
