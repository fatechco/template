import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageSheet from "@/components/mobile/settings/LanguageSheet";
import CurrencySheet from "@/components/mobile/settings/CurrencySheet";
import CountrySheet from "@/components/mobile/settings/CountrySheet";
import SettingsToggleItem from "@/components/mobile/settings/SettingsToggleItem";
import SettingsNavItem from "@/components/mobile/settings/SettingsNavItem";
import SettingsSection from "@/components/mobile/settings/SettingsSection";

export default function AgencySettingsPage() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState({ flag: "🇬🇧", label: "English", code: "en" });
  const [currency, setCurrency] = useState({ flag: "🇺🇸", code: "USD", symbol: "$" });
  const [country, setCountry] = useState({ flag: "🇺🇸", name: "United States" });
  const [sheet, setSheet] = useState(null);
  const [modules, setModules] = useState({ kemedar: true, kemework: false, kemetro: false });
  const toggleModule = (k) => setModules((p) => ({ ...p, [k]: !p[k] }));
  const [notif, setNotif] = useState({ push: true, email: true, whatsapp: false, sms: false });
  const toggleNotif = (k) => setNotif((p) => ({ ...p, [k]: !p[k] }));
  const [darkMode, setDarkMode] = useState(false);
  const [mapView, setMapView] = useState("List");

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="px-4 py-5 space-y-5 pb-32">

        <h1 className="font-black text-[#1F2937] text-xl mb-2">Settings</h1>

        <SettingsSection label="PREFERENCES">
          <SettingsNavItem emoji="🌐" label="Language" value={`${language.flag} ${language.label}`} onPress={() => setSheet("language")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="💰" label="Currency" value={`${currency.flag} ${currency.code} ${currency.symbol}`} onPress={() => setSheet("currency")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="📍" label="Country" value={`${country.flag} ${country.name}`} onPress={() => setSheet("country")} />
        </SettingsSection>

        <SettingsSection label="MODULES">
          <SettingsToggleItem emoji="🏠" label="Kemedar" value={modules.kemedar} onChange={() => toggleModule("kemedar")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsToggleItem emoji="🔧" label="Kemework" value={modules.kemework} onChange={() => toggleModule("kemework")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsToggleItem emoji="🛒" label="Kemetro" value={modules.kemetro} onChange={() => toggleModule("kemetro")} />
          <p className="text-[11px] text-[#9CA3AF] px-4 pb-3 pt-1 leading-relaxed">
            Turn off modules you don't use to simplify your navigation
          </p>
        </SettingsSection>

        <SettingsSection label="NOTIFICATIONS">
          <SettingsToggleItem emoji="🔔" label="Push Notifications" value={notif.push} onChange={() => toggleNotif("push")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsToggleItem emoji="📧" label="Email Notifications" value={notif.email} onChange={() => toggleNotif("email")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsToggleItem emoji="💬" label="WhatsApp Updates" value={notif.whatsapp} onChange={() => toggleNotif("whatsapp")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsToggleItem emoji="📱" label="SMS Alerts" value={notif.sms} onChange={() => toggleNotif("sms")} />
        </SettingsSection>

        <SettingsSection label="DISPLAY">
          <SettingsToggleItem emoji="🌙" label="Dark Mode" value={darkMode} onChange={() => setDarkMode((v) => !v)} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <div className="flex items-center px-4 py-3 gap-3">
            <span className="text-xl flex-shrink-0">📐</span>
            <span className="flex-1 font-semibold text-[#1F2937] text-sm">Map View Default</span>
            <div className="flex gap-1">
              {["List", "Map"].map((opt) => (
                <button key={opt} onClick={() => setMapView(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${mapView === opt ? "bg-[#FF6B00] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection label="ACCOUNT">
          <SettingsNavItem emoji="👤" label="Edit Profile" onPress={() => navigate("/m/cp/agency/profile")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="🔒" label="Change Password" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="🔑" label="Privacy Settings" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="📱" label="Connected Accounts" value="Google · Facebook" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <button className="flex items-center gap-3 px-4 py-3 w-full" onClick={() => {}}>
            <span className="text-xl">🗑</span>
            <span className="font-semibold text-sm text-red-500">Delete Account</span>
          </button>
        </SettingsSection>

        <SettingsSection label="ABOUT & BENEFITS">
          <SettingsNavItem emoji="🌟" label="User Benefits" value="Discover what Kemedar offers you" onPress={() => navigate("/user-benefits")} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="ℹ️" label="About Kemedar" value="Our story and ecosystem" onPress={() => navigate("/about")} />
        </SettingsSection>

        <SettingsSection label="LEGAL">
          <SettingsNavItem emoji="📋" label="Terms & Conditions" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="🔏" label="Privacy Policy" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="⭐" label="Rate the App" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="📤" label="Share App" onPress={() => {}} />
          <div className="h-px bg-[#F3F4F6] mx-4" />
          <SettingsNavItem emoji="📞" label="Contact Support" onPress={() => navigate("/m/cp/agency/contact-kemedar")} />
        </SettingsSection>

        <p className="text-center text-[#9CA3AF] text-xs py-2">Kemedar v1.0.0</p>
      </div>

      {sheet === "language" && (
        <LanguageSheet selected={language} onSelect={(l) => { setLanguage(l); setSheet(null); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "currency" && (
        <CurrencySheet selected={currency} onSelect={(c) => { setCurrency(c); setSheet(null); }} onClose={() => setSheet(null)} />
      )}
      {sheet === "country" && (
        <CountrySheet selected={country} onSelect={(c) => { setCountry(c); setSheet(null); }} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}