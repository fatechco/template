import { useState } from "react";
import { X, Search } from "lucide-react";

const CURRENCIES = [
  { flag: "🇺🇸", code: "USD", symbol: "$", name: "US Dollar" },
  { flag: "🇪🇬", code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { flag: "🇦🇪", code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { flag: "🇸🇦", code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { flag: "🇶🇦", code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { flag: "🇰🇼", code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { flag: "🇧🇭", code: "BHD", symbol: "BD", name: "Bahraini Dinar" },
  { flag: "🇴🇲", code: "OMR", symbol: "ر.ع.", name: "Omani Rial" },
  { flag: "🇬🇧", code: "GBP", symbol: "£", name: "British Pound" },
  { flag: "🇪🇺", code: "EUR", symbol: "€", name: "Euro" },
  { flag: "🇨🇭", code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { flag: "🇯🇵", code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { flag: "🇨🇳", code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { flag: "🇮🇳", code: "INR", symbol: "₹", name: "Indian Rupee" },
  { flag: "🇷🇺", code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { flag: "🇹🇷", code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { flag: "🇨🇦", code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { flag: "🇦🇺", code: "AUD", symbol: "$", name: "Australian Dollar" },
];

export default function CurrencySheet({ selected, onSelect, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
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
          <h3 className="font-black text-[#1F2937] text-base">Select Currency</h3>
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
              placeholder="Search currency..."
              className="bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none flex-1"
            />
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(75vh - 130px)" }}>
          {filtered.map((cur) => (
            <button
              key={cur.code}
              onClick={() => onSelect(cur)}
              className={`flex items-center gap-4 w-full px-5 py-3.5 border-b border-[#F9FAFB] transition-colors ${
                selected.code === cur.code ? "bg-orange-50" : "active:bg-[#F9FAFB]"
              }`}
            >
              <span className="text-2xl">{cur.flag}</span>
              <div className="flex-1 text-left">
                <p className={`text-sm ${selected.code === cur.code ? "font-black text-[#FF6B00]" : "font-semibold text-[#1F2937]"}`}>
                  {cur.code} {cur.symbol}
                </p>
                <p className="text-[11px] text-[#9CA3AF]">{cur.name}</p>
              </div>
              {selected.code === cur.code && (
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