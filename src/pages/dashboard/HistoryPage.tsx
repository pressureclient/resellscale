import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { usePreferences } from '../../contexts/PreferencesContext'

export default function ProfitHistoryPage() {
  const { formatCurrency } = usePreferences()
  const [profitData, setProfitData] = useState<any[]>([])

  useEffect(() => {
    const fetchProfits = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase.from('profits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        
      if (data) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        setProfitData(data.map(p => ({
          id: p.id,
          plan: p.plan_name,
          amount: Number(p.amount) || 0,
          date: new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(p.created_at)),
          time: new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(p.created_at))
        })))
      }
    }
    fetchProfits()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Profit History</h2>
          <p className="text-slate-400 text-sm mt-0.5">Track your daily returns and investment yields.</p>
        </div>
      </div>

      <div className="dark-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4 whitespace-nowrap">Date & Time</th>
                <th className="py-4 px-4 whitespace-nowrap">Plan Source</th>
                <th className="py-4 px-4 text-right whitespace-nowrap">Amount Earned</th>
                <th className="py-4 px-4 text-center whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {profitData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.date}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {item.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-slate-300">{item.plan}</td>
                  <td className="py-4 px-4 text-right font-bold text-emerald-400">+{formatCurrency(item.amount)}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                      Credited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
