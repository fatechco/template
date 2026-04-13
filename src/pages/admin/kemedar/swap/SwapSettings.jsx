import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-[#7C3AED]" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );
}

function SettingRow({ label, helper, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {helper && <p className="text-xs text-gray-400 mt-0.5">{helper}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <h3 className="font-black text-gray-900 text-sm mb-1 flex items-center gap-2">
        <span className="w-1 h-4 bg-[#7C3AED] rounded-full" />{title}
      </h3>
      {children}
    </div>
  );
}

const DEFAULTS = {
  isActive: true,
  minVerifyProLevelToList: 2,
  matchScoreThreshold: 75,
  maxMatchesPerIntent: 20,
  swapIntentExpiryDays: 90,
  negotiationExpiryDays: 30,
  gapOfferExpiryHours: 48,
  weeklyMatchCronEnabled: true,
  verificationFeePerPartyEGP: 500,
  legalFeePerSwapEGP: 3000,
  legalFeeSplitPercent: 50,
  escrowFeePercent: 1.5,
  platformCommissionPercent: 0.5,
  claudeModel: "claude-sonnet-4-20250514",
};

export default function SwapSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    base44.entities.SwapSettings.list("-created_date", 1).then(data => {
      if (data?.[0]) { setSettings({ ...DEFAULTS, ...data[0] }); setSettingsId(data[0].id); }
    }).catch(() => {});
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (settingsId) {
      await base44.entities.SwapSettings.update(settingsId, { ...settings, updatedAt: new Date().toISOString() });
    } else {
      const created = await base44.entities.SwapSettings.create({ ...settings, updatedAt: new Date().toISOString() });
      setSettingsId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRunEngine = async () => {
    setRunning(true);
    await base44.functions.invoke("generateSwapMatches", {});
    setRunning(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await base44.functions.invoke("generateSwapMatches", { dryRun: true, limit: 1 });
      setTestResult(JSON.stringify(res?.data, null, 2));
    } catch (e) {
      setTestResult(`Error: ${e.message}`);
    }
    setTesting(false);
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Kemedar Swap™ Settings</h1>
        <p className="text-sm text-gray-500">Configure matching rules, fees, and AI parameters</p>
      </div>

      {/* Section 1: Feature Toggle */}
      <SectionCard title="Feature Toggle">
        <SettingRow label="Kemedar Swap™ is active">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold ${settings.isActive ? "text-green-600" : "text-gray-400"}`}>
              {settings.isActive ? "🟢 Active" : "⚫ Inactive"}
            </span>
            <Toggle value={settings.isActive} onChange={v => set("isActive", v)} />
          </div>
        </SettingRow>
      </SectionCard>

      {/* Section 2: Matching Rules */}
      <SectionCard title="Matching Rules">
        <SettingRow label="Min Verify Pro level to list" helper="Properties must meet this level to join the swap pool">
          <select value={settings.minVerifyProLevelToList} onChange={e => set("minVerifyProLevelToList", +e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED]">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>Level {n}</option>)}
          </select>
        </SettingRow>
        <SettingRow label="AI match score threshold (0–100)" helper="Matches below this score are not shown to users">
          <input type="number" min={0} max={100} value={settings.matchScoreThreshold}
            onChange={e => set("matchScoreThreshold", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Max matches per intent">
          <input type="number" min={1} value={settings.maxMatchesPerIntent} onChange={e => set("maxMatchesPerIntent", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Swap intent expiry (days)">
          <input type="number" min={1} value={settings.swapIntentExpiryDays} onChange={e => set("swapIntentExpiryDays", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Negotiation expiry (days)">
          <input type="number" min={1} value={settings.negotiationExpiryDays} onChange={e => set("negotiationExpiryDays", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Gap offer expiry (hours)">
          <input type="number" min={1} value={settings.gapOfferExpiryHours} onChange={e => set("gapOfferExpiryHours", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Weekly match cron job">
          <Toggle value={settings.weeklyMatchCronEnabled} onChange={v => set("weeklyMatchCronEnabled", v)} />
        </SettingRow>
        <div className="pt-3">
          <button onClick={handleRunEngine} disabled={running}
            className="border border-gray-200 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2">
            {running ? <><div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />Running…</> : "⚡ Run Match Engine Now (All Intents)"}
          </button>
        </div>
      </SectionCard>

      {/* Section 3: Fees */}
      <SectionCard title="Fees & Revenue">
        {[
          ["Verification fee per party (EGP)", "verificationFeePerPartyEGP"],
          ["Legal fee per swap (EGP)", "legalFeePerSwapEGP"],
          ["Legal fee split (% per party)", "legalFeeSplitPercent"],
        ].map(([label, key]) => (
          <SettingRow key={key} label={label}>
            <input type="number" min={0} value={settings[key]} onChange={e => set(key, +e.target.value)}
              className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
          </SettingRow>
        ))}
        <SettingRow label="Escrow fee %" helper="Charged on gap amount deposited into XeedWallet">
          <input type="number" min={0} step={0.1} value={settings.escrowFeePercent} onChange={e => set("escrowFeePercent", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
        <SettingRow label="Platform commission %" helper="Charged on total combined property value at completion">
          <input type="number" min={0} step={0.1} value={settings.platformCommissionPercent} onChange={e => set("platformCommissionPercent", +e.target.value)}
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7C3AED] text-center" />
        </SettingRow>
      </SectionCard>

      {/* Section 4: AI Config */}
      <SectionCard title="AI Configuration">
        <SettingRow label="Claude API">
          <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">🟢 Connected</span>
        </SettingRow>
        <SettingRow label="Model">
          <span className="text-xs font-mono text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">{settings.claudeModel}</span>
        </SettingRow>
        <div className="pt-3">
          <button onClick={handleTest} disabled={testing}
            className="border border-gray-200 text-gray-700 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2">
            {testing ? <><div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />Testing…</> : "🧪 Test Match Engine"}
          </button>
        </div>
        {testResult && (
          <pre className="mt-3 bg-gray-900 text-green-400 text-[11px] rounded-xl p-4 overflow-x-auto max-h-60 font-mono">
            {testResult}
          </pre>
        )}
      </SectionCard>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full bg-[#FF6B00] hover:bg-orange-500 disabled:opacity-50 text-white font-black py-[14px] rounded-2xl text-base flex items-center justify-center gap-2 transition-colors mt-2">
        {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</> : "💾 Save All Settings"}
      </button>
      {saved && <p className="text-center text-green-600 text-xs font-bold mt-2">✅ Settings saved successfully</p>}
    </div>
  );
}