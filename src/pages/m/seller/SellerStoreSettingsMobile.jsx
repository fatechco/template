import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Bell, Lock, Save, CheckCircle, ArrowLeft } from "lucide-react";

export default function SellerStoreSettingsMobile({ onOpenDrawer }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeActive: true,
    acceptOrders: true,
    vacationMode: false,
    vacationMessage: "Back soon. Thank you for your patience!",
    autoConfirm: false,
    processingDays: 1,
    minOrderAmount: 0,
    allowNotes: true,
    showPhone: false,
    allowMessages: true,
    visibleSearch: true,
    newOrderAlert: true,
    reviewAlert: true,
    lowStockAlert: true,
    lowStockLevel: 5,
  });

  const toggle = key => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Store Settings</span>
        <button onClick={onOpenDrawer} className="p-1 -mr-1"><Store size={24} className="text-gray-900" /></button>
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-[#0077B6] text-white"
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>

        {/* Store Status */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Store Status</h3>
          <div className="space-y-3">
            {[
              { key: "storeActive", label: "Store Active", sub: "Your store is visible to buyers" },
              { key: "acceptOrders", label: "Accept New Orders", sub: "Stop orders without hiding store" },
              { key: "vacationMode", label: "Vacation Mode", sub: "Pause store with auto-reply" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-[10px] text-gray-500">{item.sub}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${settings[item.key] ? "bg-[#0077B6]" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>

          {settings.vacationMode && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
              <label className="text-[10px] font-bold text-gray-600 block mb-1">Auto-reply Message</label>
              <textarea
                value={settings.vacationMessage}
                onChange={e => set("vacationMessage", e.target.value)}
                rows={3}
                maxLength={150}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none bg-white"
              />
              <p className="text-[9px] text-gray-400 mt-1">{settings.vacationMessage.length}/150</p>
            </div>
          )}
        </div>

        {/* Order Management */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Order Management</h3>
          <div className="space-y-3">
            {[
              { key: "autoConfirm", label: "Auto-Confirm Orders", sub: "Skip manual confirmation" },
              { key: "allowNotes", label: "Allow Notes from Buyers", sub: "Buyers can add note at checkout" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                  <p className="text-[10px] text-gray-500">{item.sub}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${settings[item.key] ? "bg-[#0077B6]" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
            <div>
              <label className="text-[10px] font-bold text-gray-600 block mb-1">Processing Time (days)</label>
              <input
                type="number"
                value={settings.processingDays}
                onChange={e => set("processingDays", parseInt(e.target.value) || 1)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 block mb-1">Minimum Order Amount ($)</label>
              <input
                type="number"
                value={settings.minOrderAmount}
                onChange={e => set("minOrderAmount", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Bell size={16} /> Notifications</h3>
          <div className="space-y-2">
            {[
              { key: "newOrderAlert", label: "New Order Alert" },
              { key: "reviewAlert", label: "New Review Alert" },
              { key: "lowStockAlert", label: "Low Stock Alert" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${settings[item.key] ? "bg-[#0077B6]" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
          {settings.lowStockAlert && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mt-2">
              <label className="text-[10px] font-bold text-gray-600 block mb-1">Alert when stock falls below:</label>
              <input
                type="number"
                value={settings.lowStockLevel}
                onChange={e => set("lowStockLevel", parseInt(e.target.value) || 1)}
                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2"><Lock size={16} /> Privacy</h3>
          <div className="space-y-2">
            {[
              { key: "showPhone", label: "Show Phone Number" },
              { key: "allowMessages", label: "Allow Direct Messages" },
              { key: "visibleSearch", label: "Visible in Search" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-12 h-7 rounded-full transition-colors flex items-center px-0.5 ${settings[item.key] ? "bg-[#0077B6]" : "bg-gray-300"}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}