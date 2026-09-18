import { Route, Routes } from 'react-router'

import { AuthLayout } from './components/layouts/auth-layout'
import { MainLayout } from './components/layouts/main-layout'
import { routes } from './config/routes'
import { AdminsPage } from './pages/admins-page/admins-page'
import { DashboardPage } from './pages/dashboard-page/dashboard-page'
import { LoginPage } from './pages/login-page/login-page'
import { OrderDetailsPage } from './pages/order-details-page/order-details-page'
import { OrdersPage } from './pages/orders-page/orders-page'
import { SellersPage } from './pages/sellers-page/sellers-page'
import { StocksPage } from './pages/stocks-page/stocks-page'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={routes.main} element={<DashboardPage />} />
        <Route path={routes.orders} element={<OrdersPage />} />
        <Route path={routes.orderDetailsPath} element={<OrderDetailsPage />} />
        <Route path={routes.stocks} element={<StocksPage />} />
        <Route path={routes.sellers} element={<SellersPage />} />
        <Route path={routes.admins} element={<AdminsPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={routes.login} element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
