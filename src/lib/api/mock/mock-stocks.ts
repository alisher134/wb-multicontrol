import type { StockFulfillmentType, StockItem } from '../types'

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

const FBS_WAREHOUSES = [
  'Склад продавца Москва',
  'Склад продавца Казань',
  'Склад продавца СПб',
]

const FBO_WAREHOUSES = [
  'Коледино',
  'Подольск',
  'Электросталь',
  'Казань',
  'Краснодар',
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', null]

const SELLER_IDS = ['seller-1', 'seller-2', 'seller-3', 'seller-4', 'seller-5']

const QUANTITIES = [0, 2, 5, 8, 12, 25, 48, 120, 0, 3, 15, 7]

function hoursAgoIso(hours: number): string {
  const date = new Date()
  date.setUTCHours(date.getUTCHours() - hours, 15, 0, 0)
  return date.toISOString()
}

function buildMockStocks(): StockItem[] {
  const stocks: StockItem[] = []

  for (let index = 0; index < 100; index += 1) {
    const fulfillmentType: StockFulfillmentType =
      index % 3 === 0 ? 'fbo' : 'fbs'
    const warehouseName =
      fulfillmentType === 'fbo'
        ? FBO_WAREHOUSES[index % FBO_WAREHOUSES.length]
        : FBS_WAREHOUSES[index % FBS_WAREHOUSES.length]

    stocks.push({
      id: `stock-${index + 1}`,
      accountId: SELLER_IDS[index % SELLER_IDS.length],
      productName: PRODUCT_NAMES[index % PRODUCT_NAMES.length],
      photoUrl: '/ps-5-slim.webp',
      article: `ART-${2000 + index}`,
      nmId: 1_500_000_000 + index,
      sku: `200${String(index).padStart(10, '0')}`,
      size: SIZES[index % SIZES.length],
      warehouseName,
      fulfillmentType,
      quantity: QUANTITIES[index % QUANTITIES.length],
      inWayToClient:
        fulfillmentType === 'fbo' ? (index % 5 === 0 ? 4 + (index % 8) : 0) : 0,
      inWayFromClient:
        fulfillmentType === 'fbo' ? (index % 7 === 0 ? 2 + (index % 3) : 0) : 0,
      updatedAt: hoursAgoIso(index % 18),
    })
  }

  return stocks
}

export const MOCK_STOCKS: StockItem[] = buildMockStocks()
