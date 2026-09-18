import { findAdminByCredentials } from '@/lib/api/mock/admins-store'
import type { AdminRole } from '@/lib/api/types'
import { getJsonItem, removeItem, setJsonItem } from '@/lib/storage'

const AUTH_STORAGE_KEY = 'wb-multicontrol-auth'

/** Seed LEAD_ADMIN credentials for local mock login */
export const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const

type MockSession = {
  adminId: string
  username: string
  role: AdminRole
}

export type MockLoginResult =
  | { success: true; username: string; role: AdminRole }
  | { success: false; message: string }

const ADMIN_ROLES: AdminRole[] = ['LEAD_ADMIN', 'ADMIN']

function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && ADMIN_ROLES.includes(value as AdminRole)
}

function isMockSession(value: unknown): value is MockSession {
  return (
    typeof value === 'object' &&
    value != null &&
    'adminId' in value &&
    typeof value.adminId === 'string' &&
    'username' in value &&
    typeof value.username === 'string' &&
    'role' in value &&
    isAdminRole(value.role)
  )
}

export function loginWithMockCredentials(
  username: string,
  password: string,
): MockLoginResult {
  const admin = findAdminByCredentials(username, password)

  if (admin == null) {
    return {
      success: false,
      message: 'Неверный логин или пароль',
    }
  }

  const session: MockSession = {
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
  }
  setJsonItem(AUTH_STORAGE_KEY, session)

  return {
    success: true,
    username: admin.username,
    role: admin.role,
  }
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

export function isLeadAdmin(): boolean {
  return getMockSession()?.role === 'LEAD_ADMIN'
}

export function syncMockSessionProfile(username: string): void {
  const session = getMockSession()

  if (session == null) {
    return
  }

  setJsonItem(AUTH_STORAGE_KEY, {
    ...session,
    username,
  })
}

export function logoutMockSession(): void {
  removeItem(AUTH_STORAGE_KEY)
}
