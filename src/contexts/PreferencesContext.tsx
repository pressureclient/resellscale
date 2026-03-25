import { createContext, useContext, useState, ReactNode } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'ZAR';
export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh-CN';

interface PreferencesContextType {
  currency: CurrencyCode;
  language: LanguageCode;
  setCurrency: (currency: CurrencyCode) => void;
  setLanguage: (language: LanguageCode) => void;
  formatCurrency: (usdAmount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Define static exchange rates relative to USD
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1500,
  ZAR: 19.5,
};

const LOCALE_MAP: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  NGN: 'en-NG',
  ZAR: 'en-ZA'
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('preferred_currency') as CurrencyCode) || 'USD';
  });
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('preferred_language') as LanguageCode) || 'en';
  });

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferred_currency', newCurrency);
  };

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem('preferred_language', newLanguage);
    // Setting googtrans cookie for global translate script
    document.cookie = `googtrans=/en/${newLanguage}; path=/`;
    document.cookie = `googtrans=/en/${newLanguage}; domain=.${window.location.hostname}; path=/`;
  };

  const formatCurrency = (usdAmount: number) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = usdAmount * rate;
    return new Intl.NumberFormat(LOCALE_MAP[currency], {
      style: 'currency',
      currency: currency,
    }).format(converted);
  };

  return (
    <PreferencesContext.Provider value={{ currency, language, setCurrency, setLanguage, formatCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
