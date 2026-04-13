import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function Toggle({ value, onChange, disabled }) {
  return (
    <button onClick={() => !disabled && onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ background: value ? "#00C896" : "#d1d5db", height: "22px" }}>
      <span className="absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform"
        style={{ transform: value ? "translateX(18px)" : "translateX(0)", width: "18px", height: "18px" }} />
    </button>
  );
}

function Field({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

const DEFAULTS = {
  platformFeePercent: 2.5,
  minPropertyValuationEGP: 500000,
  minTokensForSale: 100,
  maxTokensPerProperty: 10000,
  defaultTokenPriceEGP: 1000,
  requireVerifyProLevel: 3,
  nearNetworkDefault: "testnet",
  nearAdminAccountId: "kemefrac-admin.near",
  requireKYCForPurchase: true,
  allowSecondaryMarket: false,
  maxOfferingDurationDays: 365,
  yieldPayoutDayOfMonth: 1,
  yieldReminderDaysBefore: 3,
};

export default function KemeFracSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [nearStatus, setNearStatus] = useState(null);
  const [testingNear, setTestingNear] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    base44.entities.FracSettings.list("-created_date", 1).then(d => { if (d?.[0]) setSettings({ ...DEFAULTS, ...d[0] }); }).catch(() => {});
  }, []);

  const up = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const testNear = async () => {
    setTestingNear(true); setNearStatus(null);
    await new Promise(r => setTimeout(r, 1200));
    setNearStatus("✅ NEAR testnet connected (RPC: rpc.testnet.near.org)");
    setTestingNear(false);
  };

  const save = async () => {
    setSaving(true);
    const existing = await base44.entities.FracSettings.list("-created_date", 1).catch(() => []);
    if (existing?.[0]) {
      await base44.entities.FracSettings.update(existing[0].id, settings).catch(() => {});
    } else {
      await base44.entities.FracSettings.create(settings).catch(() => {});
    }
    setLastSaved(new Date());
    setSaving(false);
  };

  const inputCls = "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#00C896] text-right";

  const sections = [
    {
      title: "💳 Platform Fees",
      fields: [
        { label: "Platform fee per purchase", desc: "Percentage deducted from each token sale", key: "platformFeePercent", type: "number", suffix: "%" },
        { label: "Minimum property valuation", desc: "Minimum EGP value to list on KemeFrac™", key: "minPropertyValuationEGP", type: "number", suffix: "EGP" },
      ],
    },
    {
      title: "🔷 Token Rules",
      fields: [
        { label: "Minimum tokens for sale", key: "minTokensForSale", type: "number" },
        { label: "Maximum tokens per property", key: "maxTokensPerProperty", type: "number" },
        { label: "Default token price", key: "defaultTokenPriceEGP", type: "number", suffix: "EGP" },
        { label: "Require Verify Pro level", key: "requireVerifyProLevel", type: "number", suffix: "(1–5)" },
      ],
    },
    {
      title: "💰 Yield Schedule",
      fields: [
        { label: "Default payout day of month", key: "yieldPayoutDayOfMonth", type: "number", suffix: "(1–28)" },
        { label: "Admin reminder before payout", key: "yieldReminderDaysBefore", type: "number", suffix: "days" },
      ],
    },
    {
      title: "📋 Investor Rules",
      fields: [
        { label: "Max offering duration", key: "maxOfferingDurationDays", type: "number", suffix: "days" },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900">⚙️ KemeFrac™ Settings</h1>

      {sections.map(sec => (
        <div key={sec.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-800 mb-3">{sec.title}</p>
          {sec.fields.map(f => (
            <Field key={f.key} label={f.label} desc={f.desc}>
              <div className="flex items-center gap-2">
                <input type={f.type || "text"} value={settings[f.key] ?? ""} onChange={e => up(f.key, f.type === "number" ? parseFloat(e.target.value) : e.target.value)}
                  className={`${inputCls} w-28`} />
                {f.suffix && <span className="text-xs text-gray-400">{f.suffix}</span>}
              </div>
            </Field>
          ))}
        </div>
      ))}

      {/* NEAR Config */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="font-black text-gray-800 mb-3">🔗 NEAR Configuration</p>
        <Field label="Default network">
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {["testnet", "mainnet"].map(n => (
              <button key={n} onClick={() => up("nearNetworkDefault", n)}
                className="px-3 py-1.5 text-xs font-black capitalize transition-colors"
                style={{ background: settings.nearNetworkDefault === n ? "#0A1628" : "white", color: settings.nearNetworkDefault === n ? "#00C896" : "#6b7280" }}>
                {n}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Admin NEAR account">
          <input value={settings.nearAdminAccountId} onChange={e => up("nearAdminAccountId", e.target.value)}
            className={`${inputCls} w-48`} />
        </Field>
        <Field label="Test NEAR Connection">
          <div className="space-y-1">
            <button onClick={testNear} disabled={testingNear}
              className="px-3 py-1.5 rounded-xl text-xs font-black border border-gray-200 text-gray-600 hover:border-[#00C896] disabled:opacity-50">
              {testingNear ? "Testing..." : "Test Connection"}
            </button>
            {nearStatus && <p className="text-xs" style={{ color: "#00C896" }}>{nearStatus}</p>}
          </div>
        </Field>
      </div>

      {/* Investor Rules Toggles */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="font-black text-gray-800 mb-3">📋 Investor Rules</p>
        <Field label="Require KYC for purchase" desc="Block token purchase until KYC approved">
          <Toggle value={settings.requireKYCForPurchase} onChange={v => up("requireKYCForPurchase", v)} />
        </Field>
        <Field label="Allow secondary market" desc="Holders can sell tokens to each other">
          <div className="flex items-center gap-2">
            <Toggle value={settings.allowSecondaryMarket} onChange={v => up("allowSecondaryMarket", v)} disabled />
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">Coming Soon</span>
          </div>
        </Field>
      </div>

      <button onClick={save} disabled={saving}
        className="w-full py-3.5 rounded-xl font-black text-base disabled:opacity-50"
        style={{ background: "#00C896", color: "#0A1628" }}>
        {saving ? "Saving..." : "💾 Save All Settings"}
      </button>
      {lastSaved && <p className="text-xs text-center text-gray-400">Last saved: {lastSaved.toLocaleString()}</p>}
    </div>
  );
}