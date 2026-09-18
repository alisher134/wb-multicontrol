export type SellerAccountStatus = 'active' | 'token_expired' | 'error'

export type SellerAccount = {
  id: string
  name: string
  shortName: string
  status: SellerAccountStatus
  lastSyncedAt: string
}

export type OrderStatus =
  'new' | 'confirm' | 'assemble' | 'deliver' | 'cancel' | 'return'

export type Order = {
  id: string
  accountId: string
  wbOrderId: string
  status: OrderStatus
  createdAt: string
  amount: number
  article: string
  productName: string
}

export type OrderDetails = Order & {
  orderUid: string
  nmId: number
  chrtId: number
  sku: string
  warehouseName: string
  deliveryType: 'fbs'
  supplierStatus: string
  wbStatus: string
  buyerComment: string | null
  quantity: number
}

export type OrdersFilters = {
  accountId: string | 'all'
  status: OrderStatus | 'all'
}

export type SellerDashboardRow = {
  sellerId: string
  sellerName: string
  shortName: string
  ordersCount: number
  revenue: number
}

export type DashboardDayPoint = {
  date: string
  label: string
  ordersCount: number
  revenue: number
}

export type DashboardStatusPoint = {
  status: OrderStatus
  count: number
}

export type DashboardStats = {
  ordersToday: number
  revenueToday: number
  returnsCount: number
  problemSellersCount: number
  bySeller: SellerDashboardRow[]
  ordersTrend: DashboardDayPoint[]
  statusBreakdown: DashboardStatusPoint[]
}
