import { ArrowLeft, TrendingUp, Zap, Star, Crown, Shield, Rocket, Gem, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    id: 'starter', name: 'Starter', icon: Zap,
    minDeposit: 500, maxDeposit: 1999,
    dailyROI: 1.5, duration: 30, totalReturn: 45,
    accentStart: '#38bdf8', accentEnd: '#3b82f6',
    badge: null,
    features: ['Daily profit payouts', 'Cancel anytime', 'Basic market analytics'],
  },
  {
    id: 'basic', name: 'Basic', icon: Shield,
    minDeposit: 2000, maxDeposit: 4999,
    dailyROI: 2.0, duration: 30, totalReturn: 60,
    accentStart: '#34d399', accentEnd: '#10b981',
    badge: null,
    features: ['Daily profit payouts', 'Priority support', 'Portfolio tracking'],
  },
  {
    id: 'silver', name: 'Silver', icon: Star,
    minDeposit: 5000, maxDeposit: 9999,
    dailyROI: 2.5, duration: 30, totalReturn: 75,
    accentStart: '#a78bfa', accentEnd: '#7c3aed',
    badge: 'Popular',
    features: ['Daily profit payouts', 'Dedicated account manager', 'Advanced analytics', 'Early withdrawal option'],
  },
  {
    id: 'gold', name: 'Gold', icon: Crown,
    minDeposit: 10000, maxDeposit: 24999,
    dailyROI: 3.0, duration: 30, totalReturn: 90,
    accentStart: '#fbbf24', accentEnd: '#f59e0b',
    badge: 'Top Rated',
    features: ['Daily profit payouts', 'VIP account manager', 'Real-time signals', 'Compound interest', 'Monthly bonus'],
  },
  {
    id: 'platinum', name: 'Platinum', icon: Rocket,
    minDeposit: 25000, maxDeposit: 49999,
    dailyROI: 3.5, duration: 30, totalReturn: 105,
    accentStart: '#e879f9', accentEnd: '#c026d3',
    badge: 'Best Value',
    features: ['Daily profit payouts', 'Priority VIP support', 'Exclusive market insights', 'Compound interest', 'Referral boost +2%'],
  },
  {
    id: 'elite', name: 'Elite', icon: Gem,
    minDeposit: 50000, maxDeposit: 100000,
    dailyROI: 4.0, duration: 30, totalReturn: 120,
    accentStart: '#fb7185', accentEnd: '#e11d48',
    badge: 'Exclusive',
    features: ['Daily profit payouts', 'Personal relationship manager', 'Private investment signals', 'Compound interest', 'Zero withdrawal fees', 'Quarterly bonus up to 5%'],
  },
]

export default function CopyTradesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Investment Plans
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Choose a plan and start earning daily returns on your capital.</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const Icon = plan.icon
          const estProfit = plan.minDeposit * (plan.totalReturn / 100)
          const grad = `linear-gradient(135deg, ${plan.accentStart}, ${plan.accentEnd})`

          return (
            <div key={plan.id}
              className="relative rounded-2xl p-6 flex flex-col overflow-hidden group transition-all duration-300 hover:-translate-y-1.5"
              style={{
                background: 'rgba(13,17,25,0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              }}>

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: grad }} />

              {/* Hover corner glow */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${plan.accentStart}30, transparent)`, filter: 'blur(16px)' }} />

              {/* Badge */}
              {plan.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ background: grad, boxShadow: `0 2px 8px ${plan.accentStart}40` }}>
                  {plan.badge}
                </span>
              )}

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white mb-5 shrink-0"
                style={{ background: grad, boxShadow: `0 4px 16px ${plan.accentStart}35` }}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Name + range */}
              <h3 className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {plan.name} Plan
              </h3>
              <p className="text-xs text-slate-500 mb-5 font-medium">
                ${plan.minDeposit.toLocaleString()} – ${plan.maxDeposit.toLocaleString()}
              </p>

              {/* ROI hero number */}
              <div className="flex items-end gap-1.5 mb-5">
                <span className="text-4xl font-black bg-clip-text text-transparent"
                  style={{ backgroundImage: grad, fontFamily: 'Outfit, sans-serif' }}>
                  {plan.dailyROI}%
                </span>
                <span className="text-slate-500 text-sm pb-1.5 font-medium">/ day</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { label: 'Duration', value: `${plan.duration} days`, color: 'text-slate-300' },
                  { label: 'Total ROI', valueEl: (
                    <span className="flex items-center justify-center gap-0.5 text-emerald-400 font-bold text-sm">
                      <TrendingUp className="w-3 h-3" />~{plan.totalReturn}%
                    </span>
                  )},
                ].map((s, i) => (
                  <div key={i} className="rounded-xl px-3 py-2.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-0.5">{s.label}</p>
                    {s.valueEl ?? <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>}
                  </div>
                ))}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-slate-400">
                    <span className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${plan.accentStart}20`, border: `1px solid ${plan.accentStart}40` }}>
                      <Check className="w-2.5 h-2.5" style={{ color: plan.accentStart }} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Est. profit note */}
              <p className="text-[11px] text-slate-600 mb-4">
                Est. profit from <span className="text-slate-400 font-semibold">${plan.minDeposit.toLocaleString()}</span>:{' '}
                <span className="text-emerald-400 font-bold">${estProfit.toLocaleString()}</span> in {plan.duration} days
              </p>

              {/* CTA */}
              <Link to="/dashboard/deposit"
                className="block text-center w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                style={{ background: grad, boxShadow: `0 4px 16px ${plan.accentStart}30` }}>
                Invest Now
              </Link>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-600 pb-4">
        All plans run for 30 days. Returns are credited daily to your account balance. Past performance is not indicative of future results.
      </p>
    </div>
  )
}
