import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

// ── Supported Languages ────────────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',    nativeLabel: 'English',       dir: 'ltr', flag: '🇬🇧' },
  { code: 'ar', label: 'Arabic',     nativeLabel: 'العربية',       dir: 'rtl', flag: '🇸🇦' },
  { code: 'tr', label: 'Turkish',    nativeLabel: 'Türkçe',        dir: 'ltr', flag: '🇹🇷' },
  { code: 'fr', label: 'French',     nativeLabel: 'Français',      dir: 'ltr', flag: '🇫🇷' },
  { code: 'ru', label: 'Russian',    nativeLabel: 'Русский',       dir: 'ltr', flag: '🇷🇺' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa',        dir: 'ltr', flag: '🇮🇩' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt',   dir: 'ltr', flag: '🇻🇳' },
  { code: 'de', label: 'German',     nativeLabel: 'Deutsch',       dir: 'ltr', flag: '🇩🇪' },
  { code: 'ur', label: 'Urdu',       nativeLabel: 'اردو',          dir: 'rtl', flag: '🇵🇰' },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिन्दी',        dir: 'ltr', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali',    nativeLabel: 'বাংলা',         dir: 'ltr', flag: '🇧🇩' },
  { code: 'zh', label: 'Chinese',    nativeLabel: '中文',           dir: 'ltr', flag: '🇨🇳' },
  { code: 'es', label: 'Spanish',    nativeLabel: 'Español',       dir: 'ltr', flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português',     dir: 'ltr', flag: '🇧🇷' },
  { code: 'it', label: 'Italian',    nativeLabel: 'Italiano',      dir: 'ltr', flag: '🇮🇹' },
  { code: 'th', label: 'Thai',       nativeLabel: 'ภาษาไทย',      dir: 'ltr', flag: '🇹🇭' },
  { code: 'ja', label: 'Japanese',   nativeLabel: '日本語',         dir: 'ltr', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean',     nativeLabel: '한국어',         dir: 'ltr', flag: '🇰🇷' },
  { code: 'fa', label: 'Persian',    nativeLabel: 'فارسی',         dir: 'rtl', flag: '🇮🇷' },
];

export const RTL_LANGS = ['ar', 'ur', 'fa', 'he'];

const STORAGE_KEY = 'kemedar_lang';
const CACHE_KEY = 'kemedar_translations_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// ── Context ───────────────────────────────────────────────────────────────────
const I18nContext = createContext({
  lang: 'en',
  dir: 'ltr',
  isRTL: false,
  t: (key) => key,
  setLang: () => {},
  loading: false,
  langMeta: SUPPORTED_LANGUAGES[0],
});

export const useI18n = () => useContext(I18nContext);

// Convenience hook — just get the t() function
export const useT = () => useContext(I18nContext).t;

// ── Provider ──────────────────────────────────────────────────────────────────
export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const isRTL = RTL_LANGS.includes(lang);
  const dir = isRTL ? 'rtl' : 'ltr';

  const loadTranslations = useCallback(async (targetLang) => {
    if (targetLang === 'en') {
      // English is the default — no need to fetch, t() returns the key itself
      // But we still load to have en values for all keys
    }

    // Check cache
    try {
      const cached = JSON.parse(sessionStorage.getItem(`${CACHE_KEY}_${targetLang}`) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        setTranslations(cached.data);
        return;
      }
    } catch (_) {}

    setLoading(true);
    try {
      const res = await base44.functions.invoke('getTranslations', { lang: targetLang });
      const data = res?.data?.translations || {};
      setTranslations(data);
      // Cache it
      sessionStorage.setItem(`${CACHE_KEY}_${targetLang}`, JSON.stringify({ ts: Date.now(), data }));
    } catch (err) {
      console.warn('i18n: failed to load translations', err);
      setTranslations({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTranslations(lang);
    // Apply dir to document
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir, loadTranslations]);

  const setLang = useCallback((newLang) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
  }, []);

  // t(key, fallback?) — returns translated string
  const t = useCallback((key, fallback) => {
    if (!key) return fallback || '';
    if (lang === 'en') {
      // For English, return the stored en value or the key itself as readable text
      return translations[key] || fallback || key.replace(/_/g, ' ');
    }
    return translations[key] || fallback || key.replace(/_/g, ' ');
  }, [translations, lang]);

  return (
    <I18nContext.Provider value={{ lang, dir, isRTL, t, setLang, loading, langMeta }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Utility: translate a location entity name ─────────────────────────────────
export function useLocationName(entityId, entityType, fallbackName) {
  const { lang } = useI18n();
  const [name, setName] = useState(fallbackName || '');

  useEffect(() => {
    if (!entityId || lang === 'en') { setName(fallbackName || ''); return; }
    base44.entities.TranslationLocation
      .filter({ entity_id: entityId, entity_type: entityType })
      .then(results => {
        if (results[0]?.[lang]) setName(results[0][lang]);
        else setName(fallbackName || '');
      })
      .catch(() => setName(fallbackName || ''));
  }, [entityId, entityType, lang, fallbackName]);

  return name;
}