"use client";
// @ts-nocheck
import { useState } from "react";
import { X, Search } from "lucide-react";

const COUNTRIES = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇪🇬", name: "Egypt" },
  { flag: "🇦🇪", name: "United Arab Emirates" },
  { flag: "🇸🇦", name: "Saudi Arabia" },
  { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇰🇼", name: "Kuwait" },
  { flag: "🇧🇭", name: "Bahrain" },
  { flag: "🇴🇲", name: "Oman" },
  { flag: "🇯🇴", name: "Jordan" },
  { flag: "🇱🇧", name: "Lebanon" },
  { flag: "🇮🇶", name: "Iraq" },
  { flag: "🇾🇪", name: "Yemen" },
  { flag: "🇲🇦", name: "Morocco" },
  { flag: "🇩🇿", name: "Algeria" },
  { flag: "🇹🇳", name: "Tunisia" },
  { flag: "🇱🇾", name: "Libya" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇪🇸", name: "Spain" },
  { flag: "🇷🇺", name: "Russia" },
  { flag: "🇹🇷", name: "Turkey" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇧🇩", name: "Bangladesh" },
  { flag: "🇨🇳", name: "China" },
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇮🇩", name: "Indonesia" },
  { flag: "🇵🇭", name: "Philippines" },
  { flag: "🇳🇬", name: "Nigeria" },
  { flag: "🇿🇦", name: "South Africa" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇧🇷", name: "Brazil" },
];

export default function CountrySheet({ selected, onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white rounded-t-3xl shadow-2xl"
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
          <h3 className="font-black text-[#1F2937] text-base">Select Country</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 py-2">
            <Search size={15} className="text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none flex-1"
            />
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(75vh - 130px)" }}>
          {filtered.map((country) => (
            <button
              key={country.name}
              onClick={() => onSelect(country)}
              className={`flex items-center gap-4 w-full px-5 py-3.5 border-b border-[#F9FAFB] transition-colors ${
                selected.name === country.name ? "bg-orange-50" : "active:bg-[#F9FAFB]"
              }`}
            >
              <span className="text-2xl">{country.flag}</span>
              <span className={`text-sm flex-1 text-left ${
                selected.name === country.name ? "font-black text-[#FF6B00]" : "font-semibold text-[#1F2937]"
              }`}>
                {country.name}
              </span>
              {selected.name === country.name && (
                <span className="w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">✓</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}