import { Save } from "lucide-react";
import { useState } from "react";

export default function PaymentSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    xeedWallet: true,
    paypal: true,
    stripe: true,
    bankTransfer: true,
    cash: false,
    commissionBronze: 10,
    commissionSilver: 15,
    commissionGold: 20,
    vat: 14,
    currency: "EGP",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Payment Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Configure payment methods and financial settings</p>
      </div>

      {/* Supported Payment Methods */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Supported Payment Methods</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { id: "xeedWallet", label: "XeedWallet", icon: "💳" },
            { id: "paypal", label: "PayPal", icon: "🅿️" },
            { id: "stripe", label: "Stripe", icon: "🔶" },
            { id: "bankTransfer", label: "Bank Transfer", icon: "🏦" },
            { id: "cash", label: "Cash (at office)", icon: "💵" },
          ].map(method => (
            <label key={method.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[method.id]}
                onChange={(e) => setSettings({ ...settings, [method.id]: e.target.checked })}
                className="rounded w-4 h-4"
              />
              <span className="text-lg flex-shrink-0">{method.icon}</span>
              <span className="font-bold text-gray-900 flex-1">{method.label}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                settings[method.id] ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
              }`}>
                {settings[method.id] ? "Active" : "Inactive"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Commission Rates */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Commission Rates by Plan</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { plan: "Bronze Plan", key: "commissionBronze" },
            { plan: "Silver Plan", key: "commissionSilver" },
            { plan: "Gold Plan", key: "commissionGold" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-bold text-gray-900">{item.plan}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: parseInt(e.target.value) })}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                />
                <span className="font-bold text-gray-700">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Tax Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-bold text-gray-900">VAT/Tax Rate</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.vat}
                onChange={(e) => setSettings({ ...settings, vat: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
              <span className="font-bold text-gray-700">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Currency Display</h2>
        </div>
        <div className="p-6">
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="EGP">EGP (Egyptian Pound)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="SAR">SAR (Saudi Riyal)</option>
            <option value="AED">AED (UAE Dirham)</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          <Save size={18} /> {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}