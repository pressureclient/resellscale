import { Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TopNavigation from '../components/TopNavigation'
import { supabase } from '../lib/supabase'
import SupportWidget from '../components/SupportWidget'

export default function DashboardLayout() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // USER_UPDATED fires after supabase.auth.updateUser() — refreshes name in greeting
      if (event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060910]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
          <span className="text-sm text-slate-500 font-medium tracking-wider">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  const userName = user.user_metadata?.full_name || user.user_metadata?.username || 'Investor'

  return (
    <div className="min-h-screen bg-[#060910] font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Top gradient hero header ── */}
      <div className="relative w-full pt-5 pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d0a6e 30%, #1e0a4a 60%, #0a0618 100%)' }}>

        {/* Mesh grid overlay */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

        {/* Orb glows */}
        <div className="absolute top-[-30%] right-[-5%] w-[50%] h-[120%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-20%] left-[10%] w-[40%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 65%)', filter: 'blur(80px)' }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(217,70,239,0.4), transparent)' }} />

        <div className="max-w-5xl mx-auto relative w-full">
          <TopNavigation userName={userName} />

          {/* Welcome */}
          <div className="mt-2 mb-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 text-[11px] font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)', color: 'rgba(196,181,253,0.8)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Portfolio Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-fuchsia-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              Here is your daily portfolio overview.
            </p>
          </div>
        </div>
      </div>

      {/* Main content — overlaps header */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-20">
        <Outlet />
      </main>
      <SupportWidget />
    </div>
  )
}
