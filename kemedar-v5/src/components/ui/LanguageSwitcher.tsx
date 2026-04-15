// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from 'react';
import { useI18n, SUPPORTED_LANGUAGES } from '@/lib/i18n/provider';
import { Globe, Check, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher({ variant = 'default', className = '' }) {
  const { lang, setLang, langMeta } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = SUPPORTED_LANGUAGES.filter(l =>
    !search || l.label.toLowerCase().includes(search.toLowerCase()) || l.nativeLabel.includes(search)
  );

  const handleSelect = (code) => {
    setLang(code);
    setOpen(false);
    setSearch('');
  };

  if (variant === 'topbar') {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs px-2 py-1 rounded hover:bg-white/10 border border-gray-500 hover:border-white"
        >
          <span>{langMeta?.flag}</span>
          <span className="uppercase font-black">{lang}</span>
          <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[300] overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-orange-400 text-gray-700"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-orange-50 transition-colors ${lang === l.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="flex-1">
                    <span className="font-semibold">{l.nativeLabel}</span>
                    <span className="text-gray-400 text-xs ml-1">· {l.label}</span>
                  </span>
                  {lang === l.code && <Check size={12} className="text-orange-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-400 text-sm font-semibold text-gray-700 bg-white transition-all"
        >
          <span>{langMeta?.flag}</span>
          <span className="uppercase text-xs font-black">{lang}</span>
          <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-orange-400"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map(l => (
                <button
                  key={l.code}
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-orange-50 transition-colors ${lang === l.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="flex-1">
                    <span className="font-semibold">{l.nativeLabel}</span>
                    <span className="text-gray-400 text-xs ml-1">· {l.label}</span>
                  </span>
                  {lang === l.code && <Check size={12} className="text-orange-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default pill variant
  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 transition-all text-sm font-semibold"
      >
        <Globe size={15} />
        <span>{langMeta?.flag} {langMeta?.nativeLabel}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Select Language</p>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-400"
              autoFocus
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {filtered.map(l => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition-colors ${lang === l.code ? 'bg-orange-50' : ''}`}
              >
                <span className="text-xl">{l.flag}</span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${lang === l.code ? 'text-orange-600' : 'text-gray-900'}`}>{l.nativeLabel}</p>
                  <p className="text-xs text-gray-400">{l.label}</p>
                </div>
                {lang === l.code && <Check size={14} className="text-orange-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}