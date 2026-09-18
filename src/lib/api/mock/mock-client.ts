import type {
  DashboardDayPoint,
  DashboardStats,
  DashboardStatusPoint,
  Order,
  OrderDetails,
  OrderStatus,
  OrdersFilters,
  SellerAccount,
} from '../types'
import { mapOrderToDetails } from './map-order-details'
import { MOCK_ORDERS } from './mock-orders'
import { MOCK_SELLERS } from './mock-sellers'

const MOCK_API_DELAY_MS = 400
const ORDERS_TREND_DAYS = 7

const ORDER_STATUSES: OrderStatus[] = [
  'new',
  'confirm',
  'assemble',
  'deliver',
  'cancel',
  'return',
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
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

function buildOrdersTrend(
  orders: Order[],
  reference: Date,
): DashboardDayPoint[] {
  const points: DashboardDayPoint[] = []

  for (let offset = ORDERS_TREND_DAYS - 1; offset >= 0; offset -= 1) {
    const day = new Date(reference)
    day.setUTCDate(reference.getUTCDate() - offset)
    day.setUTCHours(12, 0, 0, 0)

    const dayOrders = orders.filter((order) =>
      isSameUtcDay(order.createdAt, day),
    )

    const revenue = dayOrders
      .filter((order) => order.status !== 'cancel')
      .reduce((sum, order) => sum + order.amount, 0)

    points.push({
      date: toUtcDayKey(day),
      label: formatDayLabel(day),
      ordersCount: dayOrders.length,
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

export async function getSellers(): Promise<SellerAccount[]> {
  await delay(MOCK_API_DELAY_MS)
  return [...MOCK_SELLERS]
}

export async function getOrderById(orderId: string): Promise<OrderDetails> {
  await delay(MOCK_API_DELAY_MS)

  const order = MOCK_ORDERS.find((item) => item.id === orderId)

  if (order == null) {
    throw new Error('Заказ не найден')
  }

  return mapOrderToDetails(order)
}

export async function getOrders(filters: OrdersFilters): Promise<Order[]> {
  await delay(MOCK_API_DELAY_MS)

  return MOCK_ORDERS.filter((order) => {
    const matchesAccount =
      filters.accountId === 'all' || order.accountId === filters.accountId
    const matchesStatus =
      filters.status === 'all' || order.status === filters.status

    return matchesAccount && matchesStatus
  })
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(MOCK_API_DELAY_MS)

  const today = new Date()
  const todayOrders = MOCK_ORDERS.filter((order) =>
    isSameUtcDay(order.createdAt, today),
  )

  const returnsCount = todayOrders.filter(
    (order) => order.status === 'return',
  ).length

  const revenueToday = todayOrders
    .filter((order) => order.status !== 'cancel')
    .reduce((sum, order) => sum + order.amount, 0)

  const problemSellersCount = MOCK_SELLERS.filter(
    (seller) => seller.status !== 'active',
  ).length

  const bySeller = MOCK_SELLERS.map((seller) => {
    const sellerOrders = todayOrders.filter(
      (order) => order.accountId === seller.id,
    )

    const revenue = sellerOrders
      .filter((order) => order.status !== 'cancel')
      .reduce((sum, order) => sum + order.amount, 0)

    return {
      sellerId: seller.id,
      sellerName: seller.name,
      shortName: seller.shortName,
      ordersCount: sellerOrders.length,
      revenue,
    }
  })

  return {
    ordersToday: todayOrders.length,
    revenueToday,
    returnsCount,
    problemSellersCount,
    bySeller,
    ordersTrend: buildOrdersTrend(MOCK_ORDERS, today),
    statusBreakdown: buildStatusBreakdown(todayOrders),
  }
}
