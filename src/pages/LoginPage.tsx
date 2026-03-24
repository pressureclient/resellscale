import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AuthPage.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      })
      if (signInError) throw signInError
      localStorage.setItem('rc_user_email', form.email.trim())
      window.location.href = '/dashboard'
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!form.email.trim()) {
      setError('Please enter your email address first.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) throw resetError
      // Hacky success message reusing error state for simplicity in Auth UI
      setError('✓ Password reset link sent! Check your email.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="relative min-h-screen bg-[#060910] flex font-sans overflow-hidden text-gray-100 auth-noise auth-mesh">

      {/* ── Deep background orbs ── */}
      <div className="absolute top-[-25%] left-[-15%] w-[55%] h-[55%] rounded-full pointer-events-none animate-orb"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full pointer-events-none animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(192,38,211,0.07) 50%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute top-[35%] right-[20%] w-[30%] h-[30%] rounded-full pointer-events-none animate-orb-3"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(70px)' }} />

      {/* ═══════════════════════════════════════
          LEFT PANEL — Branding & Features
      ═══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative z-10 border-r border-white/[0.05] panel-enter"
        style={{ background: 'linear-gradient(160deg, rgba(15,20,35,0.95) 0%, rgba(10,13,22,0.98) 100%)', backdropFilter: 'blur(20px)' }}>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(217,70,239,0.3), transparent)' }} />

        <div className="flex flex-col h-full p-12">
          {/* Brand mark */}
          <div className="flex items-center gap-3.5 auth-enter">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-purple-500/20 shadow-lg shadow-purple-900/30 glow-pulse">
                <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400/60 select-none">Trading Platform</div>
              <div className="text-[18px] font-extrabold tracking-tight text-white select-none leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            <div className="auth-enter auth-enter-delay-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-[11px] font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: 'rgba(196,181,253,0.8)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Institutional-Grade Platform
              </div>

              <h2 className="text-5xl font-black tracking-tight leading-[1.08] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Welcome<br />
                <span className="bg-gradient-to-br from-fuchsia-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  back.
                </span>
              </h2>
              <p className="text-[0.9rem] text-slate-400 leading-relaxed max-w-[300px]">
                Sign in to continue growing your portfolio with precision-driven strategies.
              </p>
            </div>

            {/* Feature rows */}
            <div className="mt-12 space-y-4 auth-enter auth-enter-delay-2">
              {[
                {
                  icon: (
                    <svg className="w-4.5 h-4.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  title: 'Live Portfolio Tracking',
                  desc: 'Real-time P&L, balance & asset breakdown',
                },
                {
                  icon: (
                    <svg className="w-4.5 h-4.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: 'Bank-Grade Security',
                  desc: 'Multi-sig cold storage & 2FA protection',
                },
                {
                  icon: (
                    <svg className="w-4.5 h-4.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Daily Yield Payouts',
                  desc: 'Profits compound automatically every 24h',
                },
              ].map((f, i) => (
                <div key={i} className="feature-row flex items-center gap-4 group cursor-default">
                  <div className="feature-icon-ring">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">{f.title}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-3 auth-enter auth-enter-delay-3">
              {[
                { val: '$42.5M', label: 'TVL' },
                { val: '12K+', label: 'Investors' },
                { val: '14.2%', label: 'Avg. APY' },
              ].map((s, i) => (
                <div key={i} className="stat-card text-center">
                  <div className="text-xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.val}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-600 border-t border-white/[0.05] pt-6 auth-enter auth-enter-delay-4">
            &copy; {new Date().getFullYear()} Resellscale. All rights reserved.
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — Login Form
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10 auth-enter">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-purple-500/20 shadow-lg glow-pulse">
              <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400/60">Platform</div>
              <div className="text-base font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
              </div>
            </div>
          </div>

          {/* Glass form card */}
          <div className="glass-panel rounded-[24px] p-8 sm:p-10 auth-enter auth-enter-delay-1">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Sign In
              </h1>
              <p className="text-sm text-slate-400">Enter your credentials to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="field-wrap">
                <label htmlFor="login-email" className="field-label">Email Address</label>
                <input
                  id="login-email" name="email" type="email"
                  placeholder="name@example.com" required
                  value={form.email} onChange={handleChange}
                  className="auth-input"
                />
              </div>

              {/* Password */}
              <div className="field-wrap">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="field-label !mb-0">Password</label>
                  <button type="button" onClick={handleResetPassword} className="text-[11px] font-semibold text-purple-400 hover:text-fuchsia-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password" name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password" required
                    value={form.password} onChange={handleChange}
                    className="auth-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-300 transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-[14px] text-sm text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="auth-btn mt-2">
                <span>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="auth-divider my-7">
              <span className="text-[11px] text-slate-600 font-medium tracking-wider uppercase">New here?</span>
            </div>

            {/* Sign up link */}
            <Link to="/"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[14px] text-sm font-semibold text-slate-300 transition-all duration-200 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
              Create a free account
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
