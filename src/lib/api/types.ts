export type SellerAccountStatus = 'active' | 'token_expired' | 'error'

export type SellerAccount = {
  id: string
  name: string
  shortName: string
  status: SellerAccountStatus
  lastSyncedAt: string
  hasToken: boolean
}

export type SellerAccountRecord = SellerAccount & {
  token: string
}

export type CreateSellerPayload = {
  name: string
  shortName: string
  token: string
}

export type UpdateSellerPayload = {
  id: string
  name: string
  shortName: string
}

export type UpdateSellerTokenPayload = {
  id: string
  token: string
}

export type OrderStatus =
  'new' | 'confirm' | 'assemble' | 'deliver' | 'cancel' | 'return'

export type OrderItem = {
  id: string
  productName: string
  photoUrl: string
  article: string
  quantity: number
  amount: number
}

export type Order = {
  id: string
  accountId: string
  wbOrderId: string
  status: OrderStatus
  createdAt: string
  amount: number
  items: OrderItem[]
}

export type OrderDetailsItem = OrderItem & {
  nmId: number
  chrtId: number
  sku: string
}

export type OrderDetails = Omit<Order, 'items'> & {
  items: OrderDetailsItem[]
  orderUid: string
  warehouseName: string
  deliveryType: 'fbs'
  supplierStatus: string
  wbStatus: string
  buyerComment: string | null
}

export type OrdersFilters = {
  accountId: string | 'all'
  status: OrderStatus | 'all'
}

export type PaginationParams = {
  offset: number
  limit: number
}

export type PaginatedResult<T> = {
  items: T[]
  nextOffset: number | null
}

export type StockFulfillmentType = 'fbs' | 'fbo'

export type StockLevel = 'in_stock' | 'low' | 'out_of_stock'

export type StockItem = {
  id: string
  accountId: string
  productName: string
  photoUrl: string
  article: string
  nmId: number
  sku: string
  size: string | null
  warehouseName: string
  fulfillmentType: StockFulfillmentType
  quantity: number
  inWayToClient: number
  inWayFromClient: number
  updatedAt: string
}

export type StocksFilters = {
  accountId: string | 'all'
  fulfillmentType: StockFulfillmentType | 'all'
  stockLevel: StockLevel | 'all'
}

export type DashboardPeriod = 'today' | '7d' | '30d'

export type DashboardFilters = {
  period: DashboardPeriod
  accountId: string | 'all'
}

export type DashboardDayPoint = {
  date: string
  label: string
  ordersCount: number
  salesCount: number
  revenue: number
}

export type DashboardStatusPoint = {
  status: OrderStatus
  count: number
}

export type DashboardStocksSummary = {
  skuCount: number
  unitsTotal: number
  inStockCount: number
  lowStockCount: number
  outOfStockCount: number
  fboUnits: number
  fbsUnits: number
  inWayToClient: number
  inWayFromClient: number
}

export type SellerDashboardRow = {
  sellerId: string
  sellerName: string
  shortName: string
  status: SellerAccountStatus
  ordersCount: number
  salesCount: number
  revenue: number
  averageCheck: number
  cancelsCount: number
  returnsCount: number
  cancelRate: number
  returnRate: number
  buyoutRate: number
  stocksSkuCount: number
  stocksUnits: number
  lowStockCount: number
  outOfStockCount: number
  fboUnits: number
  fbsUnits: number
  inWayToClient: number
  inWayFromClient: number
}

export type DashboardStats = {
  period: DashboardPeriod
  accountId: string | 'all'
  ordersCount: number
  salesCount: number
  revenue: number
  averageCheck: number
  cancelsCount: number
  returnsCount: number
  cancelRate: number
  returnRate: number
  buyoutRate: number
  activeSellersCount: number
  problemSellersCount: number
  stocks: DashboardStocksSummary
  bySeller: SellerDashboardRow[]
  ordersTrend: DashboardDayPoint[]
  statusBreakdown: DashboardStatusPoint[]
}
