import type {
  Order,
  OrderDetails,
  OrderDetailsItem,
  OrderStatus,
} from '../types'

const WAREHOUSES = [
  'Коледино',
  'Электросталь',
  'Казань',
  'Краснодар',
  'Санкт-Петербург',
]

const WB_STATUS_BY_ORDER_STATUS: Record<OrderStatus, string> = {
  new: 'waiting',
  confirm: 'waiting',
  assemble: 'sorted',
  deliver: 'sold',
  cancel: 'canceled',
  return: 'returned',
}

const SUPPLIER_STATUS_BY_ORDER_STATUS: Record<OrderStatus, string> = {
  new: 'new',
  confirm: 'confirm',
  assemble: 'complete',
  deliver: 'complete',
  cancel: 'cancel',
  return: 'complete',
}

const BUYER_COMMENTS = [
  null,
  'Упакуйте в плёнку, пожалуйста',
  'Позвоните перед доставкой',
  null,
  'Нужна подарочная упаковка',
]

function parseOrderIndex(orderId: string): number {
  const match = /^order-(\d+)$/.exec(orderId)
  if (match == null) {
    return 0
  }

  return Number.parseInt(match[1], 10)
}

function mapOrderItemsToDetails(
  order: Order,
  orderIndex: number,
): OrderDetailsItem[] {
  return order.items.map((item, itemIndex) => ({
    ...item,
    nmId: 100_000_000 + orderIndex * 10 + itemIndex,
    chrtId: 200_000_000 + orderIndex * 10 + itemIndex,
    sku: `6665956397${String(512 + orderIndex * 10 + itemIndex).slice(-3)}`,
  }))
}

export function mapOrderToDetails(order: Order): OrderDetails {
  const index = parseOrderIndex(order.id)

  return {
    id: order.id,
    accountId: order.accountId,
    wbOrderId: order.wbOrderId,
    status: order.status,
    createdAt: order.createdAt,
    amount: order.amount,
    items: mapOrderItemsToDetails(order, index),
    orderUid: `${order.wbOrderId}_${order.accountId.replace('seller-', 's')}`,
    warehouseName: WAREHOUSES[index % WAREHOUSES.length],
    deliveryType: 'fbs',
    supplierStatus: SUPPLIER_STATUS_BY_ORDER_STATUS[order.status],
    wbStatus: WB_STATUS_BY_ORDER_STATUS[order.status],
    buyerComment: BUYER_COMMENTS[index % BUYER_COMMENTS.length],
  }
}
