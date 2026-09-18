import { getJsonItem, setJsonItem } from '@/lib/storage'

import type {
  AdminRole,
  AdminUser,
  AdminUserRecord,
  CreateAdminPayload,
  UpdateAdminPayload,
} from '../types'
import { MOCK_ADMINS } from './mock-admins'

const ADMINS_STORAGE_KEY = 'wb-multicontrol-admins'

const ADMIN_ROLES: AdminRole[] = ['LEAD_ADMIN', 'ADMIN']

type AdminActor = {
  adminId: string
  role: AdminRole
}

function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && ADMIN_ROLES.includes(value as AdminRole)
}

function isAdminUserRecord(value: unknown): value is AdminUserRecord {
  return (
    typeof value === 'object' &&
    value != null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'username' in value &&
    typeof value.username === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'role' in value &&
    isAdminRole(value.role) &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    'password' in value &&
    typeof value.password === 'string'
  )
}

function toPublicAdmin(record: AdminUserRecord): AdminUser {
  return {
    id: record.id,
    username: record.username,
    name: record.name,
    role: record.role,
    createdAt: record.createdAt,
  }
}

function createSeedRecords(): AdminUserRecord[] {
  return MOCK_ADMINS.map((admin) => ({ ...admin }))
}

function saveRecords(records: AdminUserRecord[]): void {
  setJsonItem(ADMINS_STORAGE_KEY, records)
}

function loadRecords(): AdminUserRecord[] {
  const stored = getJsonItem(ADMINS_STORAGE_KEY)

  if (!Array.isArray(stored)) {
    const seed = createSeedRecords()
    saveRecords(seed)
    return seed
  }

  const records = stored.filter(isAdminUserRecord)

  if (records.length === 0) {
    const seed = createSeedRecords()
    saveRecords(seed)
    return seed
  }

  return records
}

function createAdminId(): string {
  return `admin-${crypto.randomUUID()}`
}

function assertLeadAdmin(actor: AdminActor): void {
  if (actor.role !== 'LEAD_ADMIN') {
    throw new Error('Недостаточно прав для управления админами')
  }
}

export function listAdminUsers(): AdminUser[] {
  return loadRecords().map(toPublicAdmin)
}

export function findAdminByCredentials(
  username: string,
  password: string,
): AdminUser | null {
  const normalizedUsername = username.trim().toLowerCase()
  const record = loadRecords().find(
    (admin) =>
      admin.username.toLowerCase() === normalizedUsername &&
      admin.password === password,
  )

  if (record == null) {
    return null
  }

  return toPublicAdmin(record)
}

export function createAdminRecord(
  payload: CreateAdminPayload,
  actor: AdminActor,
): AdminUser {
  assertLeadAdmin(actor)

  const username = payload.username.trim()
  const name = payload.name.trim()
  const password = payload.password

  if (username.length === 0) {
    throw new Error('Введите имя пользователя')
  }

  if (name.length === 0) {
    throw new Error('Введите имя')
  }

  if (password.length < 6) {
    throw new Error('Пароль должен быть не короче 6 символов')
  }

  const records = loadRecords()
  const usernameTaken = records.some(
    (admin) => admin.username.toLowerCase() === username.toLowerCase(),
  )

  if (usernameTaken) {
    throw new Error('Админ с таким логином уже существует')
  }

  const record: AdminUserRecord = {
    id: createAdminId(),
    username,
    name,
    role: 'ADMIN',
    password,
    createdAt: new Date().toISOString(),
  }

  records.push(record)
  saveRecords(records)

  return toPublicAdmin(record)
}

export function updateAdminRecord(
  payload: UpdateAdminPayload,
  actor: AdminActor,
): AdminUser {
  assertLeadAdmin(actor)

  const username = payload.username.trim()
  const name = payload.name.trim()
  const nextPassword = payload.password?.trim()

  if (username.length === 0) {
    throw new Error('Введите имя пользователя')
  }

  if (name.length === 0) {
    throw new Error('Введите имя')
  }

  if (
    nextPassword != null &&
    nextPassword.length > 0 &&
    nextPassword.length < 6
  ) {
    throw new Error('Пароль должен быть не короче 6 символов')
  }

  const records = loadRecords()
  const index = records.findIndex((admin) => admin.id === payload.id)

  if (index === -1) {
    throw new Error('Админ не найден')
  }

  const usernameTaken = records.some(
    (admin) =>
      admin.id !== payload.id &&
      admin.username.toLowerCase() === username.toLowerCase(),
  )

  if (usernameTaken) {
    throw new Error('Админ с таким логином уже существует')
  }

  const current = records[index]
  const updated: AdminUserRecord = {
    ...current,
    username,
    name,
    password:
      nextPassword != null && nextPassword.length > 0
        ? nextPassword
        : current.password,
  }

  records[index] = updated
  saveRecords(records)

  return toPublicAdmin(updated)
}

export function deleteAdminRecord(adminId: string, actor: AdminActor): void {
  assertLeadAdmin(actor)

  if (adminId === actor.adminId) {
    throw new Error('Нельзя удалить собственный аккаунт')
  }

  const records = loadRecords()
  const target = records.find((admin) => admin.id === adminId)

  if (target == null) {
    throw new Error('Админ не найден')
  }

  if (target.role === 'LEAD_ADMIN') {
    throw new Error('Нельзя удалить главного админа')
  }

  saveRecords(records.filter((admin) => admin.id !== adminId))
}
