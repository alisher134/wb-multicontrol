import { getJsonItem, setJsonItem } from '@/lib/storage'

import type {
  CreateSellerPayload,
  SellerAccount,
  SellerAccountRecord,
  UpdateSellerPayload,
  UpdateSellerTokenPayload,
} from '../types'
import { MOCK_SELLERS } from './mock-sellers'
import { validateSellerToken } from './validate-seller-token'

const SELLERS_STORAGE_KEY = 'wb-multicontrol-sellers'

const SEED_TOKENS: Record<string, string> = {
  'seller-1': 'mock-token-seller-1-active',
  'seller-2': 'mock-token-seller-2-active',
  'seller-3': 'mock-token-seller-3-expired',
  'seller-4': 'mock-token-seller-4-active',
  'seller-5': 'mock-token-seller-5-error',
}

function isSellerAccountRecord(value: unknown): value is SellerAccountRecord {
  return (
    typeof value === 'object' &&
    value != null &&
    'id' in value &&
    'name' in value &&
    'shortName' in value &&
    'status' in value &&
    'lastSyncedAt' in value &&
    'hasToken' in value &&
    'token' in value
  )
}

function toPublicSeller(record: SellerAccountRecord): SellerAccount {
  return {
    id: record.id,
    name: record.name,
    shortName: record.shortName,
    status: record.status,
    lastSyncedAt: record.lastSyncedAt,
    hasToken: record.token.trim().length > 0,
  }
}

function createSeedRecords(): SellerAccountRecord[] {
  return MOCK_SELLERS.map((seller) => ({
    ...seller,
    hasToken: true,
    token: SEED_TOKENS[seller.id] ?? 'mock-token-default-active',
  }))
}

function loadRecords(): SellerAccountRecord[] {
  const stored = getJsonItem(SELLERS_STORAGE_KEY)

  if (!Array.isArray(stored)) {
    const seed = createSeedRecords()
    saveRecords(seed)
    return seed
  }

  const records = stored.filter(isSellerAccountRecord)

  if (records.length === 0) {
    const seed = createSeedRecords()
    saveRecords(seed)
    return seed
  }

  return records
}

function saveRecords(records: SellerAccountRecord[]): void {
  setJsonItem(SELLERS_STORAGE_KEY, records)
}

function createSellerId(): string {
  return `seller-${crypto.randomUUID()}`
}

export function listSellerAccounts(): SellerAccount[] {
  return loadRecords().map(toPublicSeller)
}

export function listSellerRecords(): SellerAccountRecord[] {
  return loadRecords()
}

export function createSellerRecord(
  payload: CreateSellerPayload,
): SellerAccount {
  const validation = validateSellerToken(payload.token, payload.name)
  const now = new Date().toISOString()

  const record: SellerAccountRecord = {
    id: createSellerId(),
    name: payload.name.trim(),
    shortName: payload.shortName.trim(),
    status: validation.status,
    lastSyncedAt: now,
    hasToken: true,
    token: payload.token.trim(),
  }

  const records = loadRecords()
  records.push(record)
  saveRecords(records)

  return toPublicSeller(record)
}

export function updateSellerRecord(
  payload: UpdateSellerPayload,
): SellerAccount {
  const records = loadRecords()
  const index = records.findIndex((item) => item.id === payload.id)

  if (index === -1) {
    throw new Error('Кабинет не найден')
  }

  const current = records[index]
  const updated: SellerAccountRecord = {
    ...current,
    name: payload.name.trim(),
    shortName: payload.shortName.trim(),
  }

  records[index] = updated
  saveRecords(records)

  return toPublicSeller(updated)
}

export function updateSellerTokenRecord(
  payload: UpdateSellerTokenPayload,
): SellerAccount {
  const records = loadRecords()
  const index = records.findIndex((item) => item.id === payload.id)

  if (index === -1) {
    throw new Error('Кабинет не найден')
  }

  const current = records[index]
  const validation = validateSellerToken(payload.token, current.name)
  const now = new Date().toISOString()

  const updated: SellerAccountRecord = {
    ...current,
    token: payload.token.trim(),
    status: validation.status,
    lastSyncedAt: now,
    hasToken: payload.token.trim().length > 0,
  }

  records[index] = updated
  saveRecords(records)

  return toPublicSeller(updated)
}

export function deleteSellerRecord(sellerId: string): void {
  const records = loadRecords()
  const nextRecords = records.filter((item) => item.id !== sellerId)

  if (nextRecords.length === records.length) {
    throw new Error('Кабинет не найден')
  }

  saveRecords(nextRecords)
}
