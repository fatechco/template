import { useState, useEffect } from "react";
import { Save, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-gray-300"}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
      <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-teal-500 rounded-full" /> {title}
      </h3>
      {children}
    </div>
  );
}

export default function STLSettings() {
  const [settings, setSettings] = useState({
    isActive: true,
    triggerOnPublish: true,
    furnishedOnly: true,
    minFinishingLevel: "Complete Finishing",
    maxImagesPerProperty: 5,
    claudeModel: "claude-sonnet-4-20250514",
    maxHotspotsPerImage: 6,
    minHotspotsToShoppable: 2,
    sponsorDailyRate: 50,
    sponsorCPC: 2,
    minCampaignDays: 7,
    requireApproval: true,
    guestCartExpiry: 7,
    mergeGuestCart: true,
  });
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    base44.auth.me().then(u => setAdminName(u?.full_name || u?.email || "Admin")).catch(() => {});
    base44.entities.ShopTheLookSettings.list("-created_date", 1)
      .then(res => {
        if (res?.[0]) {
          const s = res[0];
          setSettings(prev => ({
            ...prev,
            isActive: s.isActive ?? prev.isActive,
            triggerOnPublish: s.triggerOnFurnishedOnly != null ? s.triggerOnFurnishedOnly : prev.triggerOnPublish,
            furnishedOnly: s.triggerOnFurnishedOnly ?? prev.furnishedOnly,
            minFinishingLevel: s.minFinishingLevelToAnalyze ?? prev.minFinishingLevel,
            maxImagesPerProperty: s.maxHotspotsPerImage ?? prev.maxImagesPerProperty,
            claudeModel: s.claudeModel ?? prev.claudeModel,
            maxHotspotsPerImage: s.maxHotspotsPerImage ?? prev.maxHotspotsPerImage,
            minHotspotsToShoppable: s.minHotspotsPerImage ?? prev.minHotspotsToShoppable,
            sponsorDailyRate: s.sponsoredPinCostPerDayEGP ?? prev.sponsorDailyRate,
            sponsorCPC: s.sponsoredPinCostPerClickEGP ?? prev.sponsorCPC,
            guestCartExpiry: s.guestCartExpiryDays ?? prev.guestCartExpiry,
          }));
          setLastSaved(s.updatedAt);
        }
      }).catch(() => {});
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        isActive: settings.isActive,
        triggerOnFurnishedOnly: settings.furnishedOnly,
        minFinishingLevelToAnalyze: settings.minFinishingLevel,
        maxHotspotsPerImage: settings.maxHotspotsPerImage,
        minHotspotsPerImage: settings.minHotspotsToShoppable,
        claudeModel: settings.claudeModel,
        sponsoredPinCostPerDayEGP: settings.sponsorDailyRate,
        sponsoredPinCostPerClickEGP: settings.sponsorCPC,
        guestCartExpiryDays: settings.guestCartExpiry,
        updatedAt: new Date().toISOString(),
      };
      const existing = await base44.entities.ShopTheLookSettings.list("-created_date", 1).catch(() => []);
      if (existing?.[0]) {
        await base44.entities.ShopTheLookSettings.update(existing[0].id, payload);
      } else {
        await base44.entities.ShopTheLookSettings.create(payload);
      }
      setLastSaved(new Date().toISOString());
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleTestVision = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const testUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80";
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this living room image and identify 2-3 shoppable furniture items. Return JSON: { "items": [{ "label": "...", "category": "furniture|lighting|decor", "xPercent": 50, "yPercent": 50 }] }`,
        file_urls: [testUrl],
        response_json_schema: { type: "object", properties: { items: { type: "array", items: { type: "object" } } } },
      });
      setTestResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setTestResult(`Error: ${e.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">✨ Shop the Look — Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configure feature behavior, AI model, and sponsorship pricing</p>
      </div>

      {/* Feature Toggle */}
      <SectionCard title="Feature Toggle">
        <SettingRow label="Shop the Look is active" hint={settings.isActive ? "Feature is live for all eligible properties" : "Feature is disabled globally"}>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${settings.isActive ? "text-teal-600" : "text-gray-400"}`}>{settings.isActive ? "🟢 Active" : "⚫ Inactive"}</span>
            <Toggle checked={settings.isActive} onChange={v => set("isActive", v)} />
          </div>
        </SettingRow>
      </SectionCard>

      {/* Analysis Trigger Rules */}
      <SectionCard title="Analysis Trigger Rules">
        <SettingRow label="Trigger AI analysis on property publish">
          <Toggle checked={settings.triggerOnPublish} onChange={v => set("triggerOnPublish", v)} />
        </SettingRow>
        <SettingRow label="Only analyze furnished properties">
          <Toggle checked={settings.furnishedOnly} onChange={v => set("furnishedOnly", v)} />
        </SettingRow>
        <SettingRow label="Minimum finishing level to analyze">
          <select value={settings.minFinishingLevel} onChange={e => set("minFinishingLevel", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-white">
            <option>Complete Finishing</option>
            <option>High Luxe Finishing</option>
            <option>Semi Finishing</option>
          </select>
        </SettingRow>
        <SettingRow label="Max images analyzed per property" hint="Cost control — limits Claude API calls">
          <input type="number" min={1} max={10} value={settings.maxImagesPerProperty} onChange={e => set("maxImagesPerProperty", parseInt(e.target.value))} className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
      </SectionCard>

      {/* AI Configuration */}
      <SectionCard title="AI Configuration">
        <SettingRow label="Claude API">
          <span className="text-sm font-bold text-teal-600">🟢 Connected</span>
        </SettingRow>
        <SettingRow label="Model">
          <input value={settings.claudeModel} onChange={e => set("claudeModel", e.target.value)} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none w-64" />
        </SettingRow>
        <SettingRow label="Max hotspots per image">
          <input type="number" min={1} max={12} value={settings.maxHotspotsPerImage} onChange={e => set("maxHotspotsPerImage", parseInt(e.target.value))} className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Min hotspots to mark image as shoppable" hint="If fewer found, isShoppable = false">
          <input type="number" min={1} max={6} value={settings.minHotspotsToShoppable} onChange={e => set("minHotspotsToShoppable", parseInt(e.target.value))} className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>

        <div className="mt-4">
          <button onClick={handleTestVision} disabled={testing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors">
            <Zap size={14} /> {testing ? "Testing…" : "Test Vision API"}
          </button>
          {testResult && (
            <pre className="mt-3 bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto max-h-48">{testResult}</pre>
          )}
        </div>
      </SectionCard>

      {/* Sponsorship Pricing */}
      <SectionCard title="Sponsorship Pricing">
        <SettingRow label="Daily rate per sponsored pin (EGP)">
          <input type="number" value={settings.sponsorDailyRate} onChange={e => set("sponsorDailyRate", parseInt(e.target.value))} className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Cost per click on sponsored pin (EGP)">
          <input type="number" value={settings.sponsorCPC} onChange={e => set("sponsorCPC", parseFloat(e.target.value))} className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Minimum campaign duration (days)">
          <input type="number" value={settings.minCampaignDays} onChange={e => set("minCampaignDays", parseInt(e.target.value))} className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Require admin approval for new sponsorships">
          <Toggle checked={settings.requireApproval} onChange={v => set("requireApproval", v)} />
        </SettingRow>
      </SectionCard>

      {/* Guest Cart */}
      <SectionCard title="Guest Cart">
        <SettingRow label="Guest cart expiry (days)">
          <input type="number" min={1} max={30} value={settings.guestCartExpiry} onChange={e => set("guestCartExpiry", parseInt(e.target.value))} className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
        </SettingRow>
        <SettingRow label="Merge guest cart on login">
          <Toggle checked={settings.mergeGuestCart} onChange={v => set("mergeGuestCart", v)} />
        </SettingRow>
      </SectionCard>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black text-base py-4 rounded-xl transition-colors shadow-lg shadow-orange-200">
        <Save size={18} /> {saving ? "Saving…" : "💾 Save All Settings"}
      </button>
      {lastSaved && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Last saved: {new Date(lastSaved).toLocaleString()} by {adminName}
        </p>
      )}
    </div>
  );
}