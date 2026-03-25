import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import EmailConfirmedPage from './pages/EmailConfirmedPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SupportWidget from './components/SupportWidget'

// Code-split layouts
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'))
const AdminLayout     = lazy(() => import('./layouts/AdminLayout'))

// Code-split dashboard pages
const DashboardPage    = lazy(() => import('./pages/dashboard/DashboardPage'))
const DepositPage      = lazy(() => import('./pages/dashboard/DepositPage'))
const WithdrawPage     = lazy(() => import('./pages/dashboard/WithdrawPage'))
const TransferPage     = lazy(() => import('./pages/dashboard/TransferPage'))
const CopyTradesPage   = lazy(() => import('./pages/dashboard/CopyTradesPage'))
const HistoryPage      = lazy(() => import('./pages/dashboard/HistoryPage'))
const TransactionsPage = lazy(() => import('./pages/dashboard/TransactionsPage'))
const ReferralsPage    = lazy(() => import('./pages/dashboard/ReferralsPage'))
const ProfilePage      = lazy(() => import('./pages/dashboard/ProfilePage'))
const SettingsPage     = lazy(() => import('./pages/dashboard/SettingsPage'))

// Code-split admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const UsersPage          = lazy(() => import('./pages/admin/UsersPage'))
const UserDetailsPage    = lazy(() => import('./pages/admin/UserDetailsPage'))
const ApprovalsPage      = lazy(() => import('./pages/admin/ApprovalsPage'))
const AdminSupportPage   = lazy(() => import('./pages/admin/AdminSupportPage'))

function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060910' }}>
      <div style={{ width: 32, height: 32, border: '2px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

// Global Auth Handler component to catch stray Supabase hash redirects
function AuthRedirectHandler() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      if (hash.includes('type=recovery')) {
        window.location.replace('/reset-password' + hash)
      } else if (hash.includes('type=signup')) {
        window.location.replace('/email-confirmed' + hash)
      } else if (hash.includes('type=magiclink')) {
        // Magic link signifies login, so go to dashboard
        window.location.replace('/dashboard' + hash)
      }
    }
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthRedirectHandler />
      <Toaster position="top-right" toastOptions={{ style: { background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(168,85,247,0.3)', color: '#fff' } }} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<><RegisterPage /><SupportWidget /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

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
      </Suspense>
    </BrowserRouter>
  )
}

export default App
