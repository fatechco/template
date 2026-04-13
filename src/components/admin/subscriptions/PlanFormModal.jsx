import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const TIERS = ["free", "basic", "starter", "bronze", "silver", "gold", "professional", "enterprise"];
const BILLING_CYCLES = ["monthly", "quarterly", "semi_annual", "annual", "lifetime", "one_time"];

const MODULE_META = {
  kemedar: { listingLabel: "Max Properties", showProjects: true, showCommission: false },
  kemework: { listingLabel: "Max Services", showProjects: false, showCommission: false },
  kemetro: { listingLabel: "Max Products", showProjects: false, showCommission: true },
};

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white";
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

export default function PlanFormModal({ plan, modules, mode, onSave, onClose }) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Plan" : mode === "duplicate" ? "Duplicate Plan" : "Create New Plan";

  const [form, setForm] = useState({
    moduleId: "",
    name: "",
    slug: "",
    tier: "free",
    priceUSD: 0,
    billingCycle: "monthly",
    maxListings: "",
    maxProjects: "",
    commissionPercent: "",
    features: [""],
    badgeLabel: "",
    sortOrder: 0,
    isDefault: false,
    isActive: true,
  });
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        moduleId: plan.moduleId || "",
        name: plan.name || "",
        slug: plan.slug || "",
        tier: plan.tier || "free",
        priceUSD: plan.priceUSD ?? 0,
        billingCycle: plan.billingCycle || "monthly",
        maxListings: plan.maxListings ?? "",
        maxProjects: plan.maxProjects ?? "",
        commissionPercent: plan.commissionPercent ?? "",
        features: plan.features?.length ? plan.features : [""],
        badgeLabel: plan.badgeLabel || "",
        sortOrder: plan.sortOrder ?? 0,
        isDefault: plan.isDefault || false,
        isActive: plan.isActive !== false,
      });
      setSlugManual(true);
    }
  }, [plan]);

  const selectedModule = modules.find(m => m.id === form.moduleId);
  const modMeta = MODULE_META[selectedModule?.slug] || { listingLabel: "Max Listings", showProjects: false, showCommission: false };

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleNameChange = (val) => {
    set("name", val);
    if (!slugManual) set("slug", slugify(val));
  };

  const handleSlugChange = (val) => {
    set("slug", val);
    setSlugManual(true);
  };

  const addFeature = () => set("features", [...form.features, ""]);
  const removeFeature = (i) => set("features", form.features.filter((_, idx) => idx !== i));
  const setFeature = (i, val) => set("features", form.features.map((f, idx) => idx === i ? val : f));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      maxListings: form.maxListings === "" ? null : Number(form.maxListings),
      maxProjects: form.maxProjects === "" ? null : Number(form.maxProjects),
      commissionPercent: form.commissionPercent === "" ? null : Number(form.commissionPercent),
      priceUSD: Number(form.priceUSD),
      sortOrder: Number(form.sortOrder),
      features: form.features.filter(f => f.trim()),
    };
    await onSave(payload);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">💎 {title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* System Module */}
          <div>
            <label className={labelCls}>System Module *</label>
            <select required value={form.moduleId} onChange={e => set("moduleId", e.target.value)} className={inputCls}>
              <option value="">Select a module…</option>
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
              ))}
            </select>
          </div>

          {/* Name + Slug */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Plan Name *</label>
              <input required value={form.name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Bronze Package" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input required value={form.slug} onChange={e => handleSlugChange(e.target.value)}
                placeholder="e.g. kemedar-bronze" className={inputCls} />
            </div>
          </div>

          {/* Tier + Billing Cycle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tier *</label>
              <select required value={form.tier} onChange={e => set("tier", e.target.value)} className={inputCls}>
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Billing Cycle</label>
              <select value={form.billingCycle} onChange={e => set("billingCycle", e.target.value)} className={inputCls}>
                {BILLING_CYCLES.map(b => <option key={b} value={b}>{b.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price USD ($/mo) *</label>
              <input required type="number" min="0" step="0.01" value={form.priceUSD}
                onChange={e => set("priceUSD", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => set("sortOrder", e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Max Listings */}
          <div>
            <label className={labelCls}>{modMeta.listingLabel} <span className="font-normal text-gray-400 normal-case">(leave empty for unlimited)</span></label>
            <input type="number" min="0" value={form.maxListings}
              onChange={e => set("maxListings", e.target.value)}
              placeholder="Unlimited" className={inputCls} />
          </div>

          {/* Max Projects — Kemedar only */}
          {modMeta.showProjects && (
            <div>
              <label className={labelCls}>Max Projects <span className="font-normal text-gray-400 normal-case">(leave empty for unlimited)</span></label>
              <input type="number" min="0" value={form.maxProjects}
                onChange={e => set("maxProjects", e.target.value)}
                placeholder="Unlimited" className={inputCls} />
            </div>
          )}

          {/* Commission — Kemetro only */}
          {modMeta.showCommission && (
            <div>
              <label className={labelCls}>Commission Percent (%)</label>
              <input type="number" min="0" max="100" step="0.1" value={form.commissionPercent}
                onChange={e => set("commissionPercent", e.target.value)}
                placeholder="e.g. 8" className={inputCls} />
            </div>
          )}

          {/* Features */}
          <div>
            <label className={labelCls}>Features</label>
            <div className="space-y-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input value={f} onChange={e => setFeature(i, e.target.value)}
                    placeholder="Feature description…"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  {form.features.length > 1 && (
                    <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addFeature}
                className="flex items-center gap-1.5 text-xs text-orange-600 font-bold hover:underline">
                <Plus size={12} /> Add Feature
              </button>
            </div>
          </div>

          {/* Badge Label */}
          <div>
            <label className={labelCls}>Badge Label <span className="font-normal text-gray-400 normal-case">(optional)</span></label>
            <input value={form.badgeLabel} onChange={e => set("badgeLabel", e.target.value)}
              placeholder='e.g. "MOST POPULAR"' className={inputCls} />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={e => set("isDefault", e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm font-semibold text-gray-700">Is Default</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm font-semibold text-gray-700">Is Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? "Saving…" : "Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}