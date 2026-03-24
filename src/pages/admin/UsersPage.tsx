import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Edit } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*')
      if (data) {
        setUsers(data.map(u => ({
          id: u.id,
          name: u.full_name || 'Unnamed',
          email: 'Private (Auth ID)',
          balance: Number(u.balance) || 0,
          joinedDate: new Date(u.created_at).toLocaleDateString()
        })))
      }
    }
    fetchUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1">View and edit registered users.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6 whitespace-nowrap">Name</th>
                <th className="py-4 px-6 whitespace-nowrap">Email</th>
                <th className="py-4 px-6 text-right whitespace-nowrap">Balance</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Joined</th>
                <th className="py-4 px-6 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900">{u.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{u.email}</td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">${u.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-6 text-center text-sm text-gray-500">{u.joinedDate}</td>
                    <td className="py-4 px-6 text-center">
                      <Link to={`/admin/users/${u.id}`} className="inline-flex items-center justify-center p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p>No users registered yet.</p>
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
