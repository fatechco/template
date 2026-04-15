"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const FALLBACK_CURRENCIES: CurrencyInfo[] = [
  { code: "EGP", name: "Egyptian Pound", symbol: "EGP", rate: 1 },
  { code: "USD", name: "US Dollar", symbol: "$", rate: 0.0204 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.0188 },
  { code: "AED", name: "UAE Dirham", symbol: "AED", rate: 0.075 },
  { code: "SAR", name: "Saudi Riyal", symbol: "SAR", rate: 0.0765 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.0162 },
  { code: "QAR", name: "Qatari Riyal", symbol: "QAR", rate: 0.0743 },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KWD", rate: 0.00627 },
];

interface CurrencyContextType {
  selectedCurrency: string;
  currencies: CurrencyInfo[];
  setCurrency: (code: string) => void;
  formatPrice: (amountEGP: number | null | undefined) => string;
  convertFromEGP: (amountEGP: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>(FALLBACK_CURRENCIES);

  useEffect(() => {
    const saved = localStorage.getItem("kemedar-currency");
    if (saved) setSelectedCurrency(saved);
  }, []);

  const setCurrency = useCallback((code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem("kemedar-currency", code);
  }, []);

  const convertFromEGP = useCallback((amountEGP: number) => {
    if (selectedCurrency === "EGP") return amountEGP;
    const curr = currencies.find((c) => c.code === selectedCurrency);
    return curr ? amountEGP * curr.rate : amountEGP;
  }, [selectedCurrency, currencies]);

  const formatPrice = useCallback((amountEGP: number | null | undefined) => {
    if (amountEGP == null) return "Contact for price";
    const converted = convertFromEGP(amountEGP);
    const curr = currencies.find((c) => c.code === selectedCurrency);
    const symbol = curr?.symbol || selectedCurrency;
    return `${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${symbol}`;
  }, [convertFromEGP, selectedCurrency, currencies]);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, currencies, setCurrency, formatPrice, convertFromEGP }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}
