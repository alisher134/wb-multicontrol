export const routes = {
  main: '/',
  orders: '/orders',
  orderDetails: (orderId: string) => `/orders/${orderId}`,
  orderDetailsPath: '/orders/:orderId',
  stocks: '/stocks',
  sellers: '/sellers',
  login: '/login',
}
