import { Navigate, Route, Routes } from 'react-router-dom'
import CustomerMenuPage from '../pages/CustomerMenuPage'
import CustomerWelcomePage from '../pages/CustomerWelcomePage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/qr/:token" element={<CustomerWelcomePage />} />
      <Route path="/qr/:token/menu" element={<CustomerMenuPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}