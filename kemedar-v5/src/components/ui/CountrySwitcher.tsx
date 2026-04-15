// @ts-nocheck
"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

const COUNTRIES = [
  { name: "Egypt", flag: "🇪🇬" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "USA", flag: "🇺🇸" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
];

export default function CountrySwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(COUNTRIES[0]);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (country) => {
    setSelected(country);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs px-2 py-1 rounded hover:bg-white/10 border border-gray-500 hover:border-white"
      >
        <span>{selected.flag}</span>
        <span className="font-black">{selected.name}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-[300] overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-orange-400 text-gray-700"
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.name}
                onClick={() => handleSelect(c)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-orange-50 transition-colors ${selected.name === c.name ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
              >
                <span className="text-base">{c.flag}</span>
                <span className="flex-1 font-semibold">{c.name}</span>
                {selected.name === c.name && <Check size={12} className="text-orange-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}