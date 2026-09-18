import type {
  AdminRole,
  DashboardPeriod,
  OrderStatus,
  SellerAccountStatus,
  StockFulfillmentType,
  StockLevel,
} from './types'

const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  LEAD_ADMIN: 'Главный админ',
  ADMIN: 'Админ',
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirm: 'На сборке',
  assemble: 'Собирается',
  deliver: 'В доставке',
  cancel: 'Отменён',
  return: 'Возврат',
}

const DASHBOARD_PERIOD_LABELS: Record<DashboardPeriod, string> = {
  today: 'Сегодня',
  '7d': '7 дней',
  '30d': '30 дней',
}

const SELLER_STATUS_LABELS: Record<SellerAccountStatus, string> = {
  active: 'Активен',
  token_expired: 'Токен истёк',
  error: 'Ошибка',
}

const STOCK_FULFILLMENT_LABELS: Record<StockFulfillmentType, string> = {
  fbs: 'Склад продавца',
  fbo: 'Склад WB',
}

const STOCK_LEVEL_LABELS: Record<StockLevel, string> = {
  in_stock: 'В наличии',
  low: 'Мало',
  out_of_stock: 'Нет в наличии',
}

export function getAdminRoleLabel(role: AdminRole): string {
  return ADMIN_ROLE_LABELS[role]
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status]
}

export function getDashboardPeriodLabel(period: DashboardPeriod): string {
  return DASHBOARD_PERIOD_LABELS[period]
}

export function getSellerStatusLabel(status: SellerAccountStatus): string {
  return SELLER_STATUS_LABELS[status]
}

export function getStockFulfillmentLabel(
  fulfillmentType: StockFulfillmentType,
): string {
  return STOCK_FULFILLMENT_LABELS[fulfillmentType]
}

export function getStockLevelLabel(stockLevel: StockLevel): string {
  return STOCK_LEVEL_LABELS[stockLevel]
}
