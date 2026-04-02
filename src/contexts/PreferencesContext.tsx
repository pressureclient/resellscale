import React, { createContext, useContext, useState, useEffect } from 'react'

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS'
type LanguageName = 'English' | 'Spanish (Español)' | 'French (Français)' | 'Mandarin (中文)' | 'Arabic (العربية)' | 'Russian (Русский)'

interface PreferencesContextType {
  language: LanguageName
  setLanguage: (lang: LanguageName) => void
  currency: CurrencyCode
  setCurrency: (curr: CurrencyCode) => void
  formatCurrency: (amountInUSD: number) => string
}

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  NGN: 1550,
  GHS: 13
}

export const LANGUAGE_CODES: Record<LanguageName, string> = {
  'English': 'en',
  'Spanish (Español)': 'es',
  'French (Français)': 'fr',
  'Mandarin (中文)': 'zh-CN',
  'Arabic (العربية)': 'ar',
  'Russian (Русский)': 'ru'
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageName>('English')
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')

  useEffect(() => {
    const savedLang = localStorage.getItem('rc_pref_lang') as LanguageName
    const savedCurr = localStorage.getItem('rc_pref_curr') as CurrencyCode
    if (savedLang && LANGUAGE_CODES[savedLang]) setLanguageState(savedLang)
    if (savedCurr && EXCHANGE_RATES[savedCurr]) setCurrencyState(savedCurr)
  }, [])

  const setLanguage = (lang: LanguageName) => {
    setLanguageState(lang)
    localStorage.setItem('rc_pref_lang', lang)
  }

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr)
    localStorage.setItem('rc_pref_curr', curr)
  }

  const formatCurrency = (amountInUSD: number) => {
    const rate = EXCHANGE_RATES[currency] || 1
    const converted = amountInUSD * rate
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(converted)
  }

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, currency, setCurrency, formatCurrency }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
