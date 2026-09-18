import type { Order, OrderStatus } from '../types'

const PRODUCT_NAMES = [
  'Кроссовки беговые',
  'Футболка хлопок',
  'Рюкзак городской',
  'Термокружка 500 мл',
  'Чехол для телефона',
  'Наушники беспроводные',
  'Куртка демисезон',
  'Шапка вязаная',
]

const STATUSES: OrderStatus[] = [
  'new',
  'confirm',
  'assemble',
  'deliver',
  'cancel',
  'return',
]

const SELLER_IDS = ['seller-1', 'seller-2', 'seller-3', 'seller-4', 'seller-5']

function daysAgoIso(days: number, hour: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  date.setUTCHours(hour, 30, 0, 0)
  return date.toISOString()
}

function buildMockOrders(): Order[] {
  const orders: Order[] = []

  for (let index = 0; index < 56; index += 1) {
    const accountId = SELLER_IDS[index % SELLER_IDS.length]
    const status = STATUSES[index % STATUSES.length]
    const dayOffset = index % 7

    orders.push({
      id: `order-${index + 1}`,
      accountId,
      wbOrderId: `${1_200_000_000 + index}`,
      status,
      createdAt: daysAgoIso(dayOffset, 6 + (index % 12)),
      amount: 890 + (index % 7) * 450,
      article: `ART-${1000 + index}`,
      productName: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
    })
  }

  return orders
}

export const MOCK_ORDERS: Order[] = buildMockOrders()
