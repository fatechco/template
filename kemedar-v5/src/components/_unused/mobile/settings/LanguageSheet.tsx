// @ts-nocheck
import { X } from "lucide-react";

const LANGUAGES = [
  { flag: "🇬🇧", label: "English", code: "en" },
  { flag: "🇸🇦", label: "العربية", code: "ar" },
  { flag: "🇪🇸", label: "Español", code: "es" },
  { flag: "🇫🇷", label: "Français", code: "fr" },
  { flag: "🇷🇺", label: "Русский", code: "ru" },
  { flag: "🇹🇷", label: "Türkçe", code: "tr" },
  { flag: "🇵🇹", label: "Português", code: "pt" },
  { flag: "🇮🇩", label: "Bahasa Indonesia", code: "id" },
  { flag: "🇩🇪", label: "Deutsch", code: "de" },
  { flag: "🇮🇹", label: "Italiano", code: "it" },
  { flag: "🇮🇳", label: "हिन्दी", code: "hi" },
  { flag: "🇧🇩", label: "বাংলা", code: "bn" },
  { flag: "🇻🇳", label: "Tiếng Việt", code: "vi" },
  { flag: "🇨🇳", label: "中文", code: "zh" },
  { flag: "🇯🇵", label: "日本語", code: "ja" },
];

export default function LanguageSheet({ selected, onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white rounded-t-3xl shadow-2xl"
        style={{ maxHeight: "70vh" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
          <h3 className="font-black text-[#1F2937] text-base">Select Language</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 68px)" }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang)}
              className={`flex items-center gap-4 w-full px-5 py-3.5 border-b border-[#F9FAFB] transition-colors ${
                selected.code === lang.code ? "bg-orange-50" : "active:bg-[#F9FAFB]"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className={`text-sm flex-1 text-left ${selected.code === lang.code ? "font-black text-[#FF6B00]" : "font-semibold text-[#1F2937]"}`}>
                {lang.label}
              </span>
              {selected.code === lang.code && (
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