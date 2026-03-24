import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState<{from: 'user' | 'admin', text: string}[]>([
    { from: 'admin', text: 'Hello! How can we help you today?' }
  ])
  const [userId, setUserId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchHistory = async () => {
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      
      if (data && data.length > 0) {
        setChat([
          { from: 'admin', text: 'Hello! How can we help you today?' },
          ...data.map(m => ({
            from: m.sender_id === userId ? 'user' : 'admin' as ('user' | 'admin'),
            text: m.message
          }))
        ])
      }
    }
    fetchHistory()

    const channel = supabase
      .channel('support_widget_user')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'support_messages',
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        const newMsg = payload.new
        // Only append if it's not our own optimistic insert? Wait, the hook will fire for our own inserts.
        // It's safer to just rely on the DB subscription to populate our own messages or use a unique ID to dedupe.
        // For simplicity, we just rely on the DB channel for all messages, so sending doesn't update state directly.
        setChat(prev => [...prev, {
          from: newMsg.sender_id === userId ? 'user' : 'admin',
          text: newMsg.message
        }])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat, isOpen])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim()) return
    const text = msg.trim()
    setMsg('')

    if (userId) {
      await supabase.from('support_messages').insert({
        user_id: userId,
        sender_id: userId,
        message: text
      })
    } else {
      setChat(prev => [...prev, { from: 'user', text }])
      setTimeout(() => {
        setChat(prev => [...prev, { from: 'admin', text: "Please sign up or log in so our advisors can assist you further." }])
      }, 1000)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-96 mb-4 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom"
          style={{ background: 'rgba(15,20,35,0.95)', border: '1px solid rgba(168,85,247,0.3)', backdropFilter: 'blur(20px)' }}>
          <div className="p-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold text-white text-sm">Support Chat</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-black/20">
            {chat.map((c, i) => (
              <div key={i} className={`max-w-[85%] rounded-xl p-3 text-sm ${c.from === 'user' ? 'bg-purple-600 text-white self-end rounded-br-sm' : 'bg-slate-800 text-slate-200 self-start rounded-bl-sm'}`}>
                {c.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={send} className="p-3 border-t border-white/10 flex gap-2" style={{ background: 'rgba(5,7,12,0.8)' }}>
            <input type="text" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-white outline-none px-2" />
            <button type="submit" disabled={!msg.trim()} className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
              <Send className="w-4 h-4" style={{ marginLeft: '-1px' }} />
            </button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 8px 32px rgba(192,38,211,0.5)' }}>
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </button>
    </div>
  )
}

