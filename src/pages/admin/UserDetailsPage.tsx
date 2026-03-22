import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Wallet, TrendingUp, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UserDetailsPage() {
  const { id } = useParams()
  const [user, setUser] = useState<any>(null)
  
  // Forms
  const [newBalance, setNewBalance] = useState('')
  const [profitAmount, setProfitAmount] = useState('')
  const [profitPlan, setProfitPlan] = useState('Premium Package')

  // Profile forms
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [accountType, setAccountType] = useState('Standard')

  const [savedBalance, setSavedBalance] = useState(false)
  const [savedProfit, setSavedProfit] = useState(false)
  const [savedProfile, setSavedProfile] = useState(false)

  const loadUser = async () => {
    if (!id) return
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
    if (data) {
      setUser(data)
      setNewBalance(data.balance.toString())
      setFullName(data.full_name || '')
      setUsername(data.username || '')
      setPhone(data.phone || '')
      setAccountType(data.account_type || 'Standard')
    }
  }

  useEffect(() => {
    loadUser()
  }, [id])

  const handleUpdateBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    const bal = parseFloat(newBalance)
    if (isNaN(bal)) return
    
    await supabase.from('profiles').update({ balance: bal }).eq('id', id)
    
    setSavedBalance(true)
    setTimeout(() => setSavedBalance(false), 2000)
    loadUser()
  }

  const handleAddProfit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !id) return
    const amt = parseFloat(profitAmount)
    if (isNaN(amt) || amt <= 0) return
    
    // Insert profit record
    await supabase.from('profits').insert({ user_id: id, amount: amt, plan_name: profitPlan })
    // Update balance
    await supabase.from('profiles').update({ balance: Number(user.balance) + amt, total_profit: Number(user.total_profit) + amt }).eq('id', id)
    
    setSavedProfit(true)
    setProfitAmount('')
    setTimeout(() => setSavedProfit(false), 2000)
    loadUser()
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    
    await supabase.from('profiles').update({ 
      full_name: fullName,
      username: username,
      phone: phone,
      account_type: accountType
    }).eq('id', id)
    
    setSavedProfile(true)
    setTimeout(() => setSavedProfile(false), 2000)
    loadUser()
  }

  if (!user) return <div className="p-8">Loading or User not found...</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="mb-2">
        <Link to="/admin/users" className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline">
          ← Back to Users
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{user.full_name || 'Unnamed'}</h1>
          <p className="text-gray-500 text-sm mt-1">ID: {user.id} • Joined {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Details Edit Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Edit Profile Details</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 font-medium" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                <input type="text" value={accountType} onChange={e => setAccountType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 font-medium" />
              </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4">
              {savedProfile ? <CheckCircle2 className="w-5 h-5 text-white" /> : 'Update Profile Details'}
            </button>
          </form>
        </div>

        {/* Balance Update Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Edit Balance</h2>
          </div>
          <form onSubmit={handleUpdateBalance} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Balance: ${Number(user.balance || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</label>
              <input
                type="number"
                step="0.01"
                value={newBalance}
                onChange={e => setNewBalance(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {savedBalance ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : 'Update Balance'}
            </button>
          </form>
        </div>

        {/* Add Profit Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add Profit Entry</h2>
          </div>
          <form onSubmit={handleAddProfit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={profitAmount}
                onChange={e => setProfitAmount(e.target.value)}
                placeholder="e.g. 150.00"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Source</label>
              <select
                value={profitPlan}
                onChange={e => setProfitPlan(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
              >
                <option value="Basic Package">Basic Package</option>
                <option value="Premium Package">Premium Package</option>
                <option value="VIP Package">VIP Package</option>
                <option value="Custom Bonus">Custom Bonus</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {savedProfit ? <CheckCircle2 className="w-5 h-5 text-white" /> : 'Inject Profit'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">This will also automatically increase the user's balance.</p>
          </form>
        </div>
      </div>
    </div>
  )
}
