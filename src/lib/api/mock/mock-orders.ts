import type { Order, OrderItem, OrderStatus } from '../types'

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

const MOCK_PHOTO_URL = '/ps-5-slim.webp'

function daysAgoIso(days: number, hour: number): string {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() - days)
  date.setUTCHours(hour, 30, 0, 0)
  return date.toISOString()
}

function buildOrderItems(orderIndex: number): OrderItem[] {
  const itemCount = 1 + (orderIndex % 5)

  return Array.from({ length: itemCount }, (_, itemIndex) => {
    const productIndex = (orderIndex + itemIndex) % PRODUCT_NAMES.length
    const unitPrice = 890 + ((orderIndex + itemIndex) % 7) * 450
    const quantity = 1 + ((orderIndex + itemIndex) % 3)

    return {
      id: `order-${orderIndex + 1}-item-${itemIndex + 1}`,
      productName: PRODUCT_NAMES[productIndex],
      photoUrl: MOCK_PHOTO_URL,
      article: `ART-${1000 + orderIndex}-${itemIndex + 1}`,
      quantity,
      amount: unitPrice * quantity,
    }
  })
}

function buildMockOrders(): Order[] {
  const orders: Order[] = []

  for (let index = 0; index < 120; index += 1) {
    const accountId = SELLER_IDS[index % SELLER_IDS.length]
    const status = STATUSES[index % STATUSES.length]
    const dayOffset = index % 30
    const items = buildOrderItems(index)
    const amount = items.reduce((sum, item) => sum + item.amount, 0)

    orders.push({
      id: `order-${index + 1}`,
      accountId,
      wbOrderId: `${1_200_000_000 + index}`,
      status,
      createdAt: daysAgoIso(dayOffset, 6 + (index % 12)),
      amount,
      items,
    })
  }

  return orders
}

export const MOCK_ORDERS: Order[] = buildMockOrders()
