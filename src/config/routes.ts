export const routes = {
  main: '/',
  orders: '/orders',
  orderDetails: (orderId: string) => `/orders/${orderId}`,
  orderDetailsPath: '/orders/:orderId',
  stocks: '/stocks',
  sellers: '/sellers',
  admins: '/admins',
  login: '/login',
}
