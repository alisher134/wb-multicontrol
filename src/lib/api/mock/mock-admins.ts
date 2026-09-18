import type { AdminUserRecord } from '../types'

export const MOCK_ADMINS: AdminUserRecord[] = [
  {
    id: 'admin-1',
    username: 'admin',
    name: 'Главный админ',
    role: 'LEAD_ADMIN',
    password: 'admin123',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'admin-2',
    username: 'operator',
    name: 'Оператор',
    role: 'ADMIN',
    password: 'operator123',
    createdAt: '2026-02-15T11:30:00.000Z',
  },
]
