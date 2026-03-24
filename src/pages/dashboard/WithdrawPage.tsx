import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, ChevronRight, Check, Clock, AlertTriangle } from 'lucide-react'

const CHAINS = [
  { id: 'btc',        name: 'Bitcoin',       symbol: 'BTC',  network: 'Bitcoin Network',    display: '₿',  minWithdraw: '$100', fee: '1.8%' },
  { id: 'eth',        name: 'Ethereum',      symbol: 'ETH',  network: 'ERC-20 (Ethereum)',  display: 'Ξ',  minWithdraw: '$100', fee: '2%'   },
  { id: 'usdt-trc20', name: 'USDT (TRC-20)', symbol: 'USDT', network: 'TRC-20 (TRON)',      display: '₮',  minWithdraw: '$100', fee: '1.5%' },
  { id: 'usdt-erc20', name: 'USDT (ERC-20)', symbol: 'USDT', network: 'ERC-20 (Ethereum)',  display: '₮',  minWithdraw: '$100', fee: '2%'   },
  { id: 'usdt-bep20', name: 'USDT (BEP-20)', symbol: 'USDT', network: 'BEP-20 (BSC)',       display: '₮',  minWithdraw: '$100', fee: '1.8%' },
  { id: 'sol',        name: 'Solana',        symbol: 'SOL',  network: 'Solana Network',     display: '◎',  minWithdraw: '$100', fee: '1.5%' },
]

type Step = 'select' | 'form' | 'pending'

const panelStyle = {
  background: 'rgba(13,17,25,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
}

const inputBase = {
  background: 'rgba(5,7,12,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#e2e8f0',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
}

export default function WithdrawPage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedChain, setSelectedChain] = useState<typeof CHAINS[0] | null>(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [errors, setErrors] = useState<{ wallet?: string; amount?: string }>({})
  const [withdrawError, setWithdrawError] = useState('')

  /* Load real balance from DB */
  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('balance').eq('id', user.id).single()
      if (profile) setBalance(Number(profile.balance) || 0)
    }
    load()
  }, [])

  const handleChainSelect = (chain: typeof CHAINS[0]) => {
    setSelectedChain(chain)
    setStep('form')
  }

  const validate = () => {
    const errs: typeof errors = {}
    if (!walletAddress.trim()) errs.wallet = 'Please enter your wallet address.'
    else if (walletAddress.trim().length < 20) errs.wallet = 'This does not look like a valid wallet address.'
    const num = parseFloat(amount)
    if (!amount) errs.amount = 'Please enter an amount.'
    else if (isNaN(num) || num <= 0) errs.amount = 'Please enter a valid amount.'
    else if (num < 100) errs.amount = 'Minimum withdrawal is $100.'
    else if (num > balance) errs.amount = `Insufficient balance. Your available balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`
    return errs
  }

  const handleWithdraw = async () => {
    const errs = validate()
    setErrors(errs)
    setWithdrawError('')
    if (Object.keys(errs).length === 0) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setWithdrawError('You must be logged in.'); return }
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'withdraw',
        amount: parseFloat(amount),
        asset: selectedChain ? selectedChain.name : 'USD',
        network: selectedChain ? selectedChain.network : '',
        wallet_address: walletAddress,
        status: 'pending',
      })
      if (error) {
        setWithdrawError('Submission failed: ' + error.message + '. Please contact support.')
        return
      }
      setStep('pending')
    }
  }

  const ErrorMsg = ({ msg }: { msg?: string }) => msg ? (
    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />{msg}
    </p>
  ) : null

  const stepIndex = ['select', 'form', 'pending'].indexOf(step)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Link to="/dashboard"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>Withdraw Funds</h2>
          <p className="text-slate-400 text-sm mt-0.5">Withdrawals are reviewed and approved within 24 hours</p>
        </div>
      </div>

      {/* Step pill */}
      <div className="flex items-center gap-1 rounded-2xl px-5 py-3" style={panelStyle}>
        {(['select', 'form', 'pending'] as Step[]).map((s, i) => {
          const labels = ['Select Chain', 'Withdrawal Details', 'Pending Review']
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
                <span className="text-xs font-semibold hidden sm:block"
                  style={{ color: active ? '#c084fc' : done ? '#a855f7' : 'rgba(100,116,139,0.6)' }}>
                  {labels[i]}
                </span>
              </div>
              {i < 2 && <div className="flex-1 h-px mx-2"
                style={{ background: done ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.06)' }} />}
            </div>
          )
        })}
      </div>

      {/* STEP 1 — SELECT CHAIN */}
      {step === 'select' && (
        <div>
          {/* Balance indicator */}
          <div className="flex items-center justify-between mb-5 p-4 rounded-xl"
            style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)' }}>
            <span className="text-sm text-slate-400">Available Balance</span>
            <span className="text-lg font-black text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-5">Select the asset and network you'd like to withdraw from:</p>
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
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-slate-500">Fee: <span className="text-purple-400 font-semibold">{chain.fee}</span></span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 — WITHDRAWAL FORM */}
      {step === 'form' && selectedChain && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Chain info card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl p-6 relative overflow-hidden text-white"
              style={{ background: 'linear-gradient(135deg, #2d0a6e, #1a0533, #0a0618)', border: '1px solid rgba(168,85,247,0.25)', boxShadow: '0 8px 32px rgba(168,85,247,0.15)' }}>
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.3), transparent)', filter: 'blur(24px)', transform: 'translate(30%, -30%)' }} />
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-4 relative z-10"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                {selectedChain.display}
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">{selectedChain.network}</p>
              <h3 className="text-xl font-extrabold mb-1 relative z-10">{selectedChain.name}</h3>
              <div className="mt-5 pt-4 relative z-10 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { l: 'Your Balance', v: `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
                  { l: 'Minimum Withdraw', v: selectedChain.minWithdraw },
                  { l: 'Withdrawal Fee', v: selectedChain.fee },
                  { l: 'Processing Time', v: 'Up to 24 hrs' },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between items-center text-sm">
                    <span className="text-white/60">{l}</span>
                    <span className="font-bold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setStep('select')}
              className="w-full text-xs text-slate-600 hover:text-purple-400 transition-colors mt-3 py-1">
              ← Choose a different chain
            </button>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl p-6 flex flex-col" style={panelStyle}>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Withdrawal Details</h3>
              <p className="text-sm text-slate-400 mb-6">Enter your wallet address and the amount you wish to withdraw.</p>

              <div className="space-y-5 flex-1">
                {/* Wallet address */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Your {selectedChain.name} Wallet Address{' '}
                    <span className="text-purple-400 normal-case font-semibold">({selectedChain.network})</span>
                  </label>
                  <input type="text" placeholder={`Paste your ${selectedChain.symbol} address here...`}
                    value={walletAddress}
                    onChange={e => { setWalletAddress(e.target.value); setErrors(v => ({ ...v, wallet: undefined })) }}
                    className="w-full text-sm rounded-xl px-4 py-3.5 outline-none font-mono transition-all"
                    style={{ ...inputBase, borderColor: errors.wallet ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
                    onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = errors.wallet ? 'rgba(239,68,68,0.6)' : 'rgba(168,85,247,0.5)'}
                    onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = errors.wallet ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
                  <ErrorMsg msg={errors.wallet} />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Amount (USD equivalent)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold">$</span>
                    <input type="number" step="0.01" placeholder="0.00"
                      value={amount}
                      onChange={e => { setAmount(e.target.value); setErrors(v => ({ ...v, amount: undefined })) }}
                      className="w-full text-sm rounded-xl pl-8 pr-4 py-3.5 outline-none transition-all"
                      style={{ ...inputBase, borderColor: errors.amount ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)' }}
                      onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = errors.amount ? 'rgba(239,68,68,0.6)' : 'rgba(168,85,247,0.5)'}
                      onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = errors.amount ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'} />
                  </div>
                  <ErrorMsg msg={errors.amount} />
                  <p className="text-xs text-slate-600 mt-1.5">
                    Min: $100 · Fee: <span className="text-purple-400 font-semibold">{selectedChain.fee}</span>
                    {' '}· Balance: <span className="text-white font-semibold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>

                {/* Warning */}
                <div className="rounded-xl p-3 flex gap-3 items-start"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Make sure your address is on the <span className="font-bold text-amber-300">{selectedChain.network}</span> network.
                    Sending to the wrong network results in permanent loss of funds.
                  </p>
                </div>
              </div>

              {withdrawError && (
                <div className="mt-4 p-3 rounded-xl flex items-start gap-2 text-sm text-red-400"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{withdrawError}
                </div>
              )}

              <button onClick={handleWithdraw} disabled={!walletAddress || !amount}
                className="mt-6 w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
                Request Withdrawal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — PENDING */}
      {step === 'pending' && selectedChain && (
        <div className="max-w-md mx-auto text-center py-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ background: 'rgba(168,85,247,0.5)' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <Clock className="w-12 h-12 text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Withdrawal Pending</h3>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Your request has been submitted and is awaiting admin approval. You will be notified once processed.
          </p>

          <div className="rounded-2xl p-5 text-left mb-6 space-y-3" style={panelStyle}>
            {[
              { l: 'Asset', v: `${selectedChain.name} (${selectedChain.symbol})` },
              { l: 'Network', v: selectedChain.network },
              { l: 'Amount', v: `$${parseFloat(amount).toLocaleString()}` },
              { l: 'Fee', v: selectedChain.fee },
              { l: 'Destination', v: walletAddress },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <span className="text-slate-500">{l}</span>
                <span className={`font-bold text-white ${l === 'Destination' ? 'font-mono text-xs max-w-[180px] truncate' : ''}`}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-1">
              <span className="text-slate-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', border: '1px solid rgba(168,85,247,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> Pending Approval
              </span>
            </div>
          </div>

          <Link to="/dashboard"
            className="inline-block py-3 px-8 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #c026d3, #7c3aed)', boxShadow: '0 4px 16px rgba(192,38,211,0.3)' }}>
            Back to Dashboard
          </Link>
          <p className="text-xs text-slate-600 mt-4">Track your withdrawal status in Transactions</p>
        </div>
      )}
    </div>
  )
}
