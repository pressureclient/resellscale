import { useState, useEffect } from 'react'
import { Users, ArrowDownRight, Clock, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [txs, setTxs] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('profiles').select('*')
      if (usersData) setUsers(usersData)

      const { data: txsData } = await supabase.from('transactions').select('*')
      if (txsData) setTxs(txsData)
    }
    fetchData()
  }, [])

  const pendingCount = txs.filter(t => t.status === 'Pending').length
  
  const totalBalances = users.reduce((acc, u) => acc + (Number(u.balance) || 0), 0)
  const totalDeposited = users.reduce((acc, u) => acc + (Number(u.total_deposited) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Platform metrics and health.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-xl flex items-center justify-center shrink-0">
             <ArrowDownRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Deposited</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalDeposited.toLocaleString('en-US', {minimumFractionDigits: 0})}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
             <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-900">{pendingCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
             <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Platform AUM</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalBalances.toLocaleString('en-US', {minimumFractionDigits: 0})}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex gap-4 w-full">
            <Link to="/admin/approvals" className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 py-4 rounded-xl font-bold transition-colors">
              Review Approvals
            </Link>
            <Link to="/admin/users" className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-4 rounded-xl font-bold transition-colors">
              Manage Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
