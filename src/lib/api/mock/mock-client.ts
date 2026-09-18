import { getMockSession, syncMockSessionProfile } from '@/lib/mock-auth'

import type {
  AdminUser,
  CreateAdminPayload,
  CreateSellerPayload,
  DashboardDayPoint,
  DashboardFilters,
  DashboardPeriod,
  DashboardStats,
  DashboardStatusPoint,
  DashboardStocksSummary,
  Order,
  OrderDetails,
  OrderStatus,
  OrdersFilters,
  PaginatedResult,
  PaginationParams,
  SellerAccount,
  SellerDashboardRow,
  StockItem,
  StocksFilters,
  UpdateAdminPayload,
  UpdateSellerPayload,
  UpdateSellerTokenPayload,
} from '../types'
import { getStockLevel } from '../stock-level'
import {
  createAdminRecord,
  deleteAdminRecord,
  listAdminUsers,
  updateAdminRecord,
} from './admins-store'
import { mapOrderToDetails } from './map-order-details'
import { MOCK_ORDERS } from './mock-orders'
import { MOCK_STOCKS } from './mock-stocks'
import {
  createSellerRecord,
  deleteSellerRecord,
  listSellerAccounts,
  updateSellerRecord,
  updateSellerTokenRecord,
} from './sellers-store'

function requireSessionActor() {
  const session = getMockSession()

  if (session == null) {
    throw new Error('Требуется авторизация')
  }

  return {
    adminId: session.adminId,
    role: session.role,
  }
}

const MOCK_API_DELAY_MS = 400
const MOCK_PAGE_DELAY_MS = 500
const DEFAULT_PAGE_LIMIT = 20

const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'confirm',
  'assemble',
  'deliver',
  'cancel',
  'return',
]

const PERIOD_DAYS: Record<DashboardPeriod, number> = {
  today: 1,
  '7d': 7,
  '30d': 30,
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function paginateItems<T>(
  items: T[],
  pagination: PaginationParams,
): PaginatedResult<T> {
  const limit = pagination.limit > 0 ? pagination.limit : DEFAULT_PAGE_LIMIT
  const offset = Math.max(0, pagination.offset)
  const pageItems = items.slice(offset, offset + limit)
  const nextOffset = offset + pageItems.length
  const hasMore = nextOffset < items.length

  return {
    items: pageItems,
    nextOffset: hasMore ? nextOffset : null,
  }
}

function isSameUtcDay(isoDate: string, reference: Date): boolean {
  const date = new Date(isoDate)
  return (
    date.getUTCFullYear() === reference.getUTCFullYear() &&
    date.getUTCMonth() === reference.getUTCMonth() &&
    date.getUTCDate() === reference.getUTCDate()
  )
}

function toUtcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function startOfUtcDay(date: Date): Date {
  const day = new Date(date)
  day.setUTCHours(0, 0, 0, 0)
  return day
}

function isWithinPeriod(
  isoDate: string,
  reference: Date,
  period: DashboardPeriod,
): boolean {
  const orderDate = new Date(isoDate)

  if (period === 'today') {
    return isSameUtcDay(isoDate, reference)
  }

  const periodStart = startOfUtcDay(reference)
  periodStart.setUTCDate(periodStart.getUTCDate() - (PERIOD_DAYS[period] - 1))

  return orderDate.getTime() >= periodStart.getTime()
}

function toRate(part: number, total: number): number {
  if (total <= 0) {
    return 0
  }

  return Math.round((part / total) * 1000) / 10
}

function buildOrdersTrend(
  orders: Order[],
  reference: Date,
  period: DashboardPeriod,
): DashboardDayPoint[] {
  const days = PERIOD_DAYS[period]
  const points: DashboardDayPoint[] = []

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(reference)
    day.setUTCDate(reference.getUTCDate() - offset)
    day.setUTCHours(12, 0, 0, 0)

    const dayOrders = orders.filter((order) =>
      isSameUtcDay(order.createdAt, day),
    )

    const salesCount = dayOrders.filter(
      (order) => order.status === 'deliver',
    ).length

    const revenue = dayOrders
      .filter((order) => order.status !== 'cancel')
      .reduce((sum, order) => sum + order.amount, 0)

    points.push({
      date: toUtcDayKey(day),
      label: formatDayLabel(day),
      ordersCount: dayOrders.length,
      salesCount,
      revenue,
    })
  }

  return points
}

function buildStatusBreakdown(orders: Order[]): DashboardStatusPoint[] {
  return ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  })).filter((point) => point.count > 0)
}

function buildStocksSummary(stocks: StockItem[]): DashboardStocksSummary {
  let unitsTotal = 0
  let inStockCount = 0
  let lowStockCount = 0
  let outOfStockCount = 0
  let fboUnits = 0
  let fbsUnits = 0
  let inWayToClient = 0
  let inWayFromClient = 0

  for (const stock of stocks) {
    unitsTotal += stock.quantity
    inWayToClient += stock.inWayToClient
    inWayFromClient += stock.inWayFromClient

    if (stock.fulfillmentType === 'fbo') {
      fboUnits += stock.quantity
    } else {
      fbsUnits += stock.quantity
    }

    const level = getStockLevel(stock.quantity)

    if (level === 'in_stock') {
      inStockCount += 1
    } else if (level === 'low') {
      lowStockCount += 1
    } else {
      outOfStockCount += 1
    }
  }

  return {
    skuCount: stocks.length,
    unitsTotal,
    inStockCount,
    lowStockCount,
    outOfStockCount,
    fboUnits,
    fbsUnits,
    inWayToClient,
    inWayFromClient,
  }
}

function buildSellerRow(
  seller: SellerAccount,
  sellerOrders: Order[],
  sellerStocks: StockItem[],
): SellerDashboardRow {
  const salesCount = sellerOrders.filter(
    (order) => order.status === 'deliver',
  ).length
  const cancelsCount = sellerOrders.filter(
    (order) => order.status === 'cancel',
  ).length
  const returnsCount = sellerOrders.filter(
    (order) => order.status === 'return',
  ).length
  const revenueOrders = sellerOrders.filter(
    (order) => order.status !== 'cancel',
  )
  const revenue = revenueOrders.reduce((sum, order) => sum + order.amount, 0)
  const closedCount = salesCount + cancelsCount + returnsCount
  const stocks = buildStocksSummary(sellerStocks)

  return {
    sellerId: seller.id,
    sellerName: seller.name,
    shortName: seller.shortName,
    status: seller.status,
    ordersCount: sellerOrders.length,
    salesCount,
    revenue,
    averageCheck:
      revenueOrders.length > 0 ? Math.round(revenue / revenueOrders.length) : 0,
    cancelsCount,
    returnsCount,
    cancelRate: toRate(cancelsCount, sellerOrders.length),
    returnRate: toRate(returnsCount, sellerOrders.length),
    buyoutRate: toRate(salesCount, closedCount),
    stocksSkuCount: stocks.skuCount,
    stocksUnits: stocks.unitsTotal,
    lowStockCount: stocks.lowStockCount,
    outOfStockCount: stocks.outOfStockCount,
    fboUnits: stocks.fboUnits,
    fbsUnits: stocks.fbsUnits,
    inWayToClient: stocks.inWayToClient,
    inWayFromClient: stocks.inWayFromClient,
  }
}

function filterOrders(filters: OrdersFilters): Order[] {
  return MOCK_ORDERS.filter((order) => {
    const matchesAccount =
      filters.accountId === 'all' || order.accountId === filters.accountId
    const matchesStatus =
      filters.status === 'all' || order.status === filters.status

    return matchesAccount && matchesStatus
  })
}

function filterStocks(filters: StocksFilters): StockItem[] {
  return MOCK_STOCKS.filter((stock) => {
    const matchesAccount =
      filters.accountId === 'all' || stock.accountId === filters.accountId
    const matchesFulfillment =
      filters.fulfillmentType === 'all' ||
      stock.fulfillmentType === filters.fulfillmentType
    const matchesLevel =
      filters.stockLevel === 'all' ||
      getStockLevel(stock.quantity) === filters.stockLevel

    return matchesAccount && matchesFulfillment && matchesLevel
  })
}

export async function getAdmins(): Promise<AdminUser[]> {
  await delay(MOCK_API_DELAY_MS)
  return listAdminUsers()
}

export async function createAdmin(
  payload: CreateAdminPayload,
): Promise<AdminUser> {
  await delay(MOCK_API_DELAY_MS)
  return createAdminRecord(payload, requireSessionActor())
}

export async function updateAdmin(
  payload: UpdateAdminPayload,
): Promise<AdminUser> {
  await delay(MOCK_API_DELAY_MS)

  const actor = requireSessionActor()
  const updated = updateAdminRecord(payload, actor)

  if (actor.adminId === updated.id) {
    syncMockSessionProfile(updated.username)
  }

  return updated
}

export async function deleteAdmin(adminId: string): Promise<void> {
  await delay(MOCK_API_DELAY_MS)
  deleteAdminRecord(adminId, requireSessionActor())
}

export async function getSellers(): Promise<SellerAccount[]> {
  await delay(MOCK_API_DELAY_MS)
  return listSellerAccounts()
}

export async function createSeller(
  payload: CreateSellerPayload,
): Promise<SellerAccount> {
  await delay(MOCK_API_DELAY_MS)
  return createSellerRecord(payload)
}

export async function updateSeller(
  payload: UpdateSellerPayload,
): Promise<SellerAccount> {
  await delay(MOCK_API_DELAY_MS)
  return updateSellerRecord(payload)
}

export async function updateSellerToken(
  payload: UpdateSellerTokenPayload,
): Promise<SellerAccount> {
  await delay(MOCK_API_DELAY_MS)
  return updateSellerTokenRecord(payload)
}

export async function deleteSeller(sellerId: string): Promise<void> {
  await delay(MOCK_API_DELAY_MS)
  deleteSellerRecord(sellerId)
}

export async function getOrderById(orderId: string): Promise<OrderDetails> {
  await delay(MOCK_API_DELAY_MS)

  const order = MOCK_ORDERS.find((item) => item.id === orderId)

  if (order == null) {
    throw new Error('Заказ не найден')
  }

  return mapOrderToDetails(order)
}

export async function getOrders(
  filters: OrdersFilters,
  pagination: PaginationParams = { offset: 0, limit: DEFAULT_PAGE_LIMIT },
): Promise<PaginatedResult<Order>> {
  await delay(pagination.offset === 0 ? MOCK_API_DELAY_MS : MOCK_PAGE_DELAY_MS)
  return paginateItems(filterOrders(filters), pagination)
}

export async function getStocks(
  filters: StocksFilters,
  pagination: PaginationParams = { offset: 0, limit: DEFAULT_PAGE_LIMIT },
): Promise<PaginatedResult<StockItem>> {
  await delay(pagination.offset === 0 ? MOCK_API_DELAY_MS : MOCK_PAGE_DELAY_MS)
  return paginateItems(filterStocks(filters), pagination)
}

export async function getDashboardStats(
  filters: DashboardFilters = { period: 'today', accountId: 'all' },
): Promise<DashboardStats> {
  await delay(MOCK_API_DELAY_MS)

  const today = new Date()
  const sellers = listSellerAccounts()

  const scopedSellers =
    filters.accountId === 'all'
      ? sellers
      : sellers.filter((seller) => seller.id === filters.accountId)

  const periodOrders = MOCK_ORDERS.filter((order) => {
    const matchesAccount =
      filters.accountId === 'all' || order.accountId === filters.accountId
    const matchesPeriod = isWithinPeriod(order.createdAt, today, filters.period)

    return matchesAccount && matchesPeriod
  })

  const periodStocks = MOCK_STOCKS.filter(
    (stock) =>
      filters.accountId === 'all' || stock.accountId === filters.accountId,
  )

  const salesCount = periodOrders.filter(
    (order) => order.status === 'deliver',
  ).length
  const cancelsCount = periodOrders.filter(
    (order) => order.status === 'cancel',
  ).length
  const returnsCount = periodOrders.filter(
    (order) => order.status === 'return',
  ).length
  const revenueOrders = periodOrders.filter(
    (order) => order.status !== 'cancel',
  )
  const revenue = revenueOrders.reduce((sum, order) => sum + order.amount, 0)
  const closedCount = salesCount + cancelsCount + returnsCount

  const bySeller = scopedSellers.map((seller) =>
    buildSellerRow(
      seller,
      periodOrders.filter((order) => order.accountId === seller.id),
      periodStocks.filter((stock) => stock.accountId === seller.id),
    ),
  )

  const problemSellersCount = sellers.filter(
    (seller) => seller.status !== 'active',
  ).length
  const activeSellersCount = sellers.filter(
    (seller) => seller.status === 'active',
  ).length

  return {
    period: filters.period,
    accountId: filters.accountId,
    ordersCount: periodOrders.length,
    salesCount,
    revenue,
    averageCheck:
      revenueOrders.length > 0 ? Math.round(revenue / revenueOrders.length) : 0,
    cancelsCount,
    returnsCount,
    cancelRate: toRate(cancelsCount, periodOrders.length),
    returnRate: toRate(returnsCount, periodOrders.length),
    buyoutRate: toRate(salesCount, closedCount),
    activeSellersCount,
    problemSellersCount,
    stocks: buildStocksSummary(periodStocks),
    bySeller,
    ordersTrend: buildOrdersTrend(
      MOCK_ORDERS.filter(
        (order) =>
          filters.accountId === 'all' || order.accountId === filters.accountId,
      ),
      today,
      filters.period,
    ),
    statusBreakdown: buildStatusBreakdown(periodOrders),
  }
}
