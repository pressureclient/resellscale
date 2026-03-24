import { useState, useEffect } from 'react'
import { Check, X, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ApprovalsPage() {
  const [transactions, setTransactions] = useState<any[]>([])

  const loadTxs = async () => {
    const { data } = await supabase.from('transactions').select('*').order('created_at', { ascending: false })
    if (data) setTransactions(data)
  }

  useEffect(() => {
    loadTxs()
  }, [])

  const handleAction = async (id: string, action: 'Completed' | 'Declined', type: string, amount: number, userId: string) => {
    await supabase.from('transactions').update({ 
      status: action,
      completed_at: new Date().toISOString()
    }).eq('id', id)
    
    if (action === 'Completed') {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (profile) {
         if (type === 'deposit') {
           // Auto-assign trading plan based on deposit tiers
           let newPlan = profile.account_type;
           if (amount >= 500 && amount <= 1999) newPlan = 'Starter Plan';
           else if (amount >= 2000 && amount <= 4999) newPlan = 'Silver Plan';
           else if (amount >= 5000 && amount <= 9999) newPlan = 'Gold Plan';
           else if (amount >= 10000) newPlan = 'Diamond Plan';

           await supabase.from('profiles').update({ 
             balance: Number(profile.balance) + amount,
             total_deposited: Number(profile.total_deposited) + amount,
             account_type: newPlan
           }).eq('id', userId)
         } else if (type === 'withdraw') {
           await supabase.from('profiles').update({ 
             balance: Number(profile.balance) - amount,
             total_withdrawn: Number(profile.total_withdrawn) + amount
           }).eq('id', userId)
         }
      }
    }
    loadTxs()
  }

  const pending = transactions.filter(t => t.status === 'Pending')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Approvals</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve deposits or withdrawals.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Type & Date</th>
                <th className="py-4 px-6">User ID</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6">Asset / Detail</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pending.length > 0 ? (
                pending.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'deposit' ? 'bg-fuchsia-50 text-fuchsia-600' : 'bg-purple-50 text-purple-600'}`}>
                          {tx.type === 'deposit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 capitalize text-sm">{tx.type}</div>
                          <div className="text-xs text-gray-500">{tx.date} {tx.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 font-mono">{tx.user_id.substring(0,8)}...</td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900 text-sm">
                      ${Number(tx.amount || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate">
                      <div className="font-semibold">{tx.asset}</div>
                      {tx.type === 'withdraw' && tx.walletAddress ? (
                        <div className="text-xs text-gray-400 font-mono truncate" title={tx.walletAddress}>{tx.walletAddress}</div>
                      ) : (
                        <div className="text-xs text-gray-400">{tx.network}</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleAction(tx.id, 'Completed', tx.type, Number(tx.amount), tx.user_id)}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAction(tx.id, 'Declined', tx.type, Number(tx.amount), tx.user_id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <p>No pending approvals. You're all caught up!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
