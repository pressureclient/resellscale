import { useState, useEffect, useRef, memo } from 'react'
import { Wallet, TrendingUp, Gift, Users, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart2, Activity, Copy, Clock, ShieldCheck, History as HistoryIcon, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const TradingViewWidget = memo(() => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)

  // Only mount the widget once the panel scrolls into view
  useEffect(() => {
    if (!wrapperRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { rootMargin: '200px' }
    )
    observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || !container.current) return
    container.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    script.onload = () => setLoaded(true)
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: 'BINANCE:BTCUSDT', interval: '15',
      timezone: 'Etc/UTC', theme: 'dark', style: '1', locale: 'en',
      allow_symbol_change: true, calendar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: 'rgba(6,9,16,0)',
    })
    container.current.appendChild(script)
    // Widget doesn't fire onload reliably, so we fall back to a short delay
    const t = setTimeout(() => setLoaded(true), 3000)
    return () => clearTimeout(t)
  }, [inView])

  return (
    <div ref={wrapperRef} className="relative rounded-2xl overflow-hidden" style={{ height: '480px', width: '100%' }}>
      {(!loaded || !inView) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
          style={{ background: 'rgba(6,9,16,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
          <p className="text-xs text-slate-500">Loading live market data…</p>
        </div>
      )}
      <div className="tradingview-widget-container h-full w-full">
        <div className="tradingview-widget-container__widget h-full w-full" ref={container} />
      </div>
    </div>
  )
})

/* ── Dark glass stat card ── */
function PremiumCard({ title, amount, subtitle, icon: Icon, trend, accent }: any) {
  return (
    <div className="relative rounded-2xl p-5 overflow-hidden group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(13,17,25,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}44, transparent)` }} />
      {/* Corner glow */}
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)`, filter: 'blur(12px)' }} />

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
            <TrendingUp className="w-3 h-3" /> +{trend}%
          </div>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">{title}</p>
        <div className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
          <span className="text-slate-500 font-normal text-lg mr-0.5">$</span>
          {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        {subtitle && <p className="text-xs font-medium text-slate-600">{subtitle}</p>}
      </div>
    </div>
  )
}

/* ── Dark glass panel wrapper ── */
const Panel = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(13,17,25,0.7)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
    {children}
  </div>
)

export default function DashboardPage() {
  const [balance, setBalance] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalDeposited, setTotalDeposited] = useState(0)
  const [activePlan, setActivePlan] = useState<string | null>(null)
  const [recentTxs, setRecentTxs] = useState<any[]>([])
  const [refCopied, setRefCopied] = useState(false)
  const [username, setUsername] = useState('invite')

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [
        { data: profile },
        { data: txs },
        { data: profits }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('profits').select('plan_name').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ])

      if (profile) {
        setBalance(Number(profile.balance) || 0)
        setTotalProfit(Number(profile.total_profit) || 0)
        setTotalDeposited(Number(profile.total_deposited) || 0)
        setUsername(profile.username || user.user_metadata?.username || btoa(user.email || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 10))
      }

      if (txs) {
        setRecentTxs(txs.map(t => {
          const timestampToUse = (t.status === 'completed' && t.completed_at) ? t.completed_at : t.created_at;
          return {
            id: t.id, type: t.type, amount: Number(t.amount) || 0,
            status: t.status, date: new Date(timestampToUse).toLocaleDateString()
          }
        }))
      }

      if (profile?.account_type && profile.account_type !== 'Standard' && profile.account_type !== '') {
        setActivePlan(profile.account_type.replace(/ (Plan|Package)$/i, ''))
      } else if (profits && profits.length > 0) {
        setActivePlan(profits[0].plan_name.replace(/ (Plan|Package)$/i, ''))
      }
    }
    fetchData()
  }, [])

  const refLink = `${window.location.origin}/?ref=${username}`
  const handleCopyRef = () => {
    navigator.clipboard.writeText(refLink)
    setRefCopied(true)
    setTimeout(() => setRefCopied(false), 2000)
  }

  return (
    <div className="space-y-6">

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-3 -mt-2 mb-2">
        {[
          { to: '/dashboard/deposit', icon: ArrowDownRight, label: 'Deposit Funds', accent: '#c026d3' },
          { to: '/dashboard/withdraw', icon: ArrowUpRight, label: 'Withdraw', accent: '#7c3aed' },
        ].map(({ to, icon: Icon, label, accent }) => (
          <Link key={to} to={to}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{
              background: 'rgba(13,17,25,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}1a`, border: `1px solid ${accent}33` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
            </div>
            {label}
          </Link>
        ))}
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PremiumCard title="Account Balance" amount={balance} icon={Wallet} trend={(() => { const base = totalDeposited > 0 ? totalDeposited : (balance - totalProfit > 0 ? balance - totalProfit : balance); return (totalProfit > 0 && base > 0) ? ((totalProfit / base) * 100).toFixed(1).replace(/\.0$/, '') : undefined })()} accent="#c026d3" />
        <PremiumCard title="Total Profit" amount={totalProfit} icon={BarChart2} subtitle="All time earnings" accent="#10b981" />
        <PremiumCard title="Total Deposited" amount={totalDeposited} icon={Gift} subtitle="Lifetime deposits" accent="#f59e0b" />
        <PremiumCard title="Referral Rewards" amount={0} icon={Users} subtitle="From 0 affiliates" accent="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Active investments */}
        <Panel className="lg:col-span-2 p-7">
          <div className="flex justify-between items-center mb-7">
            <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <Activity className="w-5 h-5 text-purple-400" /> Active Investments
            </h2>
            <Link to={activePlan ? '/dashboard/history' : '/dashboard/copy-trades'}
              className="text-sm font-semibold text-purple-400 hover:text-fuchsia-300 flex items-center gap-1 transition-colors group">
              {activePlan ? 'View Yields' : 'Explore Plans'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="rounded-xl p-10 flex flex-col items-center justify-center text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            {activePlan ? (
              <>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{activePlan} Plan</h3>
                <p className="text-slate-500 text-sm">Your capital is actively generating returns.</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-slate-300 font-semibold mb-2">No Active Plans</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-[240px]">
                  Your portfolio is empty. Purchase an investment plan to start generating daily yields.
                </p>
                <Link to="/dashboard/copy-trades"
                  className="px-7 py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #c026d3, #7c3aed)',
                    boxShadow: '0 4px 16px rgba(192,38,211,0.3)'
                  }}>
                  Explore Plans
                </Link>
              </>
            )}
          </div>
        </Panel>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Referral card */}
          <div className="rounded-2xl p-6 relative overflow-hidden text-white"
            style={{
              background: 'linear-gradient(135deg, #2d0a6e 0%, #1a0533 50%, #0d0a2e 100%)',
              border: '1px solid rgba(168,85,247,0.2)',
              boxShadow: '0 8px 32px rgba(168,85,247,0.15)'
            }}>
            <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #c026d3, transparent)', filter: 'blur(20px)', transform: 'translate(30%, -30%)' }} />
            <h2 className="text-base font-bold mb-1.5 relative z-10">Refer & Earn 10%</h2>
            <p className="text-purple-200/70 text-xs mb-4 relative z-10 leading-relaxed">
              Share your invite link and earn a percentage of your friends' first deposit.
            </p>
            <div className="relative z-10 flex items-center rounded-xl border p-1"
              style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <input type="text" readOnly value={refLink}
                className="bg-transparent text-white/70 w-full px-3 py-1.5 text-xs focus:outline-none truncate" />
              <button onClick={handleCopyRef}
                className="p-2 rounded-lg transition-colors shrink-0"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                {refCopied ? <Check className="w-4 h-4 text-fuchsia-300" /> : <Copy className="w-4 h-4 text-white" />}
              </button>
            </div>
            {refCopied && <p className="relative z-10 text-xs text-fuchsia-300 mt-2 text-center">Link copied!</p>}
          </div>

          {/* Recent activity */}
          <Link to="/dashboard/transactions">
            <Panel className="p-5 block hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2 group-hover:text-purple-300 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <Clock className="w-4 h-4 text-purple-400" /> Recent Activity
                </h2>
              </div>
              <div className="flex flex-col">
                {recentTxs.length > 0 ? recentTxs.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-3 last:pb-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: tx.type === 'deposit' ? 'rgba(192,38,211,0.1)' : 'rgba(124,58,237,0.1)',
                          border: `1px solid ${tx.type === 'deposit' ? 'rgba(192,38,211,0.2)' : 'rgba(124,58,237,0.2)'}`
                        }}>
                        {tx.type === 'deposit'
                          ? <ArrowDownRight className="w-4 h-4 text-fuchsia-400" />
                          : <ArrowUpRight className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm capitalize">{tx.type}</div>
                        <div className="text-xs text-slate-500">{tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: tx.type === 'deposit' ? '#e879f9' : '#a78bfa' }}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.7)' }}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-6 text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <HistoryIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <p className="text-sm text-slate-600">No recent transactions</p>
                  </div>
                )}
              </div>
            </Panel>
          </Link>
        </div>
      </div>

      {/* Live chart */}
      <Panel className="p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Live Market Data</h2>
          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 px-3 py-1 rounded-full"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Markets Open
          </span>
        </div>
        <TradingViewWidget />
      </Panel>
    </div>
  )
}
