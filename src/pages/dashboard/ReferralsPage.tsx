import { ArrowLeft, Users, UserPlus, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ReferralsPage() {
  const refData = [
    { id: '1', name: 'alexcrypto', date: '2026-03-10', status: 'Active (Deposited)', bonus: '+$50.00' },
    { id: '2', name: 'johndoe88', date: '2026-03-12', status: 'Pending Deposit', bonus: '$0.00' },
    { id: '3', name: 'whalewatcher', date: '2026-03-15', status: 'Active (Deposited)', bonus: '+$150.00' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
      
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 shadow-sm flex items-center justify-center text-white hover:bg-white/20 transition-all shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Referrals Network</h2>
          <p className="text-fuchsia-100 opacity-90 text-sm mt-0.5">Manage your affiliates and view earned bonuses.</p>
        </div>
      </div>

       {/* Quick Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dark-panel rounded-2xl p-6/80 flex items-center gap-5">
            <div className="w-12 h-12 bg-fuchsia-900/20 text-fuchsia-600 rounded-2xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div><p className="text-slate-500 text-sm font-medium">Total Referrals</p><h3 className="text-2xl font-bold text-white">3</h3></div>
          </div>
          <div className="dark-panel rounded-2xl p-6/80 flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><UserPlus className="w-6 h-6" /></div>
            <div><p className="text-slate-500 text-sm font-medium">Active Referrals</p><h3 className="text-2xl font-bold text-white">2</h3></div>
          </div>
          <div className="dark-panel rounded-2xl p-6/80 flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><Gift className="w-6 h-6" /></div>
            <div><p className="text-slate-500 text-sm font-medium">Total Earned</p><h3 className="text-2xl font-bold text-white">$200.00</h3></div>
          </div>
       </div>

      <div className="dark-panel rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-sm font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-4">Referred User</th>
                <th className="py-4 px-4">Join Date</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right">Bonus Earned</th>
              </tr>
            </thead>
            <tbody>
              {refData.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-semibold text-white">@{item.name}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium">{item.date}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status.includes('Active') 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-white/[0.03] text-slate-500 border-white/[0.08]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-right font-bold ${item.bonus !== '$0.00' ? 'text-emerald-500' : 'text-slate-600'}`}>
                    {item.bonus}
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
