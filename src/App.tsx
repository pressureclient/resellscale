import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import DepositPage from './pages/dashboard/DepositPage'
import WithdrawPage from './pages/dashboard/WithdrawPage'
import TransferPage from './pages/dashboard/TransferPage'
import CopyTradesPage from './pages/dashboard/CopyTradesPage'
import HistoryPage from './pages/dashboard/HistoryPage'
import TransactionsPage from './pages/dashboard/TransactionsPage'
import ReferralsPage from './pages/dashboard/ReferralsPage'
import ProfilePage from './pages/dashboard/ProfilePage'
import SettingsPage from './pages/dashboard/SettingsPage'

// Admin
import AdminLayout from './layouts/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import UsersPage from './pages/admin/UsersPage'
import UserDetailsPage from './pages/admin/UserDetailsPage'
import ApprovalsPage from './pages/admin/ApprovalsPage'
import AdminSupportPage from './pages/admin/AdminSupportPage'
import SupportWidget from './components/SupportWidget'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<><RegisterPage /><SupportWidget /></>} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="copy-trades" element={<CopyTradesPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="referrals" element={<ReferralsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="support" element={<AdminSupportPage />} />
        </Route>

        {/* Catch-all redirect to Home/Register */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
