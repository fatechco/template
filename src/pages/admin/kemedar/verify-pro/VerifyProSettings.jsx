import { useState } from "react";

const DEFAULTS = {
  // Fees
  feeInspectionSeller: 600,
  feeInspectionFO: 400,
  feeDocumentReviewFO: 150,
  feeCertificateIssuance: 299,
  feeCertificateRenewal: 199,
  feeSubscription: 399,
  feeAPILookup: 5,
  // Rules
  minLevelForDeal: 3,
  requireFOInspection: true,
  requireLegalDocs: true,
  autoSuspendFraud: true,
  certValidityDays: 365,
  renewalReminderDays: 30,
  // AI
  aiEnabled: true,
  aiAutoFlagThreshold: 50,
  aiAutoSuspendThreshold: 25,
  // FO Assignment
  foAssignmentMethod: "auto",
  foMaxDistanceKm: 30,
  foConfirmHours: 24,
};

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-all ${value ? "bg-green-500" : "bg-gray-300"}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <p className="text-sm font-bold text-gray-800">{label}</p>
      <div className="flex items-center gap-2">
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-24 border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-orange-200" />
        {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

export default function VerifyProSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestAI = () => {
    setTestStatus("testing");
    setTimeout(() => setTestStatus("success"), 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-black text-gray-900">⚙️ Verify Pro Settings</h1>

      {/* Section 1: Fee Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">💰 Fee Configuration</h2>
        <NumberField label="FO Inspection — charged to seller" value={settings.feeInspectionSeller} onChange={v => update("feeInspectionSeller", v)} suffix="EGP" />
        <NumberField label="FO Inspection — FO receives" value={settings.feeInspectionFO} onChange={v => update("feeInspectionFO", v)} suffix="EGP" />
        <NumberField label="FO Document Review — FO receives" value={settings.feeDocumentReviewFO} onChange={v => update("feeDocumentReviewFO", v)} suffix="EGP" />
        <NumberField label="Certificate Issuance (annual)" value={settings.feeCertificateIssuance} onChange={v => update("feeCertificateIssuance", v)} suffix="EGP" />
        <NumberField label="Certificate Renewal" value={settings.feeCertificateRenewal} onChange={v => update("feeCertificateRenewal", v)} suffix="EGP" />
        <NumberField label="Verify Pro Subscription" value={settings.feeSubscription} onChange={v => update("feeSubscription", v)} suffix="EGP/year" />
        <NumberField label="API Lookup Fee (banks/3rd parties)" value={settings.feeAPILookup} onChange={v => update("feeAPILookup", v)} suffix="EGP/call" />
      </div>

      {/* Section 2: Verification Rules */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">📋 Verification Rules</h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800">Minimum level required to start a deal</p>
          <select value={settings.minLevelForDeal} onChange={e => update("minLevelForDeal", Number(e.target.value))}
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none">
            {[1,2,3,4,5].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <Toggle label="Require FO inspection for Level 4" value={settings.requireFOInspection} onChange={v => update("requireFOInspection", v)} />
        <Toggle label="Require legal docs for Level 5" value={settings.requireLegalDocs} onChange={v => update("requireLegalDocs", v)} />
        <Toggle label="Auto-suspend on critical fraud" value={settings.autoSuspendFraud} onChange={v => update("autoSuspendFraud", v)} />
        <NumberField label="Certificate validity (days)" value={settings.certValidityDays} onChange={v => update("certValidityDays", v)} suffix="days" />
        <NumberField label="Renewal reminder (days before)" value={settings.renewalReminderDays} onChange={v => update("renewalReminderDays", v)} suffix="days before" />
      </div>

      {/* Section 3: AI Configuration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🤖 AI Configuration</h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-50">
          <div>
            <p className="text-sm font-bold text-gray-800">Claude API status</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-green-600">Connected</span>
          </div>
        </div>
        <div className="py-3 border-b border-gray-50">
          <p className="text-sm font-bold text-gray-800 mb-1">Model</p>
          <p className="text-xs text-gray-400 font-mono">claude-sonnet-4-20250514</p>
        </div>
        <Toggle label="AI document analysis" value={settings.aiEnabled} onChange={v => update("aiEnabled", v)} />
        <NumberField label="Auto-flag threshold (suspicious)" value={settings.aiAutoFlagThreshold} onChange={v => update("aiAutoFlagThreshold", v)} suffix="score below = flag" />
        <NumberField label="Auto-suspend threshold (fraud)" value={settings.aiAutoSuspendThreshold} onChange={v => update("aiAutoSuspendThreshold", v)} suffix="score below = suspend" />
        <div className="pt-4">
          <button onClick={handleTestAI}
            className="border-2 border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm hover:border-orange-400 hover:text-orange-600 transition-all flex items-center gap-2">
            {testStatus === "testing" ? <><div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />Testing...</> :
             testStatus === "success" ? "✅ API Connected" : "🔌 Test API Connection"}
          </button>
        </div>
      </div>

      {/* Section 4: FO Assignment */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🗺️ FO Assignment Rules</h2>
        <p className="text-sm font-bold text-gray-700 mb-3">Assignment method</p>
        {[
          { id: "auto", label: "Auto-assign nearest FO (by property GPS)" },
          { id: "manual", label: "Manual (admin picks FO each time)" },
          { id: "selfclaim", label: "Self-claim (FOs claim from open queue)" },
        ].map(opt => (
          <label key={opt.id} className="flex items-center gap-3 py-2 cursor-pointer">
            <input type="radio" name="foMethod" checked={settings.foAssignmentMethod === opt.id}
              onChange={() => update("foAssignmentMethod", opt.id)}
              className="accent-orange-500 w-4 h-4" />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
        <div className="mt-3 border-t border-gray-50 pt-3">
          <NumberField label="Max distance for auto-assign" value={settings.foMaxDistanceKm} onChange={v => update("foMaxDistanceKm", v)} suffix="km" />
          <NumberField label="Re-assign if FO does not confirm in" value={settings.foConfirmHours} onChange={v => update("foConfirmHours", v)} suffix="hours" />
        </div>
      </div>

      {/* Save */}
      <div>
        <button onClick={handleSave}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-base transition-colors">
          {saved ? "✅ Settings Saved!" : "💾 Save All Settings"}
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Last saved: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}