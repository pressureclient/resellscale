import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function TransactionsPage() {
  const [txData, setTxData] = useState<any[]>([])

  useEffect(() => {
    const fetchTxs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase.from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        
      if (data) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
        setTxData(data.map(t => ({
          id: t.id,
          type: t.type,
          asset: t.asset,
          amount: Number(t.amount) || 0,
          status: t.status,
          date: new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(t.created_at)),
          time: new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(t.created_at))
        })))
      }
    }
    fetchTxs()
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Transaction History</h2>
          <p className="text-slate-400 text-sm mt-0.5">View all your deposits and withdrawals.</p>
        </div>
      </div>

      <div className="dark-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4">Transaction Details</th>
                <th className="py-4 px-4">Asset</th>
                <th className="py-4 px-4 text-right">Amount</th>
                <th className="py-4 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {txData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: item.type === 'deposit' ? 'rgba(192,38,211,0.12)' : 'rgba(124,58,237,0.12)', border: `1px solid ${item.type === 'deposit' ? 'rgba(192,38,211,0.25)' : 'rgba(124,58,237,0.25)'}` }}>
                        {item.type === 'deposit' ? <ArrowDownRight className="w-4 h-4" style={{ color: '#e879f9' }} /> : <ArrowUpRight className="w-4 h-4" style={{ color: '#a78bfa' }} />}
                      </div>
                      <div>
                        <div className="font-semibold text-white capitalize">{item.type}</div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {item.date} at {item.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-bold text-slate-300">{item.asset}</td>
                  <td className="py-4 px-4 text-right font-bold" style={{ color: item.type === 'deposit' ? '#e879f9' : '#a78bfa' }}>
                    {item.type === 'deposit' ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{
                      background: item.status === 'Completed' ? 'rgba(16,185,129,0.12)' : item.status === 'Declined' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                      border: `1px solid ${item.status === 'Completed' ? 'rgba(16,185,129,0.2)' : item.status === 'Declined' ? 'rgba(239,68,68,0.2)' : 'rgba(251,191,36,0.2)'}`,
                      color: item.status === 'Completed' ? '#34d399' : item.status === 'Declined' ? '#f87171' : '#fbbf24'
                    }}>
                      {item.status}
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
