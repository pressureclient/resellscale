import { Link } from 'react-router-dom'
import '../pages/AuthPage.css'

export default function EmailConfirmedPage() {
  return (
    <div className="relative min-h-screen bg-[#060910] flex items-center justify-center font-sans overflow-hidden text-gray-100 auth-noise auth-mesh p-5 sm:p-8">
      {/* Deep background orbs */}
      <div className="absolute top-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none animate-orb"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full pointer-events-none animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(192,38,211,0.07) 50%, transparent 70%)', filter: 'blur(100px)' }} />

      <div className="w-full max-w-[480px] glass-panel rounded-[24px] p-8 sm:p-12 text-center relative z-10 auth-enter">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border-2 border-emerald-500/30"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.05))', boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}>
          <svg className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-black text-white px-2 tracking-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Email Confirmed!
        </h1>
        
        <p className="text-base text-slate-300 leading-relaxed mb-8">
          Your email has been successfully verified. You can now close this tab and go back to your previous tab to log in.
        </p>
        
        <button
          onClick={() => window.close()}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 mb-4"
          style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}
        >
          Close Tab
        </button>

        <div className="auth-divider mt-2 mb-4">
          <span className="text-[11px] text-slate-600 font-medium tracking-wider uppercase">Or</span>
        </div>

        <Link to="/login"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[14px] text-sm font-semibold text-slate-300 transition-all duration-200 hover:text-white"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
          Proceed to Login
        </Link>
      </div>
    </div>
  )
}
