import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isValidPhoneNumber } from 'libphonenumber-js'
import './AuthPage.css'

const COUNTRY_CODES = [
  { code: '+1',   label: 'US +1' },
  { code: '+1',   label: 'CA +1' },
  { code: '+44',  label: 'GB +44' },
  { code: '+61',  label: 'AU +61' },
  { code: '+49',  label: 'DE +49' },
  { code: '+33',  label: 'FR +33' },
  { code: '+39',  label: 'IT +39' },
  { code: '+34',  label: 'ES +34' },
  { code: '+7',   label: 'RU +7' },
  { code: '+86',  label: 'CN +86' },
  { code: '+81',  label: 'JP +81' },
  { code: '+82',  label: 'KR +82' },
  { code: '+91',  label: 'IN +91' },
  { code: '+92',  label: 'PK +92' },
  { code: '+880', label: 'BD +880' },
  { code: '+234', label: 'NG +234' },
  { code: '+233', label: 'GH +233' },
  { code: '+27',  label: 'ZA +27' },
  { code: '+254', label: 'KE +254' },
  { code: '+256', label: 'UG +256' },
  { code: '+255', label: 'TZ +255' },
  { code: '+243', label: 'CD +243' },
  { code: '+225', label: 'CI +225' },
  { code: '+237', label: 'CM +237' },
  { code: '+221', label: 'SN +221' },
  { code: '+20',  label: 'EG +20' },
  { code: '+212', label: 'MA +212' },
  { code: '+213', label: 'DZ +213' },
  { code: '+216', label: 'TN +216' },
  { code: '+251', label: 'ET +251' },
  { code: '+55',  label: 'BR +55' },
  { code: '+52',  label: 'MX +52' },
  { code: '+54',  label: 'AR +54' },
  { code: '+57',  label: 'CO +57' },
  { code: '+58',  label: 'VE +58' },
  { code: '+56',  label: 'CL +56' },
  { code: '+51',  label: 'PE +51' },
  { code: '+60',  label: 'MY +60' },
  { code: '+62',  label: 'ID +62' },
  { code: '+63',  label: 'PH +63' },
  { code: '+66',  label: 'TH +66' },
  { code: '+84',  label: 'VN +84' },
  { code: '+65',  label: 'SG +65' },
  { code: '+971', label: 'AE +971' },
  { code: '+966', label: 'SA +966' },
  { code: '+90',  label: 'TR +90' },
  { code: '+98',  label: 'IR +98' },
  { code: '+964', label: 'IQ +964' },
]

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'KE', label: 'Kenya' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'CD', label: 'DR Congo' },
  { value: 'CM', label: 'Cameroon' },
  { value: 'SN', label: 'Senegal' },
  { value: 'CI', label: "Côte d'Ivoire" },
  { value: 'MA', label: 'Morocco' },
  { value: 'EG', label: 'Egypt' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AE', label: 'UAE' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'OTHER', label: 'Other' },
]

/* ── Reusable field sub-components ── */
const Field = ({ id, label, type = 'text', placeholder, required = false, optional = false, value, onChange, children }: any) => (
  <div className="field-wrap">
    <div className="flex items-center justify-between mb-1.5">
      <label htmlFor={id} className="field-label !mb-0">{label}</label>
      {optional && <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">Optional</span>}
    </div>
    {children ?? (
      <input
        id={id} name={id} type={type} placeholder={placeholder} required={required}
        value={value} onChange={onChange}
        className="auth-input"
      />
    )}
  </div>
)

const SelectField = ({ id, label, options, required = false, value, onChange }: any) => (
  <div className="field-wrap">
    <label htmlFor={id} className="field-label">{label}</label>
    <div className="relative">
      <select
        id={id} name={id} required={required}
        value={value} onChange={onChange}
        className="auth-select w-full"
      >
        <option value="" disabled>Select {label}</option>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
)

const PasswordField = ({ id, label, show, onToggle, value, onChange }: any) => (
  <div className="field-wrap">
    <label htmlFor={id} className="field-label">{label}</label>
    <div className="relative">
      <input
        id={id} name={id} type={show ? 'text' : 'password'}
        placeholder={label.includes('Confirm') ? 'Repeat password' : 'Min. 8 characters'} required
        value={value} onChange={onChange}
        className="auth-input pr-12"
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-300 transition-colors">
        {show
          ? <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
          : <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        }
      </button>
    </div>
  </div>
)

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    phoneCode: '+1',
    phoneNumber: '',
    password: '',
    confirm_password: '',
    country: '',
    account_type: '',
    referral: searchParams.get('ref') || '',
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'phoneNumber') {
      const val = e.target.value.replace(/\D/g, '')
      // E.164 absolute max length is 15 digits
      if (val.length > 15) return 
      setForm(prev => ({ ...prev, [e.target.name]: val }))
    } else {
      setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    const fullPhone = `${form.phoneCode}${form.phoneNumber}`
    if (!isValidPhoneNumber(fullPhone)) {
      setError('Please enter a valid phone number for the selected country code.')
      return
    }

    setLoading(true)
    try {
      const email = form.email.trim()
      const name = form.fullname.trim() || form.username.trim()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: form.password,
        options: {
          data: { 
            full_name: name, 
            username: form.username, 
            phone: `${form.phoneCode}${form.phoneNumber}`,
            referred_by: form.referral || null
          },
          emailRedirectTo: `${window.location.origin}/email-confirmed`
        }
      })
      if (signUpError) throw signUpError
      localStorage.setItem('rc_user_email', email)
      setRegistered(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Check-email screen shown after successful signup ── */
  if (registered) {
    return (
      <div className="relative min-h-screen bg-[#060910] flex items-center justify-center p-6 auth-noise auth-mesh">
        <div className="absolute top-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none animate-orb"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full pointer-events-none animate-orb-2"
          style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(192,38,211,0.07) 50%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="w-full max-w-md text-center glass-panel rounded-[24px] p-10 relative z-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(192,38,211,0.2))', border: '1px solid rgba(168,85,247,0.3)' }}>
            <svg className="w-10 h-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Check Your Email</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">We've sent a confirmation link to:</p>
          <p className="font-bold text-purple-300 mb-6 text-sm">{form.email}</p>
          <p className="text-slate-500 text-xs leading-relaxed mb-8">
            Click the link in the email to confirm your account. Once confirmed, return here and log in.
          </p>
          <Link to="/login"
            className="block w-full py-3.5 rounded-xl font-bold text-sm text-white text-center transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
            Go to Login →
          </Link>
          <p className="text-xs text-slate-600 mt-4">Didn't receive it? Check your spam folder.</p>
        </div>
      </div>
    )
  }


  return (
    <div className="relative min-h-screen bg-[#060910] flex font-sans overflow-hidden text-gray-100 auth-noise auth-mesh">

      {/* ── Deep background orbs ── */}
      <div className="absolute top-[-25%] right-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none animate-orb"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full pointer-events-none animate-orb-2"
        style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(192,38,211,0.07) 50%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute top-[40%] left-[25%] w-[25%] h-[25%] rounded-full pointer-events-none animate-orb-3"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* ═══════════════════════════════════════
          LEFT PANEL — Brand & Value Props (Scrollable Landing Page Style)
      ═══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-1/2 shrink-0 relative z-10 border-r border-white/[0.05] panel-enter overflow-y-auto custom-scrollbar"
        style={{ background: 'linear-gradient(160deg, rgba(15,20,35,0.95) 0%, rgba(10,13,22,0.98) 100%)' }}>

        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(217,70,239,0.3), transparent)' }} />

        <div className="flex flex-col py-10 px-12 xl:px-16 space-y-20 pb-24">
          
          {/* Brand header */}
          <div className="flex items-center gap-3.5 auth-enter shrink-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden ring-1 ring-purple-500/20 shadow-lg shadow-purple-900/30 glow-pulse shrink-0">
              <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400/60">Trading Platform</div>
              <div className="text-[18px] font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
              </div>
            </div>
          </div>

          {/* Section 1: Hero equivalent */}
          <div className="auth-enter auth-enter-delay-1 relative z-10 pt-4">
            <div className="text-[11px] uppercase tracking-[0.2em] text-purple-400 font-bold mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-purple-500/50"></span>
              Top Ranked Asset Management Company
            </div>
            <h2 className="text-5xl lg:text-[54px] font-black tracking-tight leading-[1.05] mb-10 text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Your Future Is<br />
              <span className="bg-gradient-to-br from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">Our Concern</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-12">
              {[
                'Crypto Trading', 'Stock Shares',
                'Assets Management', 'Forex Shares'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
                    <svg className="w-3.5 h-3.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-300">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login" className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                Login Now
              </Link>
              <button 
                type="button"
                onClick={() => {
                  document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => document.getElementById('username')?.focus(), 500);
                }}
                className="px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Get Started
              </button>
            </div>
          </div>

          {/* Section 2: Stats (Overlapping style recreated nicely) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auth-enter auth-enter-delay-2 relative z-20">
            {[
              { val: '1.4M+', label: 'Active Investors', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
              { val: '4000+', label: "Expert Advisor's", icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { val: '95%', label: 'Success Rate', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-6 text-center flex flex-col items-center justify-center relative overflow-hidden group shadow-xl"
                style={{ background: 'rgba(20,25,40,0.8)', border: '1px solid rgba(168,85,247,0.15)', backdropFilter: 'blur(10px)' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} /></svg>
                </div>
                <div className="text-[22px] font-black text-white mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Section 3: About Our Company */}
          <div className="auth-enter auth-enter-delay-3 pt-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-purple-400 font-bold mb-3">About Our Company</div>
            <h3 className="text-4xl font-black text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Reach Your Personal<br />Goals With Us
            </h3>

            {/* Images grid matching the requested style */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="col-span-2 h-40 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0"></div>
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Team presentation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="h-44 rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-fuchsia-500/20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0"></div>
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80" alt="Professionals at laptop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="h-44 rounded-2xl overflow-hidden relative group" style={{ background: 'rgba(20,25,40,0.8)', border: '1px solid rgba(168,85,247,0.15)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-20">
                  <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="font-bold text-white text-lg font-outfit">10+ Years</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Of Experiences</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-400 leading-[1.8] space-y-5">
              <p>
                Established by a strong team of highly skilled traders and consultants in the offline and online markets. We put your shares in new highly remunerative innovative projects, which offers great returns.
              </p>
              <p>
                We pioneered a consulting-based approach to private asset investing. You'll find a team of financial professionals with years of industry experience ready to help you navigate your financial future.
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <button 
                type="button"
                onClick={() => {
                  document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => document.getElementById('username')?.focus(), 500);
                }}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.2)' }}>
                Explore Now
              </button>
              <button 
                type="button"
                onClick={() => {
                  document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => document.getElementById('username')?.focus(), 500);
                }}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Take A Step
              </button>
            </div>
          </div>

          {/* Section 4: What We Do */}
          <div className="auth-enter auth-enter-delay-4 pt-8 border-t border-white/[0.05]">
            <div className="text-center mb-10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-purple-400 font-bold mb-3">Services We Offer</div>
              <h3 className="text-4xl font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>What We Do</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Crypto Trading', desc: 'Securely trade top cryptocurrencies with our advanced matching engine and deep liquidity pools for explosive growth.', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                { title: 'Mutual Funds', desc: 'Making an entry into household savings with increased awareness and higher efforts towards financial planning.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { title: 'Crypto Assets', desc: 'Gain exposure to diversified crypto asset portfolios, rigorously vetted by our expert analysts and advisors.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
              ].map((svc, i) => (
                <div key={i} className="p-6 rounded-2xl flex gap-5 items-start group transition-all hover:bg-white/[0.04]"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(192,38,211,0.1))', border: '1px solid rgba(168,85,247,0.3)' }}>
                    <svg className="w-7 h-7 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={svc.icon} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{svc.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-600 pt-16 mt-12 border-t border-white/[0.05] text-center">
              &copy; {new Date().getFullYear()} Resellscale. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — Register Form
      ═══════════════════════════════════════ */}
      <div id="register-form" className="flex-1 flex items-start justify-center p-5 sm:p-8 relative z-10 overflow-y-auto min-h-screen">
        <div className="w-full max-w-[580px] py-8">

          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8 auth-enter">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-purple-500/20 shadow-lg glow-pulse">
              <img src="/logo.jpg" alt="Resellscale" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400/60">Platform</div>
              <div className="text-base font-extrabold tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Resell<span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">scale</span>
              </div>
            </div>
          </div>

          {/* Glass form card */}
          <div className="glass-panel rounded-[24px] p-7 sm:p-10 auth-enter auth-enter-delay-1">

            <div className="mb-8">
              <h1 className="text-3xl font-black text-white tracking-tight mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Create Account
              </h1>
              <p className="text-sm text-slate-400">Get started — it only takes a minute.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Row 1: username + full name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="username" label="Username" placeholder="e.g. john_doe" required value={form.username} onChange={handleChange} />
                <Field id="fullname" label="Full Name" placeholder="John Doe" required value={form.fullname} onChange={handleChange} />
              </div>

              {/* Row 2: email + phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="email" label="Email Address" type="email" placeholder="name@example.com" required value={form.email} onChange={handleChange} />

                {/* Phone with country code */}
                <div className="field-wrap">
                  <label className="field-label">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select
                        name="phoneCode" value={form.phoneCode} onChange={handleChange}
                        className="auth-select h-full !py-3.5 !pl-3 !pr-8"
                      >
                        {COUNTRY_CODES.map((c, i) => <option key={i} value={c.code}>{c.label}</option>)}
                      </select>
                      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <input
                      name="phoneNumber" type="tel" placeholder="8051473926" required
                      value={form.phoneNumber} onChange={handleChange}
                      className="auth-input flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

              {/* Row 3: passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField id="password" label="Password" show={showPass} onToggle={() => setShowPass(p => !p)} value={form.password} onChange={handleChange} />
                <PasswordField id="confirm_password" label="Confirm Password" show={showConfirm} onToggle={() => setShowConfirm(p => !p)} value={form.confirm_password} onChange={handleChange} />
              </div>

              {/* Row 4: country + account type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField id="country" label="Country" required options={COUNTRIES} value={form.country} onChange={handleChange} />
                <SelectField id="account_type" label="Account Type" required options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'corporate', label: 'Corporate' },
                ]} value={form.account_type} onChange={handleChange} />
              </div>

              {/* Referral */}
              <Field id="referral" label="Referral Code" type="text" placeholder="Enter referral code (optional)" optional value={form.referral} onChange={handleChange} />

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-[14px] text-sm text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                  <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Terms */}
              <p className="text-[11.5px] text-slate-500 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-fuchsia-300 transition-colors font-medium">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-fuchsia-300 transition-colors font-medium">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <button type="submit" disabled={loading} className="auth-btn">
                <span>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create My Account
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Sign in link */}
            <div className="auth-divider mt-7 mb-5">
              <span className="text-[11px] text-slate-600 font-medium tracking-wider uppercase">Already a member?</span>
            </div>
            <Link to="/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[14px] text-sm font-semibold text-slate-300 transition-all duration-200 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(168,85,247,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
              Sign In to your account
              <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
