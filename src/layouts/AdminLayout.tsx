import { Outlet, NavLink, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, CheckSquare, LogOut, ShieldAlert, Menu, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ADMIN_EMAILS = [
  'kalifoniafx@gmail.com',
  'truthpressure23@gmail.com',
]

export default function AdminLayout() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div></div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Only allow whitelisted admin emails
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) {
    return <Navigate to="/dashboard" replace />
  }
  
  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/approvals', label: 'Pending Approvals', icon: CheckSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link to="/admin" className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -mr-2 text-slate-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <Link to="/admin" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">Admin Panel</h1>
              <span className="text-xs text-purple-400 font-medium">Resell Scale</span>
            </div>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'} // strict match for root
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white font-medium shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-left"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 sm:p-8 w-full max-w-full overflow-hidden min-w-0">
        <Outlet />
      </main>

    </div>
  )
}
