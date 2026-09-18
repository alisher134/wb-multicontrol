import type { Order } from '@/lib/api'

export function getOrderItemsCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getPositionsLabel(count: number): string {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} позиция`
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} позиции`
  }

  return `${count} позиций`
}
