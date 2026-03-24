import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AuthPage.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  /* Supabase embeds the recovery token in the URL hash.
     We listen for the PASSWORD_RECOVERY event which fires
     automatically when the page loads with that token. */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#060910] flex items-center justify-center p-6 auth-noise auth-mesh">
      <div className="absolute top-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none animate-orb"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full pointer-events-none animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(192,38,211,0.07) 50%, transparent 70%)', filter: 'blur(100px)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-purple-500/20 shadow-lg glow-pulse">
            <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
          </div>
          <div className="text-[18px] font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-8 sm:p-10 auth-enter">
          {done ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Password Updated!</h2>
              <p className="text-slate-400 text-sm mb-6">Your password has been changed. Redirecting you to login…</p>
              <Link to="/login"
                className="block w-full py-3.5 rounded-xl font-bold text-sm text-white text-center transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                Go to Login →
              </Link>
            </div>
          ) : !sessionReady ? (
            /* ── Waiting for token ── */
            <div className="text-center py-4">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Verifying your reset link…</p>
              <p className="text-slate-600 text-xs mt-2">If nothing happens, the link may have expired. <Link to="/login" className="text-purple-400 hover:text-fuchsia-300">Request a new one.</Link></p>
            </div>
          ) : (
            /* ── Password form ── */
            <>
              <div className="mb-7">
                <h1 className="text-3xl font-black text-white tracking-tight mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Set New Password
                </h1>
                <p className="text-sm text-slate-400">Choose a strong password for your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="field-wrap">
                  <label className="field-label">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="auth-input pr-12"
                    />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-300 transition-colors">
                      {showPass
                        ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="field-wrap">
                  <label className="field-label">Confirm Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Repeat password"
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="auth-input"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-[14px] text-sm text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="auth-btn mt-2">
                  <span>
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>Update Password <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
