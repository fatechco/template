import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const STORAGE_KEY = 'kemedar_currency';



const CurrencyContext = createContext({
  selectedCurrency: 'EGP',
  currencies: [],
  formatPrice: (egp) => `${Number(egp).toLocaleString()} EGP`,
  setCurrency: () => {},
  currencySymbol: 'EGP',
  loading: false,
});

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'EGP'
  );
  const [currencies, setCurrencies] = useState([]);
  const [rateMap, setRateMap] = useState({}); // { USD: { symbol, rateToEGP, decimals }, ... }
  const [loading, setLoading] = useState(true);

  // Load currencies from DB
  useEffect(() => {
    base44.entities.Currency.list()
      .then((data) => {
        if (data && data.length > 0) {
          setCurrencies(data);
          // exchange_rate convention: how many of that currency = 1 USD
          // EGP = 48.5 → $1 = 48.5 EGP
          // USD = 1    → $1 = $1
          // EUR = 0.92 → $1 = €0.92
          // To convert amountEGP → targetCurrency:
          //   amountUSD = amountEGP / egpRate
          //   amountTarget = amountUSD * targetRate
          const egpRecord = data.find(c => c.code === 'EGP');
          const egpRate = egpRecord?.exchange_rate || 48.5;

          const map = {};
          data.forEach(c => {
            if (!c.code) return;
            map[c.code] = {
              symbol: c.symbol || c.code,
              exchangeRate: c.exchange_rate || 1, // per USD
              decimals: c.code === 'EGP' ? 0 : (c.code === 'KWD' ? 3 : 2),
            };
          });
          map._egpRate = egpRate;
          setRateMap(map);
        }
      })
      .catch(() => {
        // Fallback map using direct EGP multipliers
        const map = {
          _egpRate: 48.5,
          EGP: { symbol: 'EGP', exchangeRate: 48.5, decimals: 0 },
          USD: { symbol: '$',   exchangeRate: 1,    decimals: 2 },
          EUR: { symbol: '€',   exchangeRate: 0.92, decimals: 2 },
          AED: { symbol: 'AED', exchangeRate: 3.67, decimals: 2 },
          SAR: { symbol: 'SAR', exchangeRate: 3.75, decimals: 2 },
          GBP: { symbol: '£',   exchangeRate: 0.79, decimals: 2 },
          QAR: { symbol: 'QAR', exchangeRate: 3.64, decimals: 2 },
          KWD: { symbol: 'KWD', exchangeRate: 0.307,decimals: 3 },
        };
        setRateMap(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const setCurrency = useCallback((code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setSelectedCurrency(code);
  }, []);

  const formatPrice = useCallback((amountEGP) => {
    if (amountEGP == null || isNaN(amountEGP)) return '—';
    const amount = Number(amountEGP);
    if (amount === 0) return '—';

    const egpRate = rateMap._egpRate || 48.5;
    const info = rateMap[selectedCurrency];

    if (!info) return `${amount.toLocaleString()} EGP`;

    // Convert EGP → USD → target currency
    const amountUSD = amount / egpRate;
    const converted = selectedCurrency === 'EGP' ? amount : amountUSD * info.exchangeRate;

    const { decimals, symbol } = info;

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (selectedCurrency === 'EGP') return `${formatted} EGP`;
    if (['$', '€', '£'].includes(symbol)) return `${symbol}${formatted}`;
    return `${symbol} ${formatted}`;
  }, [selectedCurrency, rateMap]);

  const currencySymbol = rateMap[selectedCurrency]?.symbol || selectedCurrency;

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      currencies,
      formatPrice,
      setCurrency,
      currencySymbol,
      loading,
      rateMap,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}