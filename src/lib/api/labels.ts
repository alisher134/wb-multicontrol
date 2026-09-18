import type { OrderStatus, SellerAccountStatus } from './types'

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirm: 'На сборке',
  assemble: 'Собирается',
  deliver: 'В доставке',
  cancel: 'Отменён',
  return: 'Возврат',
}

const SELLER_STATUS_LABELS: Record<SellerAccountStatus, string> = {
  active: 'Активен',
  token_expired: 'Токен истёк',
  error: 'Ошибка',
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status]
}

export function getSellerStatusLabel(status: SellerAccountStatus): string {
  return SELLER_STATUS_LABELS[status]
}
