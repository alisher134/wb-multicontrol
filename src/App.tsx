import { Route, Routes } from 'react-router'

import { AuthLayout } from './components/layouts/AuthLayout'
import { MainLayout } from './components/layouts/MainLayout'
import { routes } from './config/routes'
import { DashboardPage } from './pages/dashboard-page/dashboard-page'
import { LoginPage } from './pages/login-page/LoginPage'
import { OrderDetailsPage } from './pages/order-details-page/order-details-page'
import { OrdersPage } from './pages/orders-page/orders-page'
import { SellersPage } from './pages/sellers-page/sellers-page'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={routes.main} element={<DashboardPage />} />
        <Route path={routes.orders} element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path={routes.sellers} element={<SellersPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={routes.login} element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
