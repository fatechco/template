"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface I18nContextType {
  lang: string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
  setLang: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en", dir: "ltr", isRTL: false,
  t: (key: string, fallback?: string) => fallback || key,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState("en");
  const isRTL = ["ar", "ur", "fa"].includes(lang);
  const t = (key: string, fallback?: string) => fallback || key;
  return (
    <I18nContext.Provider value={{ lang, dir: isRTL ? "rtl" : "ltr", isRTL, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() { return useContext(I18nContext); }
export function useT() { return useContext(I18nContext).t; }
export function useLocationName() { return (entity: any) => entity?.name || entity?.nameAr || ""; }
export const SUPPORTED_LANGUAGES = ["en", "ar", "fr", "de", "es", "it", "pt", "tr", "ru", "zh", "ja", "ko", "hi", "ur", "fa", "nl", "sv", "pl", "id"];
