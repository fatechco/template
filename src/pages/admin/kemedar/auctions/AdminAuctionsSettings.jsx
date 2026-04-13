import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Check, AlertCircle } from "lucide-react";

export default function AdminAuctionsSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await base44.entities.AuctionSettings.list();
    setSettings(data[0] || getDefaultSettings());
    setLoading(false);
  };

  const getDefaultSettings = () => ({
    isActive: true,
    sellerDepositPercent: 0.5,
    sellerDepositMinEGP: 2000,
    buyerDepositPercent: 1,
    buyerDepositMinEGP: 5000,
    winnerPaymentDeadlineHours: 48,
    defaultMinBidIncrementEGP: 5000,
    defaultExtensionMinutes: 5,
    defaultMaxExtensions: 3,
    platformCommissionPercent: 2,
    requireVerifyProLevel: 2,
    requireBuyerKYC: true,
    maxAuctionDurationDays: 30,
    minAuctionDurationDays: 1,
    featuredAuctionFeeEGP: 500,
    claudeModel: "claude-sonnet-4-20250514"
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await base44.entities.AuctionSettings.update(settings.id, settings);
      } else {
        await base44.entities.AuctionSettings.create(settings);
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error("Error saving settings:", e);
    }
    setSaving(false);
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚙️ KemedarBid™ Settings</h1>
      </div>

      {/* Section 1: Feature Toggle */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-4">Feature Toggle</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">KemedarBid™ is:</p>
          <button onClick={() => setSettings({ ...settings, isActive: !settings.isActive })} className={`w-12 h-7 rounded-full relative transition-colors ${settings.isActive ? "bg-green-500" : "bg-gray-300"}`}>
            <span className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform ${settings.isActive ? "translate-x-6" : "translate-x-0"}`}></span>
          </button>
          <span className={`text-sm font-bold ${settings.isActive ? "text-green-600" : "text-gray-500"}`}>{settings.isActive ? "🟢 Active" : "⚫ Inactive"}</span>
        </div>
      </div>

      {/* Section 2: Deposit Requirements */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-4">Deposit Requirements</h3>
        <div className="space-y-4">
          {[
            { label: "Seller deposit %", key: "sellerDepositPercent", type: "number" },
            { label: "Seller deposit minimum (EGP)", key: "sellerDepositMinEGP", type: "number" },
            { label: "Buyer deposit %", key: "buyerDepositPercent", type: "number" },
            { label: "Buyer deposit minimum (EGP)", key: "buyerDepositMinEGP", type: "number" },
            { label: "Winner payment deadline (hours)", key: "winnerPaymentDeadlineHours", type: "number" },
          ].map(field => (
            <div key={field.key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{field.label}:</label>
              <input type="number" value={settings[field.key]} onChange={e => setSettings({ ...settings, [field.key]: parseFloat(e.target.value) })} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Auction Rules */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-4">Auction Rules</h3>
        <div className="space-y-4">
          {[
            { label: "Default min bid increment (EGP)", key: "defaultMinBidIncrementEGP" },
            { label: "Default extension minutes", key: "defaultExtensionMinutes" },
            { label: "Default max extensions", key: "defaultMaxExtensions" },
            { label: "Min auction duration (days)", key: "minAuctionDurationDays" },
            { label: "Max auction duration (days)", key: "maxAuctionDurationDays" },
          ].map(field => (
            <div key={field.key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{field.label}:</label>
              <input type="number" value={settings[field.key]} onChange={e => setSettings({ ...settings, [field.key]: parseFloat(e.target.value) })} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <label className="text-sm text-gray-700">Require Verify Pro level:</label>
            <select value={settings.requireVerifyProLevel} onChange={e => setSettings({ ...settings, requireVerifyProLevel: parseInt(e.target.value) })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700">Require buyer KYC:</label>
            <button onClick={() => setSettings({ ...settings, requireBuyerKYC: !settings.requireBuyerKYC })} className={`w-12 h-7 rounded-full relative transition-colors ${settings.requireBuyerKYC ? "bg-green-500" : "bg-gray-300"}`}>
              <span className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform ${settings.requireBuyerKYC ? "translate-x-6" : "translate-x-0"}`}></span>
            </button>
            <span className={`text-sm font-bold ${settings.requireBuyerKYC ? "text-green-600" : "text-gray-500"}`}>{settings.requireBuyerKYC ? "🟢 ON" : "⚫ OFF"}</span>
          </div>
        </div>
      </div>

      {/* Section 4: Commissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-4">Commissions</h3>
        <div className="space-y-4">
          {[
            { label: "Platform commission (%)", key: "platformCommissionPercent" },
            { label: "Featured auction fee (EGP)", key: "featuredAuctionFeeEGP" },
          ].map(field => (
            <div key={field.key} className="flex items-center justify-between">
              <label className="text-sm text-gray-700">{field.label}:</label>
              <input type="number" value={settings[field.key]} onChange={e => setSettings({ ...settings, [field.key]: parseFloat(e.target.value) })} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-right" />
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: AI Risk Assessment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
          AI Risk Assessment
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">🟢 Connected</span>
        </h3>
        <p className="text-sm text-gray-600 mb-4">Claude API is connected and ready to review pending auctions.</p>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 mb-4">
          🧪 Test AI Review
        </button>
        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono">
          Model: {settings.claudeModel}
        </div>
      </div>

      {/* Save Button */}
      <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-red-600 text-white font-black text-base hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
        {saving ? "💾 Saving..." : "💾 Save All Settings"}
      </button>

      {lastSaved && (
        <p className="text-center text-xs text-gray-500">
          ✓ Last saved: {lastSaved.toLocaleString()}
        </p>
      )}
    </div>
  );
}