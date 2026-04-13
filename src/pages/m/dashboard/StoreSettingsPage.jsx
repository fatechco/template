import { useState } from "react";
import { Menu, Save, AlertCircle } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import SellerMobileDrawer from "@/components/seller/SellerMobileDrawer";

export default function StoreSettingsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    storeActive: true,
    acceptOrders: true,
    vacationMode: false,
    vacationReturn: "",
    vacationMessage: "Back soon. Thank you for your patience!",
    autoConfirm: false,
    processingDays: 1,
    minOrderAmount: 0,
    allowNotes: true,
    autoComplete: 3,
    newOrderAlert: true,
    orderCancelAlert: true,
    reviewAlert: true,
    lowStockAlert: true,
    lowStockLevel: 5,
    messageAlert: true,
    payoutAlert: true,
    announcementAlert: true,
    showPhone: false,
    allowMessages: true,
    visibleSearch: true,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-start justify-center">
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col relative">
        <SellerMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={null} />
        <MobileTopBar
          title="Store Settings"
          rightAction={
            <button onClick={() => setDrawerOpen(true)} className="p-1">
              <Menu size={22} className="text-gray-700" />
            </button>
          }
        />

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Store Status Section */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <p className="text-xs text-gray-500 uppercase font-bold px-4 pt-4 pb-2">Store Status</p>
            <div className="divide-y divide-gray-100">
              <SettingRow
                label="Store Active"
                sub="Your store is visible to buyers"
                value={settings.storeActive}
                onChange={() => handleToggle("storeActive")}
              />
              <SettingRow
                label="Accept New Orders"
                sub="Stop orders without hiding store"
                value={settings.acceptOrders}
                onChange={() => handleToggle("acceptOrders")}
              />
              <SettingRow
                label="Vacation Mode"
                sub="Pause store with a message"
                value={settings.vacationMode}
                onChange={() => handleToggle("vacationMode")}
              />
            </div>
          </div>

          {settings.vacationMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-gray-900">Vacation Settings</p>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Return Date</label>
                <input
                  type="date"
                  value={settings.vacationReturn}
                  onChange={(e) => handleChange("vacationReturn", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Auto-reply Message</label>
                <textarea
                  value={settings.vacationMessage}
                  onChange={(e) => handleChange("vacationMessage", e.target.value)}
                  maxLength={150}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">{settings.vacationMessage.length}/150</p>
              </div>
            </div>
          )}

          {/* Order Management */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <p className="text-xs text-gray-500 uppercase font-bold px-4 pt-4 pb-2">Order Management</p>
            <div className="divide-y divide-gray-100">
              <SettingRow
                label="Auto-Confirm Orders"
                sub="Skip manual confirmation"
                value={settings.autoConfirm}
                onChange={() => handleToggle("autoConfirm")}
              />
              <SettingNumberRow
                label="Processing Time"
                sub="How long to prepare orders"
                value={settings.processingDays}
                onChange={(v) => handleChange("processingDays", v)}
                unit="days"
              />
              <SettingNumberRow
                label="Minimum Order Amount"
                sub="Reject orders below this value"
                value={settings.minOrderAmount}
                onChange={(v) => handleChange("minOrderAmount", v)}
                unit="$"
              />
              <SettingRow
                label="Allow Notes from Buyers"
                sub="Buyers can add notes at checkout"
                value={settings.allowNotes}
                onChange={() => handleToggle("allowNotes")}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <p className="text-xs text-gray-500 uppercase font-bold px-4 pt-4 pb-2">Notifications</p>
            <div className="divide-y divide-gray-100">
              <SettingRow
                label="New Order Alert"
                value={settings.newOrderAlert}
                onChange={() => handleToggle("newOrderAlert")}
              />
              <SettingRow
                label="Order Cancellation"
                value={settings.orderCancelAlert}
                onChange={() => handleToggle("orderCancelAlert")}
              />
              <SettingRow
                label="New Review Alert"
                value={settings.reviewAlert}
                onChange={() => handleToggle("reviewAlert")}
              />
              <SettingRow
                label="Low Stock Alert"
                value={settings.lowStockAlert}
                onChange={() => handleToggle("lowStockAlert")}
              />
              {settings.lowStockAlert && (
                <div className="px-4 py-3 bg-gray-50">
                  <label className="text-xs text-gray-600 block mb-2">Alert when below:</label>
                  <input
                    type="number"
                    min="1"
                    value={settings.lowStockLevel}
                    onChange={(e) => handleChange("lowStockLevel", parseInt(e.target.value))}
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <p className="text-xs text-gray-500 uppercase font-bold px-4 pt-4 pb-2">Privacy & Security</p>
            <div className="divide-y divide-gray-100">
              <SettingRow
                label="Show Phone Number"
                sub="Display phone to buyers"
                value={settings.showPhone}
                onChange={() => handleToggle("showPhone")}
              />
              <SettingRow
                label="Allow Direct Messages"
                value={settings.allowMessages}
                onChange={() => handleToggle("allowMessages")}
              />
              <SettingRow
                label="Visible in Search"
                value={settings.visibleSearch}
                onChange={() => handleToggle("visibleSearch")}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-2xl p-4">
            <p className="text-xs text-red-600 font-bold uppercase mb-3">⚠️ Danger Zone</p>
            <button className="w-full px-4 py-2.5 border border-red-300 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">
              🗑 Close Store (Irreversible)
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            <Save size={18} /> {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, sub, value, onChange }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div>
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-7 rounded-full transition-colors flex items-center ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

function SettingNumberRow({ label, sub, value, onChange, unit }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <div>
        <p className="font-bold text-gray-900 text-sm">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-right focus:border-blue-500 focus:outline-none"
        />
        <span className="text-xs text-gray-600 font-bold">{unit}</span>
      </div>
    </div>
  );
}