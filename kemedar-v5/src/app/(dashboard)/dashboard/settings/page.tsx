"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { Settings, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { selectedCurrency, currencies, setCurrency } = useCurrency();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [language, setLanguage] = useState("en");
  const [currencyCode, setCurrencyCode] = useState(selectedCurrency);
  const [darkMode, setDarkMode] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = () => {
    setCurrency(currencyCode);
    localStorage.setItem("kemedar-language", language);
    localStorage.setItem("kemedar-dark-mode", String(darkMode));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)} className={`w-10 h-6 rounded-full transition ${checked ? "bg-blue-600" : "bg-slate-300"} relative`}>
      <span className={`block w-4 h-4 rounded-full bg-white absolute top-1 transition ${checked ? "left-5" : "left-1"}`} />
    </button>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm">
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
              <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} className="w-full px-4 py-2.5 border rounded-lg text-sm">
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-slate-500">Switch to dark theme</p>
            </div>
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "Email notifications", desc: "Receive updates via email", checked: notifyEmail, onChange: setNotifyEmail },
              { label: "Push notifications", desc: "Browser push notifications", checked: notifyPush, onChange: setNotifyPush },
              { label: "Message alerts", desc: "Get notified for new messages", checked: notifyMessages, onChange: setNotifyMessages },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle checked={item.checked} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
