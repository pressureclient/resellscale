import { useState } from 'react'

export default function AdminSupportPage() {
  const [selectedUser, setSelectedUser] = useState<number | null>(1)
  const [reply, setReply] = useState('')

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', unread: 2, lastMsg: 'I have a problem with my withdrawal.' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', unread: 0, lastMsg: 'Thank you for the help!' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', unread: 1, lastMsg: 'When does the crypto pool end?' },
  ]

  const [chats, setChats] = useState<Record<number, {from: 'user'|'admin', text: string, time: string}[]>>({
    1: [
      { from: 'user', text: 'Hello, my recent withdrawal trace is stuck.', time: '10:45 AM' },
      { from: 'admin', text: 'Hi John, I am looking into this right now. Could you confirm the wallet address?', time: '10:48 AM' },
      { from: 'user', text: 'Yes, it is 0x123...abc', time: '10:55 AM' },
      { from: 'user', text: 'I have a problem with my withdrawal.', time: '11:00 AM' }
    ],
    2: [
      { from: 'user', text: 'Is the new portfolio structure live?', time: 'Yesterday' },
      { from: 'admin', text: 'Yes, it went live this morning.', time: 'Yesterday' },
      { from: 'user', text: 'Thank you for the help!', time: '10:00 AM' }
    ],
    3: [
      { from: 'user', text: 'When does the crypto pool end?', time: '9:30 AM' }
    ]
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim() || !selectedUser) return
    setChats(prev => ({
      ...prev,
      [selectedUser]: [...(prev[selectedUser] || []), { from: 'admin', text: reply, time: 'Just now' }]
    }))
    setReply('')
  }

  const activeUser = users.find(u => u.id === selectedUser)
  const activeChat = selectedUser ? chats[selectedUser] : []

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Support Inbox</h2>
          <p className="text-sm text-slate-400">Manage support tickets and chat with users seamlessly.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        
        {/* Users List */}
        <div className="md:col-span-4 lg:col-span-3 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ background: 'rgba(13,17,25,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          <div className="p-4 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="relative">
              <input type="text" placeholder="Search users..." 
                className="w-full bg-black/40 text-sm text-white rounded-xl px-10 py-3 outline-none"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }} />
              <svg className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users.map(u => (
              <button key={u.id} onClick={() => setSelectedUser(u.id)}
                className="w-full p-4 flex items-center gap-3 text-left transition-all hover:bg-white/5 border-b border-white/[0.02]"
                style={{ background: selectedUser === u.id ? 'rgba(168,85,247,0.1)' : 'transparent', borderLeft: selectedUser === u.id ? '3px solid #c084fc' : '3px solid transparent' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="font-semibold text-sm text-white truncate">{u.name}</div>
                    {u.unread > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{u.unread} new</span>}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{u.lastMsg}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-8 lg:col-span-9 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          style={{ background: 'rgba(13,17,25,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          
          {selectedUser && activeUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
                    {activeUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">{activeUser.name}</h3>
                    <p className="text-xs text-slate-400">{activeUser.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 border border-white/5">
                    View Profile
                  </button>
                  <button className="px-4 py-2 rounded-lg text-xs font-bold text-emerald-400 hover:text-white transition-all bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20">
                    Mark Resolved
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeChat.map((msg, i) => (
                  <div key={i} className={`flex flex-col max-w-[70%] ${msg.from === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      msg.from === 'admin' 
                        ? 'bg-gradient-to-br from-fuchsia-600 to-purple-600 text-white rounded-br-sm shadow-lg shadow-purple-900/20' 
                        : 'bg-white/5 text-slate-200 border border-white/10 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 flex gap-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <input type="text" value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply here..."
                  className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 transition-colors" />
                <button type="submit" disabled={!reply.trim()}
                  className="px-6 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.2)' }}>
                  Send Reply
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Select a user to view their support tickets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
