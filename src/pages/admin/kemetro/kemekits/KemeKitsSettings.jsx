import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-green-500" : "bg-gray-300"}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-7" : "left-1"}`} />
  </button>
);

const Field = ({ label, hint, value, onChange, type = "number", min, max, step }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
    <input
      type={type}
      value={value}
      onChange={e => onChange(type === "number" ? parseFloat(e.target.value) : e.target.value)}
      min={min} max={max} step={step || 0.01}
      className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right outline-none focus:border-blue-400"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
    <h3 className="font-black text-gray-900 text-base mb-4 pb-2 border-b border-gray-100">{title}</h3>
    {children}
  </div>
);

export default function KemeKitsSettings() {
  const [settings, setSettings] = useState({
    isActive: true,
    requireAdminApproval: true,
    defaultWasteMarginPercent: 10,
    defaultPaintCoveragePerLiter: 10,
    doorDeductionSqm: 1.6,
    windowDeductionSqm: 1.4,
    standardDoorWidthM: 0.9,
    defaultAdhesiveRatio: 0.15,
    defaultGroutRatio: 0.25,
    creatorCommissionPercent: 3,
    commissionAskemecoins: true,
    maxProductsPerKit: 25,
    maxGalleryImages: 10,
    heavyFreightThresholdKg: 100,
    shippingWeightRateEGP: 15,
  });
  const [saved, setSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setAdmin).catch(() => {});
    base44.entities.KemeKitSettings.list().then(rows => {
      if (rows && rows[0]) setSettings(s => ({ ...s, ...rows[0] }));
    }).catch(() => {});
  }, []);

  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const existing = await base44.entities.KemeKitSettings.list();
    const data = { ...settings };
    if (existing && existing[0]) {
      await base44.entities.KemeKitSettings.update(existing[0].id, data);
    } else {
      await base44.entities.KemeKitSettings.create(data);
    }
    setSaved(new Date());
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6">KemeKits Settings</h1>

      <Section title="1. Feature Toggle">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">KemeKits is:</p>
            <p className="text-xs text-gray-400">{settings.isActive ? "🟢 Active — visible to buyers and designers" : "⚫ Inactive — hidden from all users"}</p>
          </div>
          <Toggle checked={settings.isActive} onChange={v => set("isActive", v)} />
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-gray-900">Require admin approval before publishing</p>
          </div>
          <Toggle checked={settings.requireAdminApproval} onChange={v => set("requireAdminApproval", v)} />
        </div>
      </Section>

      <Section title="2. Default Calculation Values">
        <Field label="Default waste margin %" value={settings.defaultWasteMarginPercent} onChange={v => set("defaultWasteMarginPercent", v)} min={0} max={50} />
        <Field label="Paint coverage per liter (sqm)" value={settings.defaultPaintCoveragePerLiter} onChange={v => set("defaultPaintCoveragePerLiter", v)} min={1} />
        <Field label="Door deduction per door (sqm)" value={settings.doorDeductionSqm} onChange={v => set("doorDeductionSqm", v)} min={0} />
        <Field label="Window deduction per window (sqm)" value={settings.windowDeductionSqm} onChange={v => set("windowDeductionSqm", v)} min={0} />
        <Field label="Standard door width for perimeter (m)" value={settings.standardDoorWidthM} onChange={v => set("standardDoorWidthM", v)} min={0.5} max={2} />
        <Field label="Default tile adhesive ratio (kg/sqm)" value={settings.defaultAdhesiveRatio} onChange={v => set("defaultAdhesiveRatio", v)} min={0} step={0.01} />
        <Field label="Default grout ratio (kg/sqm)" value={settings.defaultGroutRatio} onChange={v => set("defaultGroutRatio", v)} min={0} step={0.01} />
      </Section>

      <Section title="3. Commission Settings">
        <Field
          label="Default designer commission %"
          hint="Applied to all new kits unless overridden per designer"
          value={settings.creatorCommissionPercent}
          onChange={v => set("creatorCommissionPercent", v)}
          min={0} max={30}
        />
        <div className="flex items-center justify-between py-2">
          <p className="text-sm font-semibold text-gray-900">Commission paid as Kemecoins</p>
          <Toggle checked={settings.commissionAskemecoins} onChange={v => set("commissionAskemecoins", v)} />
        </div>
      </Section>

      <Section title="4. Limits">
        <Field label="Max products per kit" value={settings.maxProductsPerKit} onChange={v => set("maxProductsPerKit", v)} min={1} max={100} step={1} />
        <Field label="Max gallery images per kit" value={settings.maxGalleryImages} onChange={v => set("maxGalleryImages", v)} min={1} max={20} step={1} />
        <Field label="Heavy freight threshold (kg)" value={settings.heavyFreightThresholdKg} onChange={v => set("heavyFreightThresholdKg", v)} min={1} step={1} />
        <Field label="Shipping rate (EGP per kg)" value={settings.shippingWeightRateEGP} onChange={v => set("shippingWeightRateEGP", v)} min={1} />
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-base transition-colors"
      >
        {saving ? "Saving..." : "💾 Save All Settings"}
      </button>
      {saved && admin && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Last saved: {saved.toLocaleString()} by {admin.full_name || admin.email}
        </p>
      )}
    </div>
  );
}