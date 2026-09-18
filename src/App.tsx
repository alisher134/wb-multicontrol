import { Route, Routes } from 'react-router'
import { MainPage } from './pages/main-page/MainPage'
import { routes } from './config/routes'
import { LoginPage } from './pages/login-page/LoginPage'
import { AuthLayout } from './components/layouts/AuthLayout'
import { MainLayout } from './components/layouts/MainLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={routes.main} element={<MainPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={routes.login} element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
