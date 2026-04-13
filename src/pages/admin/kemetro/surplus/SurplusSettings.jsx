import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-300"}`}>
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-0"}`} />
    </button>
  );
}

function Field({ label, value, onChange, type = "number" }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <input type={type} value={value} onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 text-right" />
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-2">
      <h3 className="font-black text-gray-900 text-base mb-3 border-b border-gray-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

export default function SurplusSettings() {
  const [settings, setSettings] = useState({
    isActive: true,
    allowGuestBrowsing: true,
    platformFeePercent: 5,
    shipperRatePerKgEGP: 15,
    maxImagesPerListing: 8,
    listingExpiryDays: 90,
    reservationExpiryHours: 48,
    defaultSearchRadiusKm: 15,
    maxSearchRadiusKm: 100,
    ecoStarterKgThreshold: 500,
    ecoBuilderKgThreshold: 2000,
    ecoChampionKgThreshold: 5000,
    claudeModel: "claude-sonnet-4-20250514",
    proAlertEnabled: true,
    proAlertMinDiscount: 40,
    proAlertMaxDistanceKm: 10,
    postRenovationDelayDays: 2,
    largeOrderSurplusThresholdEGP: 5000,
  });
  const [lastSaved, setLastSaved] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [aiTestResult, setAiTestResult] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
    base44.entities.SurplusSettings.list().then(data => {
      if (data?.[0]) setSettings(s => ({ ...s, ...data[0] }));
    }).catch(() => {});
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    const existing = await base44.entities.SurplusSettings.list();
    const updatedAt = new Date().toISOString();
    if (existing?.[0]) {
      await base44.entities.SurplusSettings.update(existing[0].id, { ...settings, updatedAt });
    } else {
      await base44.entities.SurplusSettings.create({ ...settings, updatedAt });
    }
    setLastSaved(new Date());
  };

  const handleTestAI = async () => {
    setAiTestResult("Testing...");
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: "Analyze this building material: 3 boxes of white ceramic floor tiles, 60x60cm, appear new. Estimate condition, suggest category, unit type, and discount.",
        response_json_schema: {
          type: "object",
          properties: {
            condition: { type: "string" },
            category: { type: "string" },
            unit: { type: "string" },
            suggestedDiscountPercent: { type: "number" },
            description: { type: "string" },
          }
        }
      });
      setAiTestResult(JSON.stringify(result, null, 2));
    } catch (e) {
      setAiTestResult("Error: " + e.message);
    }
  };

  return (
    <div className="space-y-6 p-8 max-w-4xl">
      <h1 className="text-3xl font-black text-gray-900">⚙️ Surplus & Salvage Settings</h1>

      <SectionCard title="1. Feature Toggle">
        <div className="flex items-center justify-between py-2"><span className="text-sm text-gray-700">Surplus & Salvage is active</span><Toggle value={settings.isActive} onChange={v => set("isActive", v)} /></div>
        <div className="flex items-center justify-between py-2"><span className="text-sm text-gray-700">Allow guest browsing</span><Toggle value={settings.allowGuestBrowsing} onChange={v => set("allowGuestBrowsing", v)} /></div>
        <div className="flex items-center justify-between py-2"><span className="text-sm text-gray-700">Allow guest listing (OFF = requires login)</span><Toggle value={false} onChange={() => {}} /></div>
      </SectionCard>

      <SectionCard title="2. Fees & Economics">
        <Field label="Platform fee on each transaction (%)" value={settings.platformFeePercent} onChange={v => set("platformFeePercent", v)} />
        <Field label="Shipper rate per kg (EGP)" value={settings.shipperRatePerKgEGP} onChange={v => set("shipperRatePerKgEGP", v)} />
        <Field label="Max images per listing" value={settings.maxImagesPerListing} onChange={v => set("maxImagesPerListing", v)} />
        <Field label="Listing expiry (days)" value={settings.listingExpiryDays} onChange={v => set("listingExpiryDays", v)} />
        <Field label="Reservation expiry (hours)" value={settings.reservationExpiryHours} onChange={v => set("reservationExpiryHours", v)} />
      </SectionCard>

      <SectionCard title="3. Geo Defaults">
        <Field label="Default search radius (km)" value={settings.defaultSearchRadiusKm} onChange={v => set("defaultSearchRadiusKm", v)} />
        <Field label="Maximum allowed radius (km)" value={settings.maxSearchRadiusKm} onChange={v => set("maxSearchRadiusKm", v)} />
      </SectionCard>

      <SectionCard title="4. Eco Tier Thresholds">
        <Field label="Eco Starter threshold (kg)" value={settings.ecoStarterKgThreshold} onChange={v => set("ecoStarterKgThreshold", v)} />
        <Field label="Eco Builder threshold (kg)" value={settings.ecoBuilderKgThreshold} onChange={v => set("ecoBuilderKgThreshold", v)} />
        <Field label="Eco Champion threshold (kg)" value={settings.ecoChampionKgThreshold} onChange={v => set("ecoChampionKgThreshold", v)} />
        <p className="text-xs text-gray-400 pt-1">Eco Leader = above Champion — no upper limit</p>
      </SectionCard>

      <SectionCard title="5. AI Configuration">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700">Claude API</span>
          <span className="flex items-center gap-2 text-sm text-green-700 font-bold"><span className="w-2 h-2 bg-green-500 rounded-full" /> Connected</span>
        </div>
        <Field label="Model" value={settings.claudeModel} onChange={v => set("claudeModel", v)} type="text" />
        <button onClick={handleTestAI} className="mt-3 px-4 py-2 border border-green-500 text-green-700 rounded-lg text-sm font-bold hover:bg-green-50">Test Vision AI →</button>
        {aiTestResult && (
          <pre className="mt-3 bg-gray-50 rounded-lg p-4 text-xs text-gray-700 overflow-x-auto">{aiTestResult}</pre>
        )}
      </SectionCard>

      <SectionCard title="6. Synergy Triggers">
        <div className="flex items-center justify-between py-2"><span className="text-sm text-gray-700">Show Pro material alert on job acceptance</span><Toggle value={settings.proAlertEnabled} onChange={v => set("proAlertEnabled", v)} /></div>
        <Field label="Min discount % to show Pro alert" value={settings.proAlertMinDiscount} onChange={v => set("proAlertMinDiscount", v)} />
        <Field label="Max distance for Pro alert (km)" value={settings.proAlertMaxDistanceKm} onChange={v => set("proAlertMaxDistanceKm", v)} />
        <Field label="Post-renovation notification delay (days)" value={settings.postRenovationDelayDays} onChange={v => set("postRenovationDelayDays", v)} />
        <Field label="Large order surplus nudge threshold (EGP)" value={settings.largeOrderSurplusThresholdEGP} onChange={v => set("largeOrderSurplusThresholdEGP", v)} />
      </SectionCard>

      <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl text-lg transition-colors">
        💾 Save All Settings
      </button>
      {lastSaved && (
        <p className="text-sm text-gray-500 text-center">
          Last saved: {lastSaved.toLocaleString()} {currentUser?.full_name ? `by ${currentUser.full_name}` : ""}
        </p>
      )}
    </div>
  );
}