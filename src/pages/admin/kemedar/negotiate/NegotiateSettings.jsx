import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-green-500" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function NegotiateSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    foFacilitation: true,
    digitalOffers: true,
    requireOTP: true,
    foCommissionRate: 1.5,
    sessionExpiryDays: 30,
    maxRounds: 10,
    minPrice: 0,
  });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setSettings(prev => ({ ...prev, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">⚙️ Negotiate™ Settings</h1>

      {[
        { section: "Feature Toggles", items: [
          { key: "enabled", label: "Enable Negotiate™ for all properties", type: "toggle" },
          { key: "foFacilitation", label: "Allow Franchise Owner facilitation", type: "toggle" },
          { key: "digitalOffers", label: "Enable Digital Offer Letters", type: "toggle" },
          { key: "requireOTP", label: "Require OTP for offer signing", type: "toggle" },
        ]},
        { section: "Limits & Rates", items: [
          { key: "foCommissionRate", label: "FO Commission Rate (%)", type: "number", min: 0, max: 10, step: 0.1 },
          { key: "sessionExpiryDays", label: "Session expiry (days of inactivity)", type: "number", min: 7, max: 90 },
          { key: "maxRounds", label: "Max negotiation rounds", type: "number", min: 1, max: 20 },
          { key: "minPrice", label: "Minimum listing price to enable (EGP)", type: "number", min: 0 },
        ]},
      ].map(group => (
        <div key={group.section} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="font-black text-gray-800 text-sm">{group.section}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {group.items.map(item => (
              <div key={item.key} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-gray-700 flex-1">{item.label}</label>
                {item.type === "toggle" ? (
                  <Toggle checked={settings[item.key]} onChange={v => set(item.key, v)} />
                ) : (
                  <input
                    type="number"
                    value={settings[item.key]}
                    onChange={e => set(item.key, Number(e.target.value))}
                    min={item.min}
                    max={item.max}
                    step={item.step || 1}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:border-orange-400"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${saved ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
        {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
      </button>
    </div>
  );
}