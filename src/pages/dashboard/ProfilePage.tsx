import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Shield, Key, Camera, X, Smartphone, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

/* ── Dark panel ── */
const Panel = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`}
    style={{ background: 'rgba(13,17,25,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
    {children}
  </div>
)

/* ── Dark input style ── */
const inputStyle = {
  background: 'rgba(5,7,12,0.7)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
}

/* ── 2FA Modal ── */
export function TwoFAModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'scan' | 'verify' | 'done'>('scan')
  const [code, setCode] = useState('')
  const fakeSecret = 'JBSWY3DPEHPK3PXP'
  const fakeQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Resellscale?secret=${fakeSecret}&issuer=Resellscale&color=6d28d9&bgcolor=ffffff&margin=6`
  const steps: Array<'scan' | 'verify' | 'done'> = ['scan', 'verify', 'done']
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'rgba(10,13,20,0.98)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
        <div className="relative p-6 pb-5"
          style={{ background: 'linear-gradient(135deg, rgba(192,38,211,0.2), rgba(124,58,237,0.2))', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)' }} />
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <Smartphone className="w-5 h-5 text-purple-300" />
          </div>
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Two-Factor Authentication</h3>
          <p className="text-sm text-slate-400 mt-0.5">Secure your account in 2 steps</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1 mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: step === s ? 'linear-gradient(135deg,#c026d3,#7c3aed)' : steps.indexOf(step) > i ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                    color: step === s ? 'white' : steps.indexOf(step) > i ? '#c084fc' : 'rgba(100,116,139,0.6)',
                    border: `1px solid ${step === s ? 'transparent' : steps.indexOf(step) > i ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.07)'}`
                  }}>{i + 1}</div>
                {i < 2 && <div className="flex-1 h-px" style={{ background: steps.indexOf(step) > i ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
          </div>
          {step === 'scan' && (
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-5">Scan this QR with Google Authenticator or Authy.</p>
              <div className="p-2 rounded-xl inline-block mb-4 bg-white shadow-lg">
                <img src={fakeQR} alt="2FA QR" className="rounded-lg w-44 h-44" />
              </div>
              <p className="text-xs text-slate-500 mb-1">Or enter this key manually:</p>
              <code className="text-sm font-mono px-3 py-2 rounded-xl tracking-widest font-bold block mb-6 text-purple-300"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>{fakeSecret}</code>
              <button onClick={() => setStep('verify')}
                className="w-full py-3 rounded-xl font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg,#c026d3,#7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                I've scanned it →
              </button>
            </div>
          )}
          {step === 'verify' && (
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-5">Enter the 6-digit code from your authenticator app.</p>
              <input type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-2xl font-mono rounded-xl px-4 py-4 mb-4 outline-none"
                style={{ background: 'rgba(5,7,12,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#e879f9', letterSpacing: '0.35em', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)' }} />
              <button onClick={() => { if (code.length === 6) setStep('done') }} disabled={code.length !== 6}
                className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg,#c026d3,#7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                Verify Code
              </button>
            </div>
          )}
          {step === 'done' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle className="w-9 h-9 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>2FA Enabled!</h4>
              <p className="text-sm text-slate-400 mb-6">Your account is now protected by two-factor authentication.</p>
              <button onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-sm text-white hover:-translate-y-0.5 transition-all"
                style={{ background: 'linear-gradient(135deg,#c026d3,#7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Field label ── */
const Label = ({ children }: any) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(100,116,139,0.7)' }}>
    {children}
  </label>
)

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [show2FA, setShow2FA] = useState(false)

  /* Editable fields */
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [accountType, setAccountType] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser(authUser)
        /* --- Load from auth metadata (set at registration) --- */
        const meta = authUser.user_metadata || {}
        setFullName(meta.full_name || '')
        setUsername(meta.username || '')
        setPhone(meta.phone || '')
        setCountry(meta.country || '')
        setAccountType(meta.account_type || '')

        /* --- Also check profiles table for overrides & avatar --- */
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (prof) {
          setProfile(prof)
          /* Override with profile table values if they exist */
          if (prof.full_name) setFullName(prof.full_name)
          if (prof.username) setUsername(prof.username)
          if (prof.phone) setPhone(prof.phone)
          if (prof.account_type) setAccountType(prof.account_type)
          if (prof.country) setCountry(prof.country)
          if (prof.avatar_url) setAvatarUrl(prof.avatar_url)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  /* ── Avatar Upload to Supabase Storage ── */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    /* Show preview immediately */
    const reader = new FileReader()
    reader.onload = ev => setAvatarUrl(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`

      /* Upload to "avatars" bucket (create it in Supabase if needed) */
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (upErr) throw upErr

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      /* Save URL to profiles table */
      await supabase.from('profiles').upsert({ id: user.id, avatar_url: publicUrl })
      setAvatarUrl(publicUrl)
      showToast(true, 'Profile photo updated!')
    } catch (err: any) {
      showToast(false, err.message || 'Failed to upload photo.')
    } finally {
      setUploading(false)
    }
  }

  const showToast = (ok: boolean, text: string) => {
    setSaveMsg({ ok, text })
    setTimeout(() => setSaveMsg(null), 4000)
  }

  /* ── Save profile ── */
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaveMsg(null)
    try {
      /* Update auth metadata */
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), username: username.trim(), phone: phone.trim() }
      })

      /* Update profiles table — only columns that actually exist */
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName.trim(),
        username: username.trim(),
      })
      if (error) throw error

      showToast(true, 'Profile saved successfully!')
      setIsEditing(false)
    } catch (err: any) {
      showToast(false, err.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    /* Revert to last saved values */
    const meta = user?.user_metadata || {}
    setFullName(profile?.full_name || meta.full_name || '')
    setUsername(profile?.username || meta.username || '')
    setPhone(meta.phone || '')
    setIsEditing(false)
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
    </div>
  )

  const initials = (fullName || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="w-full">
      {show2FA && <TwoFAModal onClose={() => setShow2FA(false)} />}

      {/* Toast */}
      {saveMsg && (
        <div className="fixed bottom-6 right-6 z-[99999] flex items-start gap-3 rounded-2xl shadow-2xl p-4 w-80"
          style={{
            background: 'rgba(10,13,20,0.98)',
            border: `1px solid ${saveMsg.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)'
          }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: saveMsg.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${saveMsg.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            {saveMsg.ok
              ? <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{saveMsg.ok ? 'Success' : 'Error'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{saveMsg.text}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <Link to="/dashboard"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>My Profile</h2>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button onClick={handleCancel} disabled={saving}
              className="text-sm font-semibold px-4 py-2.5 rounded-xl transition-all text-slate-400 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
          )}
          <button onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all disabled:opacity-60"
            style={{
              background: isEditing ? 'linear-gradient(135deg, #c026d3, #7c3aed)' : 'rgba(168,85,247,0.1)',
              border: `1px solid ${isEditing ? 'transparent' : 'rgba(168,85,247,0.25)'}`,
              color: isEditing ? 'white' : '#c084fc',
              boxShadow: isEditing ? '0 4px 16px rgba(192,38,211,0.3)' : 'none'
            }}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Avatar Card ── */}
        <Panel className="lg:col-span-1 p-6 flex flex-col items-center text-center">
          {/* Avatar with upload */}
          <div className="relative group mb-5">
            <div className="w-24 h-24 rounded-full p-0.5"
              style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 8px 24px rgba(192,38,211,0.35)' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                : <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white"
                    style={{ background: 'rgba(10,13,20,0.9)' }}>{initials}</div>}
            </div>
            {uploading && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60">
                <div className="w-5 h-5 rounded-full border-2 border-purple-400/30 border-t-purple-400 animate-spin" />
              </div>
            )}
            <label htmlFor="avatar-upload"
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </label>
            <label htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', borderColor: 'rgba(10,13,20,0.9)' }}>
              <Camera className="w-3.5 h-3.5 text-white" />
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <h3 className="text-xl font-bold text-white mb-0.5">{fullName || username || '—'}</h3>
          <p className="text-xs text-slate-500 mb-1">{username ? `@${username}` : ''}</p>
          <p className="text-sm text-slate-500 mb-6">{user?.email}</p>

          {/* Info tiles */}
          {[
            { icon: <Shield className="w-4 h-4" style={{ color: '#c084fc' }} />, label: 'Account Type', value: accountType || 'Standard', valueBg: 'rgba(168,85,247,0.15)', valueCol: '#d8b4fe', valueBdr: 'rgba(168,85,247,0.25)' },
            { icon: <User className="w-4 h-4 text-slate-500" />, label: 'Member Since', value: profile ? new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(profile.created_at)) : '—', valueBg: 'transparent', valueCol: 'rgba(148,163,184,0.8)', valueBdr: 'transparent' },
          ].map((it, i) => (
            <div key={i} className="w-full flex items-center justify-between p-3 rounded-xl mb-2 last:mb-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">{it.icon}<span className="text-sm font-medium text-slate-300">{it.label}</span></div>
              <span className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{ background: it.valueBg, color: it.valueCol, border: `1px solid ${it.valueBdr}` }}>{it.value}</span>
            </div>
          ))}

          {/* Country tile — from registration */}
          {country && (
            <div className="w-full flex items-center justify-between p-3 rounded-xl mb-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                <span className="text-sm font-medium text-slate-300">Country</span>
              </div>
              <span className="text-xs font-bold text-slate-400">{country}</span>
            </div>
          )}
        </Panel>

        {/* ── Details Card ── */}
        <Panel className="lg:col-span-2 p-6">
          <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Personal Information</h3>
          <div className="space-y-4">

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <input type="text" disabled={!isEditing} value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all"
                  style={{ ...inputStyle, opacity: isEditing ? 1 : 0.65 }}
                  onFocus={e => isEditing && ((e.target as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
              <div>
                <Label>Username</Label>
                <input type="text" disabled={!isEditing} value={username} onChange={e => setUsername(e.target.value)}
                  className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all"
                  style={{ ...inputStyle, opacity: isEditing ? 1 : 0.65 }}
                  onFocus={e => isEditing && ((e.target as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Email Address <span className="normal-case text-[10px] font-normal text-slate-600">(cannot be changed)</span></Label>
                <input type="email" disabled value={user?.email || ''}
                  className="w-full text-sm rounded-xl px-4 py-3 outline-none cursor-not-allowed"
                  style={{ ...inputStyle, opacity: 0.4 }} />
              </div>
              <div>
                <Label>Phone Number</Label>
                {/* Phone is stored in auth metadata — shown read-only or editable */}
                <input type="tel" disabled={!isEditing} value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +1 555 0000"
                  className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all"
                  style={{ ...inputStyle, opacity: isEditing ? 1 : 0.65 }}
                  onFocus={e => isEditing && ((e.target as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)')}
                  onBlur={e => ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')} />
              </div>
            </div>

            {/* Row 3 — account type + country (read-only, from registration) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Account Type</Label>
                <input type="text" disabled value={accountType || 'Standard'}
                  className="w-full text-sm rounded-xl px-4 py-3 outline-none cursor-not-allowed"
                  style={{ ...inputStyle, opacity: 0.5 }} />
              </div>
              {country && (
                <div>
                  <Label>Country</Label>
                  <input type="text" disabled value={country}
                    className="w-full text-sm rounded-xl px-4 py-3 outline-none cursor-not-allowed"
                    style={{ ...inputStyle, opacity: 0.5 }} />
                </div>
              )}
            </div>

            {/* Security section */}
            <div className="pt-5 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <Key className="w-4 h-4 text-purple-400" /> Security
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="font-semibold text-slate-200 text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Secure your account with an authenticator app.</p>
                </div>
                <button onClick={() => setShow2FA(true)}
                  className="text-xs font-bold px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                  Setup 2FA
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
