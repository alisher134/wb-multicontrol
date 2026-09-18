import type { SellerAccount } from '../types'

export const MOCK_SELLERS: SellerAccount[] = [
  {
    id: 'seller-1',
    name: 'ИП Иванов А.С.',
    shortName: 'ИП-1',
    status: 'active',
    lastSyncedAt: '2026-03-18T08:12:00.000Z',
    hasToken: true,
  },
  {
    id: 'seller-2',
    name: 'ИП Петрова М.К.',
    shortName: 'ИП-2',
    status: 'active',
    lastSyncedAt: '2026-03-18T08:05:00.000Z',
    hasToken: true,
  },
  {
    id: 'seller-3',
    name: 'ИП Сидоров Д.В.',
    shortName: 'ИП-3',
    status: 'token_expired',
    lastSyncedAt: '2026-03-15T14:30:00.000Z',
    hasToken: true,
  },
  {
    id: 'seller-4',
    name: 'ИП Козлова Е.Н.',
    shortName: 'ИП-4',
    status: 'active',
    lastSyncedAt: '2026-03-18T07:58:00.000Z',
    hasToken: true,
  },
  {
    id: 'seller-5',
    name: 'ИП Морозов И.П.',
    shortName: 'ИП-5',
    status: 'error',
    lastSyncedAt: '2026-03-17T19:20:00.000Z',
    hasToken: true,
  },
]
