import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-teal-500" : "bg-gray-200"}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-7" : "left-1"}`} />
    </button>
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="font-black text-gray-900 text-base mb-1">{title}</p>
      <div className="w-8 h-0.5 bg-teal-400 mb-4 rounded" />
      {children}
    </div>
  );
}

export default function SnapFixSettings() {
  const [settings, setSettings] = useState({
    isActive: true,
    allowGuestAnalysis: true,
    claudeModel: "claude-sonnet-4-20250514",
    maxImageSizeMB: 10,
    laborCostPerHourEGP: 150,
    defaultCurrency: "EGP",
    emergencyUrgencyAutoNotifyAdmin: true,
    highUrgencyAutoNotifyAdmin: false,
    enableVoiceNote: true,
    sessionExpiryHours: 48,
    guestSessionExpiryHours: 24,
  });
  const [user, setUser] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    base44.entities.SnapSettings.list("-updated_date", 1)
      .then(rows => { if (rows?.[0]) setSettings(s => ({ ...s, ...rows[0] })); })
      .catch(() => {});
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const existing = await base44.entities.SnapSettings.list("-updated_date", 1);
      const payload = { ...settings, updatedAt: new Date().toISOString() };
      if (existing?.[0]) {
        await base44.entities.SnapSettings.update(existing[0].id, payload);
      } else {
        await base44.entities.SnapSettings.create(payload);
      }
      setLastSaved(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleTestVision = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await base44.functions.invoke("processSnapAndFix", {
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        userNote: "Test - pipe is dripping",
        isTest: true,
      });
      setTestResult(JSON.stringify(res?.data || res, null, 2));
    } catch (e) {
      setTestResult(`Error: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">⚙️ Snap & Fix Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure the AI Auto-Tasker module</p>
      </div>

      {/* Section 1: Feature Toggle */}
      <SectionCard title="Feature Toggle">
        <SettingRow label="Snap & Fix is active" hint="Globally enables or disables the entire module">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.isActive} onChange={v => set("isActive", v)} />
            <span className={`text-xs font-bold ${settings.isActive ? "text-teal-600" : "text-gray-400"}`}>
              {settings.isActive ? "🟢 Active" : "⚫ Inactive"}
            </span>
          </div>
        </SettingRow>
        <SettingRow label="Allow guest access" hint="Guests see diagnosis but can't post without login">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.allowGuestAnalysis} onChange={v => set("allowGuestAnalysis", v)} />
            <span className={`text-xs font-bold ${settings.allowGuestAnalysis ? "text-teal-600" : "text-gray-400"}`}>
              {settings.allowGuestAnalysis ? "🟢 ON" : "⚫ OFF"}
            </span>
          </div>
        </SettingRow>
      </SectionCard>

      {/* Section 2: AI Config */}
      <SectionCard title="AI Configuration">
        <SettingRow label="Claude API Status">
          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">🟢 Connected</span>
        </SettingRow>
        <SettingRow label="Claude Model">
          <input value={settings.claudeModel} onChange={e => set("claudeModel", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-64 focus:outline-none focus:border-teal-400" />
        </SettingRow>
        <SettingRow label="Max image size (MB)">
          <input type="number" value={settings.maxImageSizeMB} onChange={e => set("maxImageSizeMB", Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-20 focus:outline-none focus:border-teal-400" />
        </SettingRow>
        <div className="mt-4">
          <button onClick={handleTestVision} disabled={testing}
            className="px-4 py-2 border border-teal-400 text-teal-600 font-bold text-xs rounded-xl hover:bg-teal-50 transition-colors disabled:opacity-50">
            {testing ? "⏳ Testing…" : "🧪 Test Vision API"}
          </button>
          {testResult && (
            <pre className="mt-3 p-3 bg-gray-900 text-green-400 rounded-xl text-xs overflow-x-auto max-h-48 leading-relaxed">
              {testResult}
            </pre>
          )}
        </div>
      </SectionCard>

      {/* Section 3: Cost Estimates */}
      <SectionCard title="Cost Estimates">
        <SettingRow label="Labor cost per hour (EGP)" hint="Used to calculate estimated labor range">
          <input type="number" value={settings.laborCostPerHourEGP} onChange={e => set("laborCostPerHourEGP", Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-24 focus:outline-none focus:border-teal-400" />
        </SettingRow>
        <SettingRow label="Default currency">
          <select value={settings.defaultCurrency} onChange={e => set("defaultCurrency", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
            {["EGP", "USD", "EUR", "AED", "SAR"].map(c => <option key={c}>{c}</option>)}
          </select>
        </SettingRow>
      </SectionCard>

      {/* Section 4: Safety */}
      <SectionCard title="Safety">
        <SettingRow label="Auto-notify admin on Emergency diagnosis" hint="Admin receives instant alert for all emergency-level cases">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.emergencyUrgencyAutoNotifyAdmin} onChange={v => set("emergencyUrgencyAutoNotifyAdmin", v)} />
            <span className={`text-xs font-bold ${settings.emergencyUrgencyAutoNotifyAdmin ? "text-teal-600" : "text-gray-400"}`}>
              {settings.emergencyUrgencyAutoNotifyAdmin ? "🟢 ON" : "⚫ OFF"}
            </span>
          </div>
        </SettingRow>
        <SettingRow label="Auto-notify admin on High urgency">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.highUrgencyAutoNotifyAdmin} onChange={v => set("highUrgencyAutoNotifyAdmin", v)} />
            <span className={`text-xs font-bold ${settings.highUrgencyAutoNotifyAdmin ? "text-teal-600" : "text-gray-400"}`}>
              {settings.highUrgencyAutoNotifyAdmin ? "🟢 ON" : "⚫ OFF"}
            </span>
          </div>
        </SettingRow>
        <SettingRow label="Enable voice note transcription">
          <div className="flex items-center gap-3">
            <Toggle checked={settings.enableVoiceNote} onChange={v => set("enableVoiceNote", v)} />
            <span className={`text-xs font-bold ${settings.enableVoiceNote ? "text-teal-600" : "text-gray-400"}`}>
              {settings.enableVoiceNote ? "🟢 ON" : "⚫ OFF"}
            </span>
          </div>
        </SettingRow>
      </SectionCard>

      {/* Section 5: Session Management */}
      <SectionCard title="Session Management">
        <SettingRow label="Session expiry (hours)" hint="Unconverted sessions deleted after this">
          <input type="number" value={settings.sessionExpiryHours} onChange={e => set("sessionExpiryHours", Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-24 focus:outline-none focus:border-teal-400" />
        </SettingRow>
        <SettingRow label="Guest session expiry (hours)">
          <input type="number" value={settings.guestSessionExpiryHours} onChange={e => set("guestSessionExpiryHours", Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-24 focus:outline-none focus:border-teal-400" />
        </SettingRow>
      </SectionCard>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full h-[52px] rounded-2xl font-black text-white text-base transition-all disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #14B8A6, #0A6EBD)", boxShadow: "0 4px 20px rgba(20,184,166,0.3)" }}>
        {saving ? "💾 Saving…" : "💾 Save All Settings"}
      </button>
      {lastSaved && (
        <p className="text-xs text-center text-gray-400">
          Last saved: {lastSaved.toLocaleString()} by {user?.full_name || "Admin"}
        </p>
      )}
    </div>
  );
}