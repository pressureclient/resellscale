import { ArrowLeft, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TransferPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
      
      {/* Header Area */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 shadow-sm flex items-center justify-center text-white hover:bg-white/20 transition-all shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Fund Transfer</h2>
          <p className="text-fuchsia-100 opacity-90 text-sm mt-0.5">Transfer funds to another user</p>
        </div>
      </div>

      <div className="dark-panel rounded-2xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Account Balance Widget */}
        <div className="border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center justify-center mb-10 bg-white/[0.02]">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-slate-400">
             <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">$0.00</h3>
          <p className="text-slate-500 text-sm font-medium">Your Account Balance</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Recipient Email or username <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              className="w-full bg-white border border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Amount($) <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Enter amount you want to transfer to recipient"
              className="w-full bg-white border border-white/[0.08] rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:text-slate-600 placeholder:font-normal placeholder:text-sm"
            />
          </div>

          <div className="text-sm font-bold text-slate-200">
             Transfer Charges: <span className="text-red-500">2%</span>
          </div>

          <div className="pt-4">
            <button type="button" className="w-full bg-[#d946ef] hover:bg-[#c026d3] text-white font-bold rounded-xl px-4 py-4 shadow-sm transition-all focus:scale-[0.98]">
              Proceed
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
