type StorageValue = string

type AppStorage = {
  getItem: (key: string) => StorageValue | null
  setItem: (key: string, value: StorageValue) => void
  removeItem: (key: string) => void
}

function createLocalStorage(): AppStorage {
  return {
    getItem: (key) => {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch {
        // QuotaExceeded / private mode — ignore for mock auth
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key)
      } catch {
        // ignore
      }
    },
  }
}

export const appStorage: AppStorage = createLocalStorage()

export function getJsonItem(key: string): unknown {
  const raw = appStorage.getItem(key)

  if (raw == null) {
    return null
  }

  try {
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function setJsonItem(key: string, value: unknown): void {
  appStorage.setItem(key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  appStorage.removeItem(key)
}
