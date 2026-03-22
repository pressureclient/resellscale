import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Layers, User, X, LogOut, Home, ArrowDownCircle, ArrowUpCircle, Clock, History, Send, Wallet, Settings, Users, ShieldAlert } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function TopNavigation({ userName }: { userName: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  const navLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Deposit', href: '/dashboard/deposit', icon: ArrowDownCircle },
    { name: 'Trading Plans', href: '/dashboard/copy-trades', icon: Layers },
    { name: 'Withdraw', href: '/dashboard/withdraw', icon: ArrowUpCircle },
    { name: 'Profit History', href: '/dashboard/history', icon: History },
    { name: 'Transactions', href: '/dashboard/transactions', icon: Clock },
    { name: 'Transfer Funds', href: '/dashboard/transfer', icon: Send },
    { name: 'My Plans', href: '/dashboard', icon: Wallet },
    { name: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const ADMIN_EMAILS = ['kalifoniafx@gmail.com', 'truthpressure23@gmail.com']
  const currentUserEmail = localStorage.getItem('rc_user_email') || ''
  if (ADMIN_EMAILS.includes(currentUserEmail.toLowerCase())) {
    navLinks.push({ name: 'Admin Panel', href: '/admin', icon: ShieldAlert })
  }

  const handleSignout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('rc_user_name')
    localStorage.removeItem('rc_user_email')
    window.location.href = '/login'
  }

  return (
    <>
      <div className="flex justify-between items-center text-white mb-10 relative w-full">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-purple-400/30 shadow-lg shadow-purple-900/40 shrink-0">
            <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-[10px] tracking-[0.2em] text-purple-300/60 font-bold uppercase">Trading Platform</div>
            <div className="text-sm font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-xl transition-all flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          <div className="relative z-[10000]">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-sm text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #c026d3, #7c3aed)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 16px rgba(192,38,211,0.35)'
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl py-2 overflow-hidden"
                style={{
                  background: 'rgba(13,17,25,0.95)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset'
                }}>
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)' }} />

                <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate">{userName}</p>
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Online
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-1 px-2">
                  {[
                    { to: '/dashboard/profile', icon: User, label: 'My Profile' },
                    { to: '/dashboard/settings', icon: Settings, label: 'Account Settings' },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to} onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white font-medium transition-all"
                      style={{ ':hover': { background: 'rgba(168,85,247,0.1)' } } as any}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.1)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <Icon className="w-4 h-4 text-purple-400 shrink-0" /> {label}
                    </Link>
                  ))}
                </div>

                <div className="px-2 py-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={handleSignout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 font-medium transition-all"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                    <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark overlay */}
      {(isSidebarOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-[9999] transition-all duration-300"
          style={{ background: 'rgba(4,6,10,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => { setIsSidebarOpen(false); setIsProfileOpen(false) }}
        />
      )}

      {/* Dark slide-out sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 z-[10000] flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'rgba(9,11,18,0.97)',
          backdropFilter: 'blur(40px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '24px 0 80px rgba(0,0,0,0.8)'
        }}>

        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)' }} />

        {/* Sidebar header */}
        <div className="p-5 flex justify-between items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-purple-400/20 shrink-0">
              <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-purple-400/60">Platform</div>
              <div className="text-sm font-extrabold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.name + link.href}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all text-sm"
                style={{
                  background: isActive ? 'rgba(168,85,247,0.12)' : 'transparent',
                  color: isActive ? '#d8b4fe' : 'rgba(148,163,184,0.8)',
                  border: isActive ? '1px solid rgba(168,85,247,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#e2e8f0' } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(148,163,184,0.8)' } }}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" style={{ color: isActive ? '#c084fc' : 'rgba(100,116,139,0.8)' }} />
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Sidebar footer */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleSignout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-red-400 transition-all"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.12)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.06)'}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
