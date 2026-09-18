import type { StockLevel } from './types'

export const LOW_STOCK_THRESHOLD = 10

export function getStockLevel(quantity: number): StockLevel {
  if (quantity <= 0) {
    return 'out_of_stock'
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return 'low'
  }

  return 'in_stock'
}
