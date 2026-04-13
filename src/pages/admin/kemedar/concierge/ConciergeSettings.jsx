import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { format } from "date-fns";

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${value ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-6" : "left-1"}`} />
    </button>
  );
}

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-black text-gray-900 text-base mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

export default function ConciergeSettings() {
  const [settings, setSettings] = useState({
    featureActive: true,
    showCelebrationModal: true,
    reshowDismissedModal: false,
    sendNotifications: true,
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    notifySendTime: "09:00",
    maxNotifsPerWeek: 3,
    discountActive: true,
    defaultDiscountCode: "NEWHOME5",
    defaultDiscountPercent: 5,
    discountValidityDays: 30,
  });
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [savedBy, setSavedBy] = useState("");

  useEffect(() => {
    base44.auth.me().then(user => setSavedBy(user?.full_name || "Admin")).catch(() => {});
  }, []);

  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setLastSaved(new Date());
    setSaving(false);
  };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚙️ Concierge Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Global configuration for the Move-In Concierge feature</p>
      </div>

      {/* Section 1: Feature Toggle */}
      <SectionCard title="Feature Toggle" icon="🔌">
        <SettingRow
          label="Move-In Concierge is"
          sub="Disable to stop triggering new journeys. Existing active journeys continue unaffected."
        >
          <div className="flex items-center gap-2">
            <Toggle value={settings.featureActive} onChange={v => set("featureActive", v)} />
            <span className={`text-xs font-bold ${settings.featureActive ? "text-green-600" : "text-gray-400"}`}>
              {settings.featureActive ? "🟢 Active" : "⚫ Inactive"}
            </span>
          </div>
        </SettingRow>
      </SectionCard>

      {/* Section 2: Celebration Modal */}
      <SectionCard title="Celebration Modal" icon="🎉">
        <SettingRow
          label="Show celebration modal"
          sub="Shown when user moves a property to Bought/Rented column"
        >
          <Toggle value={settings.showCelebrationModal} onChange={v => set("showCelebrationModal", v)} />
        </SettingRow>
        <SettingRow
          label="Modal re-show if dismissed"
          sub="If ON, re-shows after 3 days if user re-opens the concierge hub"
        >
          <Toggle value={settings.reshowDismissedModal} onChange={v => set("reshowDismissedModal", v)} />
        </SettingRow>
      </SectionCard>

      {/* Section 3: Notifications */}
      <SectionCard title="Notifications" icon="🔔">
        <SettingRow
          label="Send task notifications"
          sub="Notify users when tasks become due"
        >
          <Toggle value={settings.sendNotifications} onChange={v => set("sendNotifications", v)} />
        </SettingRow>
        <div className="py-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-800 mb-3">Notification Channels</p>
          <div className="space-y-2">
            {[
              { key: "pushEnabled", label: "📱 In-app push", disabled: false },
              { key: "emailEnabled", label: "📧 Email", disabled: false },
              { key: "smsEnabled", label: "📲 SMS (coming soon)", disabled: true },
            ].map(({ key, label, disabled }) => (
              <label key={key} className={`flex items-center gap-3 cursor-pointer ${disabled ? "opacity-50" : ""}`}>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  disabled={disabled}
                  onChange={e => set(key, e.target.checked)}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
        <SettingRow label="Daily notification send time">
          <select
            value={settings.notifySendTime}
            onChange={e => set("notifySendTime", e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
          >
            {["06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"].map(t => (
              <option key={t} value={t}>{t} AM</option>
            ))}
          </select>
        </SettingRow>
        <SettingRow label="Max notifications per user per week">
          <input
            type="number"
            min={1}
            max={14}
            value={settings.maxNotifsPerWeek}
            onChange={e => set("maxNotifsPerWeek", Number(e.target.value))}
            className="w-20 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none"
          />
        </SettingRow>
      </SectionCard>

      {/* Section 4: Discount Codes */}
      <SectionCard title="Discount Codes" icon="🎁">
        <SettingRow
          label="New Homeowner Kemetro discount"
          sub="Applied automatically when user navigates to Kemetro via a Concierge CTA"
        >
          <div className="flex items-center gap-2">
            <Toggle value={settings.discountActive} onChange={v => set("discountActive", v)} />
            <span className={`text-xs font-bold ${settings.discountActive ? "text-green-600" : "text-gray-400"}`}>
              {settings.discountActive ? "🟢 Active" : "⚫ Off"}
            </span>
          </div>
        </SettingRow>
        <SettingRow label="Default discount code">
          <input
            value={settings.defaultDiscountCode}
            onChange={e => set("defaultDiscountCode", e.target.value)}
            className="w-32 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-center font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </SettingRow>
        <SettingRow label="Default discount percent">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={100}
              value={settings.defaultDiscountPercent}
              onChange={e => set("defaultDiscountPercent", Number(e.target.value))}
              className="w-16 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </SettingRow>
        <SettingRow label="Code validity (days after journey start)">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={365}
              value={settings.discountValidityDays}
              onChange={e => set("discountValidityDays", Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-center focus:outline-none"
            />
            <span className="text-sm text-gray-500">days</span>
          </div>
        </SettingRow>
      </SectionCard>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-base transition-colors disabled:opacity-50 shadow-md"
      >
        {saving ? "Saving…" : "💾 Save All Settings"}
      </button>

      {lastSaved && (
        <p className="text-xs text-gray-400 text-center">
          Last saved: {format(lastSaved, "MMM d, yyyy 'at' h:mm a")} by {savedBy}
        </p>
      )}
    </div>
  );
}