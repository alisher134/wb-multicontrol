import { getJsonItem, removeItem, setJsonItem } from '@/lib/storage'

const AUTH_STORAGE_KEY = 'wb-multicontrol-auth'

export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const

type MockSession = {
  username: string
}

export type MockLoginResult =
  { success: true; username: string } | { success: false; message: string }

function isMockSession(value: unknown): value is MockSession {
  return (
    typeof value === 'object' &&
    value != null &&
    'username' in value &&
    typeof value.username === 'string'
  )
}

export function loginWithMockCredentials(
  username: string,
  password: string,
): MockLoginResult {
  const isValid =
    username === MOCK_CREDENTIALS.username &&
    password === MOCK_CREDENTIALS.password

  if (!isValid) {
    return {
      success: false,
      message: 'Неверный логин или пароль',
    }
  }

  const session: MockSession = { username }
  setJsonItem(AUTH_STORAGE_KEY, session)

  return { success: true, username }
}

export function getMockSession(): MockSession | null {
  const session = getJsonItem(AUTH_STORAGE_KEY)

  if (!isMockSession(session)) {
    return null
  }

  return session
}

export function isMockAuthenticated(): boolean {
  return getMockSession() != null
}

export function logoutMockSession(): void {
  removeItem(AUTH_STORAGE_KEY)
}
