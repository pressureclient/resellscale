import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Copy, CheckCircle2, Info, ChevronRight, Check, Smartphone } from 'lucide-react'

const CHAINS = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Network',
    address: 'bc1qy7jsvdmjjxnju8pq0nzhh8a2pswqxfd32xt4fd',
    display: '₿',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20 (Ethereum)',
    address: '0x340720b83EcfacC42532995F8B63805dD8A50730',
    display: 'Ξ',
  },
  {
    id: 'usdt-trc20',
    name: 'USDT (TRC-20)',
    symbol: 'USDT',
    network: 'TRC-20 (TRON)',
    address: 'TQN1WrwKzd73eqeJhKgZGMGp4kThK9vkLT',
    display: '₮',
  },
  {
    id: 'usdt-erc20',
    name: 'USDT (ERC-20)',
    symbol: 'USDT',
    network: 'ERC-20 (Ethereum)',
    address: '0x340720b83EcfacC42532995F8B63805dD8A50730',
    display: '₮',
  },
  {
    id: 'usdt-bep20',
    name: 'USDT (BEP-20)',
    symbol: 'USDT',
    network: 'BEP-20 (BSC)',
    address: '0x340720b83EcfacC42532995F8B63805dD8A50730',
    display: '₮',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Network',
    address: 'BBytvzp3xy5hFEgioFove7W4hVSbLqyoSj6Rt9ApdwuZ',
    display: '◎',
  },
]

const CASHAPP_TAG = '$Millhousenan'

type Step = 'select' | 'address' | 'confirm'
type Method = 'crypto' | 'cashapp'

/* ── Shared dark panel style ── */
const panelStyle = {
  background: 'rgba(13,17,25,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
}

const inputStyle = {
  background: 'rgba(5,7,12,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
}

const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2'

export default function DepositPage() {
  const [method, setMethod] = useState<Method | null>(null)
  const [step, setStep] = useState<Step>('select')
  const [selectedChain, setSelectedChain] = useState<typeof CHAINS[0] | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedTag, setCopiedTag] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [amount, setAmount] = useState('')
  const [cashappRef, setCashappRef] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChainSelect = (chain: typeof CHAINS[0]) => {
    setSelectedChain(chain)
    setStep('address')
  }

  const handleCopy = () => {
    if (!selectedChain) return
    navigator.clipboard.writeText(selectedChain.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyTag = () => {
    navigator.clipboard.writeText(CASHAPP_TAG)
    setCopiedTag(true)
    setTimeout(() => setCopiedTag(false), 2000)
  }

  const handleSubmit = async () => {
    if (method === 'crypto' && (!txHash || !amount)) return
    if (method === 'cashapp' && (!cashappRef || !amount)) return
    setSubmitError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSubmitError('You must be logged in to submit a deposit.'); return }
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      asset: method === 'crypto' && selectedChain ? selectedChain.name : 'USD',
      network: method === 'crypto' && selectedChain ? selectedChain.network : 'CashApp',
      currency: 'USD',
      status: 'pending',
      reference: method === 'crypto' ? txHash : cashappRef,
    })
    if (error) {
      setSubmitError('Submission failed: ' + error.message + '. Please contact support.')
      return
    }
    setSubmitted(true)
  }

  const resetAll = () => {
    setMethod(null); setStep('select'); setSelectedChain(null)
    setCopied(false); setCopiedTag(false); setTxHash('')
    setAmount(''); setCashappRef(''); setSubmitted(false)
  }

  /* QR using api.qrserver.com — white bg so code is visible */
  const qrUrl = (data: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data)}&color=6d28d9&bgcolor=ffffff&margin=8`

  const stepIndex = ['select', 'address', 'confirm'].indexOf(step)

  /* ── Back button ── */
  const BackBtn = ({ to, onClick }: { to?: string; onClick?: () => void }) => (
    <div className="flex items-center gap-3 mb-7">
      {to ? (
        <Link to={to}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button onClick={onClick}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Fund Account</h2>
        <p className="text-slate-400 text-sm mt-0.5">Add funds to your portfolio to start investing</p>
      </div>
    </div>
  )

  /* ── Step pill ── */
  const StepPill = ({ steps, labels }: { steps: string[], labels: string[] }) => (
    <div className="flex items-center gap-1 mb-6 rounded-2xl px-5 py-3" style={panelStyle}>
      {steps.map((s, i) => {
        const done = stepIndex > i
        const active = step === s
        return (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0"
                style={{
                  background: done ? 'rgba(168,85,247,0.2)' : active ? 'linear-gradient(135deg, #c026d3, #7c3aed)' : 'rgba(255,255,255,0.05)',
                  color: done ? '#c084fc' : active ? 'white' : 'rgba(100,116,139,0.6)',
                  border: `1px solid ${done ? 'rgba(168,85,247,0.3)' : active ? 'transparent' : 'rgba(255,255,255,0.07)'}`
                }}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="text-xs font-semibold"
                style={{ color: active ? '#c084fc' : done ? '#a855f7' : 'rgba(100,116,139,0.6)' }}>
                {labels[i]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-2"
                style={{ background: done ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.06)' }} />
            )}
          </div>
        )
      })}
    </div>
  )

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="space-y-6">
        <BackBtn to="/dashboard" />
        <div className="max-w-md mx-auto text-center py-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 0 24px rgba(16,185,129,0.15)' }}>
            <CheckCircle2 className="w-11 h-11 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Deposit Submitted!</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Your transaction has been received and is pending verification. Your balance will update once confirmed.
          </p>
          {method === 'cashapp' ? (
            <div className="rounded-xl p-4 text-xs text-slate-400 break-all mb-6 text-left"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="font-semibold text-slate-300">CashApp Reference:</span> {cashappRef}
            </div>
          ) : (
            <div className="rounded-xl p-4 font-mono text-xs text-slate-500 break-all mb-6"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {txHash}
            </div>
          )}
          <Link to="/dashboard"
            className="inline-block py-3 px-8 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BackBtn to={method ? undefined : '/dashboard'} onClick={method ? resetAll : undefined} />

      {/* ── METHOD SELECTION ── */}
      {!method && (
        <div className="space-y-5">
          <p className="text-slate-400 text-sm">Choose how you want to deposit funds:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'crypto' as Method, icon: '₿', title: 'Cryptocurrency', sub: 'BTC, ETH, USDT (TRC-20 / ERC-20 / BEP-20), SOL & more', accent: '#c026d3' },
              { key: 'cashapp' as Method, icon: null, title: 'CashApp', sub: 'Send via CashApp — fast & easy', accent: '#7c3aed' },
            ].map(({ key, icon, title, sub, accent }) => (
              <button key={key}
                onClick={() => { setMethod(key); if (key === 'cashapp') setStep('address') }}
                className="group flex items-center gap-5 p-6 rounded-2xl hover:-translate-y-1 transition-all text-left w-full"
                style={{ ...panelStyle, border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)`, boxShadow: `0 6px 20px ${accent}30` }}>
                  {icon ?? <Smartphone className="w-7 h-7" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-base">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sub}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CRYPTO FLOW ── */}
      {method === 'crypto' && (
        <>
          <StepPill steps={['select', 'address', 'confirm']} labels={['Choose Chain', 'Wallet Address', 'Confirm']} />

          {/* STEP 1 — SELECT CHAIN */}
          {step === 'select' && (
            <div>
              <p className="text-slate-400 text-sm mb-5">Select the blockchain network to send your deposit on:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHAINS.map((chain) => (
                  <button key={chain.id} onClick={() => handleChainSelect(chain)}
                    className="group flex items-center gap-4 p-5 rounded-2xl hover:-translate-y-0.5 transition-all text-left w-full"
                    style={{ ...panelStyle, border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.3)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
                    <div className="w-13 h-13 rounded-xl flex items-center justify-center text-white text-2xl font-bold shrink-0 group-hover:scale-105 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 14px rgba(192,38,211,0.25)', width: '52px', height: '52px' }}>
                      {chain.display}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm">{chain.name}</p>
                      <p className="text-xs text-purple-400 mt-0.5 font-medium">{chain.network}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                      <ChevronRight className="w-4 h-4 text-purple-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — SHOW ADDRESS */}
          {step === 'address' && selectedChain && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* QR + address */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl p-6 space-y-5" style={panelStyle}>
                  {/* Chain badge */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <span className="text-lg font-bold text-purple-300">{selectedChain.display}</span>
                    <div>
                      <p className="text-xs font-bold text-purple-200">{selectedChain.name}</p>
                      <p className="text-[10px] text-purple-400">{selectedChain.network}</p>
                    </div>
                  </div>

                  {/* QR Code — white background so it's scannable */}
                  <div className="flex justify-center">
                    <div className="p-2 rounded-xl bg-white shadow-lg">
                      <img
                        src={qrUrl(selectedChain.address)}
                        alt={`${selectedChain.name} Wallet QR`}
                        className="w-44 h-44 rounded-lg"
                        crossOrigin="anonymous"
                      />
                    </div>
                  </div>

                  {/* Address copy */}
                  <div>
                    <label className={labelCls}>Wallet Address</label>
                    <div className="flex rounded-xl overflow-hidden"
                      style={{ background: 'rgba(5,7,12,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="px-3 py-3 text-slate-400 flex-1 font-mono text-xs truncate select-all">
                        {selectedChain.address}
                      </div>
                      <button type="button" onClick={handleCopy}
                        className="px-4 shrink-0 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{
                          borderLeft: '1px solid rgba(255,255,255,0.06)',
                          background: copied ? 'rgba(168,85,247,0.15)' : 'transparent',
                          color: copied ? '#c084fc' : 'rgba(148,163,184,0.7)'
                        }}>
                        {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className="rounded-xl p-3 flex gap-3 items-start"
                    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      Only send <span className="font-bold text-amber-300">{selectedChain.symbol}</span> via{' '}
                      <span className="font-bold text-amber-300">{selectedChain.network}</span> to this address.
                      Wrong asset or network = permanent loss of funds.
                    </p>
                  </div>

                  <button onClick={() => setStep('confirm')}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                    I've completed the transfer →
                  </button>
                  <button onClick={() => setStep('select')}
                    className="w-full text-xs text-slate-600 hover:text-purple-400 transition-colors py-1">
                    ← Choose a different chain
                  </button>
                </div>
              </div>

              {/* How-to guide */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl p-6 h-full" style={panelStyle}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 12px rgba(192,38,211,0.3)' }}>
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>How to deposit</h3>
                  </div>
                  <div className="space-y-5">
                    {[
                      { n: 1, t: 'Copy the wallet address', d: 'Use the copy button on the left to copy the exact wallet address.' },
                      { n: 2, t: `Use the ${selectedChain.network}`, d: `Make sure your wallet or exchange is set to the ${selectedChain.network} before sending.` },
                      { n: 3, t: `Send your ${selectedChain.symbol}`, d: `Send the amount of ${selectedChain.symbol} you wish to deposit to the address above.` },
                      { n: 4, t: 'Confirm your transaction', d: 'After sending, click "I\'ve completed the transfer" and provide your transaction hash for verification.' },
                    ].map(({ n, t, d }) => (
                      <div key={n} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                          {n}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200 text-sm">{t}</p>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — CONFIRM */}
          {step === 'confirm' && selectedChain && (
            <div className="max-w-xl mx-auto">
              <div className="rounded-2xl p-6 space-y-5" style={panelStyle}>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Confirm Your Deposit</h3>
                <p className="text-sm text-slate-400">Provide your transaction details so we can verify on the blockchain.</p>

                <div className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <span className="text-xl font-bold text-purple-300">{selectedChain.display}</span>
                  <div>
                    <p className="text-sm font-bold text-purple-200">{selectedChain.name} — {selectedChain.network}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">{selectedChain.address}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Amount Sent ({selectedChain.symbol})</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">{selectedChain.display}</span>
                      <input type="number" step="0.000001" placeholder="0.00"
                        value={amount} onChange={e => setAmount(e.target.value)}
                        className="w-full text-sm rounded-xl pl-9 pr-4 py-3.5 outline-none transition-all"
                        style={inputStyle}
                        onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                        onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Transaction Hash (TxID)</label>
                    <input type="text" placeholder="Paste your transaction hash here..."
                      value={txHash} onChange={e => setTxHash(e.target.value)}
                      className="w-full text-sm rounded-xl px-4 py-3.5 outline-none font-mono transition-all"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                      onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl flex items-start gap-2 text-sm text-red-400"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />{submitError}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={!txHash || !amount}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                  <CheckCircle2 className="w-5 h-5" /> Submit for Verification
                </button>
                <button onClick={() => setStep('address')}
                  className="w-full text-xs text-slate-600 hover:text-purple-400 transition-colors py-1">
                  ← Back to wallet address
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── CASHAPP FLOW ── */}
      {method === 'cashapp' && !submitted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left — CashApp details */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl p-6 space-y-5" style={panelStyle}>
              <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <Smartphone className="w-5 h-5 text-purple-300" />
                <div>
                  <p className="text-xs font-bold text-purple-200">CashApp</p>
                  <p className="text-[10px] text-purple-400">Instant deposit</p>
                </div>
              </div>

              {/* CashApp QR — white bg so it's scannable */}
              <div className="flex justify-center">
                <div className="p-2 rounded-xl bg-white shadow-lg">
                  <img
                    src={qrUrl(`https://cash.app/${CASHAPP_TAG}`)}
                    alt="CashApp QR Code"
                    className="w-44 h-44 rounded-lg"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>

              {/* Tag copy */}
              <div>
                <label className={labelCls}>CashApp Tag</label>
                <div className="flex rounded-xl overflow-hidden"
                  style={{ background: 'rgba(5,7,12,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="px-4 py-3 text-purple-300 flex-1 font-bold text-sm select-all">{CASHAPP_TAG}</div>
                  <button type="button" onClick={handleCopyTag}
                    className="px-4 shrink-0 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{
                      borderLeft: '1px solid rgba(255,255,255,0.06)',
                      background: copiedTag ? 'rgba(168,85,247,0.15)' : 'transparent',
                      color: copiedTag ? '#c084fc' : 'rgba(148,163,184,0.7)'
                    }}>
                    {copiedTag ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Important notice */}
              <div className="rounded-xl p-4 flex gap-3 items-start"
                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)' }}>
                  <Info className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-purple-200 uppercase tracking-wide mb-1">Important — Description Required</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    When sending, you <span className="font-bold text-white underline">must</span> set the description to{' '}
                    <span className="font-bold text-purple-300 px-1 py-0.5 rounded" style={{ background: 'rgba(168,85,247,0.15)' }}>
                      "Goods and Services"
                    </span>. Payments without this will not be credited.
                  </p>
                </div>
              </div>

              <div className="rounded-xl p-3 flex gap-3 items-start"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  After sending, fill the confirmation form on the right with your amount and CashApp reference number.
                </p>
              </div>
            </div>
          </div>

          {/* Right — How-to + confirm form */}
          <div className="lg:col-span-7 space-y-5">
            {/* Steps guide */}
            <div className="rounded-2xl p-6" style={panelStyle}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 12px rgba(192,38,211,0.3)' }}>
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>How to deposit via CashApp</h3>
              </div>
              <div className="space-y-4">
                {[
                  { n: 1, t: 'Open CashApp', d: 'Launch CashApp on your phone and tap the "$" (Pay) button.' },
                  { n: 2, t: `Search for ${CASHAPP_TAG}`, d: `Type ${CASHAPP_TAG} in the search bar to find our account.` },
                  { n: 3, t: 'Enter the amount', d: 'Enter the dollar amount you want to deposit (minimum $500).' },
                  { n: 4, t: 'Set description to "Goods and Services"', d: 'Tap the note/description field and type exactly: Goods and Services.' },
                  { n: 5, t: 'Send & confirm below', d: 'Tap Pay, then fill the confirmation form with your reference number.' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)', color: '#c084fc' }}>
                      {n}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200 text-sm">{t}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm form */}
            <div className="rounded-2xl p-6 space-y-5" style={panelStyle}>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Confirm Your CashApp Payment</h3>
              <p className="text-sm text-slate-400">After sending, enter the details below so we can credit your account.</p>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Amount Sent (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-sm">$</span>
                    <input type="number" step="1" min="500" placeholder="0.00"
                      value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full text-sm rounded-xl pl-8 pr-4 py-3.5 outline-none transition-all"
                      style={inputStyle}
                      onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                      onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>CashApp Payment Reference / Note</label>
                  <input type="text" placeholder="e.g. #ABC123 or transaction note..."
                    value={cashappRef} onChange={e => setCashappRef(e.target.value)}
                    className="w-full text-sm rounded-xl px-4 py-3.5 outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.5)'}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)' }}>
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <p className="text-xs text-purple-300 font-medium">
                    Remember: description must be{' '}
                    <span className="px-1 rounded font-bold" style={{ background: 'rgba(168,85,247,0.15)' }}>"Goods and Services"</span>
                  </p>
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!cashappRef || !amount}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                <CheckCircle2 className="w-5 h-5" /> Submit for Verification
              </button>
              <button onClick={resetAll}
                className="w-full text-xs text-slate-600 hover:text-purple-400 transition-colors py-1">
                ← Choose a different deposit method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
