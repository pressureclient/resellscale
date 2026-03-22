import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Lock, Globe } from 'lucide-react'
import { TwoFAModal } from './ProfilePage'

/* ── Dark panel ── */
const Panel = ({ children, className = '' }: any) => (
  <div className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(13,17,25,0.7)',
      border: '1px solid rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
    {children}
  </div>
)

/* ── Dark toggle switch ── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className="relative inline-flex h-6 w-11 items-center rounded-full shrink-0 transition-all duration-200 focus:outline-none"
      style={{
        background: enabled ? 'linear-gradient(135deg, #c026d3, #7c3aed)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${enabled ? 'rgba(192,38,211,0.4)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: enabled ? '0 0 12px rgba(192,38,211,0.3)' : 'none'
      }}>
      <span className="sr-only">Toggle</span>
      <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(22px)' : 'translateX(2px)' }} />
    </button>
  )
}

const DEMO_PASSWORD = 'Password123'

function PrivacyTab({ onOpen2FA }: { onOpen2FA: () => void }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({})
  const [showToast, setShowToast] = useState(false)

  const inputStyle = {
    background: 'rgba(5,7,12,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
  }

  const validate = () => {
    const errs: typeof errors = {}
    if (!currentPw) errs.current = 'Current password is required.'
    else if (currentPw !== DEMO_PASSWORD) errs.current = 'Incorrect current password.'
    if (!newPw) errs.new = 'Please enter a new password.'
    else if (newPw.length < 8) errs.new = 'Password must be at least 8 characters.'
    else if (newPw === currentPw) errs.new = 'New password must differ from current.'
    if (!confirmPw) errs.confirm = 'Please confirm your new password.'
    else if (confirmPw !== newPw) errs.confirm = 'Passwords do not match.'
    return errs
  }

  const isReady = currentPw && newPw && confirmPw &&
    currentPw === DEMO_PASSWORD && newPw.length >= 8 && newPw !== currentPw && newPw === confirmPw

  const handleSubmit = () => {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      setCurrentPw(''); setNewPw(''); setConfirmPw(''); setErrors({})
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    }
  }

  return (
    <>
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[99999] flex items-start gap-3 rounded-2xl shadow-2xl p-4 w-80"
          style={{ background: 'rgba(10,13,20,0.98)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Password Updated</p>
            <p className="text-xs text-slate-400 mt-0.5">A confirmation email has been sent.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-slate-600 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Panel className="p-6">
        <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Privacy &amp; Security</h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-sm text-slate-300 mb-3">Change Password</h4>
            <div className="space-y-3">
              {[
                { placeholder: 'Current Password', val: currentPw, setter: setCurrentPw, err: errors.current, errKey: 'current' },
                { placeholder: 'New Password (min 8 chars)', val: newPw, setter: setNewPw, err: errors.new, errKey: 'new' },
                { placeholder: 'Confirm New Password', val: confirmPw, setter: setConfirmPw, err: errors.confirm, errKey: 'confirm' },
              ].map(({ placeholder, val, setter, err, errKey }) => (
                <div key={errKey}>
                  <input type="password" placeholder={placeholder} value={val}
                    onChange={e => { setter(e.target.value); setErrors(v => ({ ...v, [errKey]: undefined })) }}
                    className="w-full text-sm rounded-xl px-4 py-3 font-medium outline-none transition-all"
                    style={{
                      ...inputStyle,
                      borderColor: err ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'
                    }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = err ? 'rgba(239,68,68,0.5)' : 'rgba(168,85,247,0.5)'}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = err ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}
                  />
                  {err && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {err}
                    </p>
                  )}
                </div>
              ))}
              <button onClick={handleSubmit} disabled={!isReady}
                className="font-semibold py-2.5 px-6 rounded-xl text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.25)' }}>
                Update Password
              </button>
            </div>
          </div>

          <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 className="font-semibold text-sm text-slate-300 mb-2">Two-Factor Authentication (2FA)</h4>
            <p className="text-sm text-slate-500 mb-4">Add an extra layer of security. Require a code from your authenticator app when logging in.</p>
            <button onClick={onOpen2FA}
              className="text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
              Setup 2FA
            </button>
          </div>
        </div>
      </Panel>
    </>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'preferences'>('notifications')
  const [show2FA, setShow2FA] = useState(false)
  const [invUpdates, setInvUpdates] = useState(true)
  const [secAlerts, setSecAlerts] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [language, setLanguage] = useState('English')

  const tabs = [
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy & Security', icon: Lock },
    { key: 'preferences', label: 'Preferences', icon: Globe },
  ] as const

  const selectStyle = {
    background: 'rgba(5,7,12,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
  }

  return (
    <div className="w-full">
      {show2FA && <TwoFAModal onClose={() => setShow2FA(false)} />}

      <div className="flex items-center gap-3 mb-7">
        <Link to="/dashboard"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <Panel className="p-2 flex flex-col gap-0.5 sticky top-6">
            {tabs.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-sm font-medium"
                  style={{
                    background: active ? 'rgba(168,85,247,0.12)' : 'transparent',
                    color: active ? '#d8b4fe' : 'rgba(148,163,184,0.7)',
                    border: active ? '1px solid rgba(168,85,247,0.2)' : '1px solid transparent'
                  }}>
                  <Icon className="w-4 h-4 shrink-0" style={{ color: active ? '#c084fc' : 'rgba(100,116,139,0.7)' }} />
                  {label}
                </button>
              )
            })}
          </Panel>
        </div>

        {/* Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-5">

          {activeTab === 'notifications' && (
            <Panel className="p-6">
              <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Email Notifications</h3>
              <div className="space-y-3">
                {[
                  { label: 'Investment Updates', desc: 'Receive alerts when yields are distributed.', val: invUpdates, setter: setInvUpdates },
                  { label: 'Security Alerts', desc: 'Get notified immediately of new sign-ins.', val: secAlerts, setter: setSecAlerts },
                  { label: 'Marketing Emails', desc: 'Promotions, news, and exclusive offers.', val: marketing, setter: setMarketing },
                ].map(({ label, desc, val, setter }) => (
                  <div key={label} className="flex items-center justify-between p-4 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <Toggle enabled={val} onChange={() => setter(!val)} />
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {activeTab === 'privacy' && <PrivacyTab onOpen2FA={() => setShow2FA(true)} />}

          {activeTab === 'preferences' && (
            <Panel className="p-6">
              <h3 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Preferences</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Display Language</label>
                  <p className="text-sm text-slate-500 mb-3">Select your preferred language for the dashboard.</p>
                  <div className="relative w-full sm:w-1/2">
                    <select value={language} onChange={e => setLanguage(e.target.value)}
                      className="w-full text-sm rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer"
                      style={selectStyle}
                      onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                      onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
                      {['English', 'Spanish (Español)', 'French (Français)', 'Mandarin (中文)', 'Arabic (العربية)', 'Russian (Русский)'].map(l => (
                        <option key={l} value={l} style={{ background: '#0d1117' }}>{l}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Local Currency</label>
                  <p className="text-sm text-slate-500 mb-3">Choose fiat currency for portfolio conversions.</p>
                  <div className="relative w-full sm:w-1/2">
                    <select className="w-full text-sm rounded-xl px-4 py-3 outline-none appearance-none cursor-pointer"
                      style={selectStyle}
                      onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                      onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
                      {[['USD', 'United States Dollar'], ['EUR', 'Euro'], ['GBP', 'British Pound'], ['NGN', 'Nigerian Naira'], ['GHS', 'Ghanaian Cedi']].map(([c, l]) => (
                        <option key={c} value={c} style={{ background: '#0d1117' }}>{c} — {l}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          )}

          <div className="flex justify-end pt-1">
            <button
              className="font-bold py-3 px-8 rounded-xl text-sm text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
