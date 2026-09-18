export const routes = {
  main: '/',
  orders: '/orders',
  orderDetails: (orderId: string) => `/orders/${orderId}`,
  sellers: '/sellers',
  login: '/login',
}
