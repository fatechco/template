"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const SERVICE_TYPES = [
  { value: "one_time", label: "One-Time Purchase" },
  { value: "recurring", label: "Recurring" },
  { value: "custom_quote", label: "Custom Quote" },
];

const CURRENCIES = ["USD", "EGP", "AED", "SAR"];

const USER_TYPES = [
  { value: "common_user", label: "Common User" },
  { value: "agent", label: "Agent" },
  { value: "agency", label: "Agency" },
  { value: "developer", label: "Developer" },
  { value: "franchise_owner", label: "Franchise Owner" },
];

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white";
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

export default function ServiceFormModal({ service, modules, onSave, onClose }) {
  const isEdit = !!service?.id;

  const [form, setForm] = useState({
    moduleId: "",
    name: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    icon: "🛍",
    serviceType: "one_time",
    basePrice: "",
    priceCurrency: "USD",
    priceUnit: "",
    pricingTiers: [],
    requiresFranchiseOwner: true,
    estimatedDeliveryDays: "",
    eligibleUserTypes: [],
    sortOrder: 0,
    isActive: true,
  });
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setForm({
        moduleId: service.moduleId || "",
        name: service.name || "",
        slug: service.slug || "",
        shortDescription: service.shortDescription || "",
        fullDescription: service.fullDescription || "",
        icon: service.icon || "🛍",
        serviceType: service.serviceType || "one_time",
        basePrice: service.basePrice ?? "",
        priceCurrency: service.priceCurrency || "USD",
        priceUnit: service.priceUnit || "",
        pricingTiers: service.pricingTiers || [],
        requiresFranchiseOwner: service.requiresFranchiseOwner !== false,
        estimatedDeliveryDays: service.estimatedDeliveryDays ?? "",
        eligibleUserTypes: service.eligibleUserTypes || [],
        sortOrder: service.sortOrder ?? 0,
        isActive: service.isActive !== false,
      });
      setSlugManual(true);
    }
  }, [service]);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));

  const handleNameChange = (val) => {
    set("name", val);
    if (!slugManual) set("slug", slugify(val));
  };

  const toggleUserType = (type) => {
    set("eligibleUserTypes", form.eligibleUserTypes.includes(type)
      ? form.eligibleUserTypes.filter(t => t !== type)
      : [...form.eligibleUserTypes, type]
    );
  };

  // Pricing tiers
  const addTier = () => set("pricingTiers", [...form.pricingTiers, { label: "", price: "" }]);
  const removeTier = (i) => set("pricingTiers", form.pricingTiers.filter((_, idx) => idx !== i));
  const setTier = (i, field, val) => set("pricingTiers", form.pricingTiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      basePrice: form.serviceType === "custom_quote" || form.basePrice === "" ? null : Number(form.basePrice),
      estimatedDeliveryDays: form.estimatedDeliveryDays === "" ? null : Number(form.estimatedDeliveryDays),
      sortOrder: Number(form.sortOrder),
      pricingTiers: form.pricingTiers
        .filter(t => t.label.trim())
        .map(t => ({ label: t.label, price: t.price === "" ? null : Number(t.price) })),
    };
    await onSave(payload);
    setSaving(false);
  };

  const isCustomQuote = form.serviceType === "custom_quote";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-black text-gray-900">🛍 {isEdit ? "Edit Service" : "Add New Service"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Module */}
          <div>
            <label className={labelCls}>System Module *</label>
            <select required value={form.moduleId} onChange={e => set("moduleId", e.target.value)} className={inputCls}>
              <option value="">Select a module…</option>
              {modules.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
            </select>
          </div>

          {/* Icon + Name */}
          <div className="grid grid-cols-[64px_1fr] gap-3">
            <div>
              <label className={labelCls}>Icon</label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)}
                className={inputCls + " text-center text-2xl"} maxLength={4} />
            </div>
            <div>
              <label className={labelCls}>Service Name *</label>
              <input required value={form.name} onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. KEMEDAR VERI Service" className={inputCls} />
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug *</label>
            <input required value={form.slug} onChange={e => { set("slug", e.target.value); setSlugManual(true); }}
              placeholder="e.g. kemedar-veri" className={inputCls} />
          </div>

          {/* Short Description */}
          <div>
            <label className={labelCls}>Short Description</label>
            <input value={form.shortDescription} onChange={e => set("shortDescription", e.target.value)}
              placeholder="One-liner summary…" className={inputCls} />
          </div>

          {/* Full Description */}
          <div>
            <label className={labelCls}>Full Description</label>
            <textarea value={form.fullDescription} onChange={e => set("fullDescription", e.target.value)}
              rows={3} placeholder="Detailed description…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>

          {/* Service Type */}
          <div>
            <label className={labelCls}>Service Type *</label>
            <select required value={form.serviceType} onChange={e => set("serviceType", e.target.value)} className={inputCls}>
              {SERVICE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Price row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Base Price {isCustomQuote && <span className="font-normal text-gray-400 normal-case">(N/A for custom quote)</span>}</label>
              <input type="number" min="0" step="0.01" value={form.basePrice}
                onChange={e => set("basePrice", e.target.value)}
                disabled={isCustomQuote}
                placeholder={isCustomQuote ? "Custom Quote" : "e.g. 100"}
                className={inputCls + (isCustomQuote ? " opacity-40 cursor-not-allowed" : "")} />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select value={form.priceCurrency} onChange={e => set("priceCurrency", e.target.value)} className={inputCls}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price Unit */}
          <div>
            <label className={labelCls}>Price Unit</label>
            <input value={form.priceUnit} onChange={e => set("priceUnit", e.target.value)}
              placeholder='e.g. "per property", "per month", "per visit"' className={inputCls} />
          </div>

          {/* Pricing Tiers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls + " mb-0"}>Pricing Tiers <span className="font-normal text-gray-400 normal-case">(optional)</span></label>
              <button type="button" onClick={addTier}
                className="flex items-center gap-1 text-xs text-orange-600 font-bold hover:underline">
                <Plus size={12} /> Add Tier
              </button>
            </div>
            {form.pricingTiers.length === 0 && (
              <p className="text-xs text-gray-400 italic">No tiers added. Use for services with multiple pricing options.</p>
            )}
            <div className="space-y-2">
              {form.pricingTiers.map((tier, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input value={tier.label} onChange={e => setTier(i, "label", e.target.value)}
                    placeholder="Label (e.g. Property Verification)"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  <input type="number" min="0" value={tier.price} onChange={e => setTier(i, "price", e.target.value)}
                    placeholder="$"
                    className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-center" />
                  <button type="button" onClick={() => removeTier(i)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requires Franchise Owner */}
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <input type="checkbox" id="reqFranchise" checked={form.requiresFranchiseOwner}
              onChange={e => set("requiresFranchiseOwner", e.target.checked)}
              className="w-4 h-4 accent-orange-500 flex-shrink-0" />
            <label htmlFor="reqFranchise" className="text-sm font-semibold text-orange-800 cursor-pointer">
              Requires Franchise Owner — the local franchise owner implements this service
            </label>
          </div>

          {/* Delivery Days + Sort */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Est. Delivery Days</label>
              <input type="number" min="0" value={form.estimatedDeliveryDays}
                onChange={e => set("estimatedDeliveryDays", e.target.value)}
                placeholder="e.g. 3" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => set("sortOrder", e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Eligible User Types */}
          <div>
            <label className={labelCls}>Eligible User Types</label>
            <div className="grid grid-cols-2 gap-2">
              {USER_TYPES.map(ut => (
                <label key={ut.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-colors text-sm ${
                  form.eligibleUserTypes.includes(ut.value)
                    ? "border-orange-400 bg-orange-50 text-orange-800 font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}>
                  <input type="checkbox" checked={form.eligibleUserTypes.includes(ut.value)}
                    onChange={() => toggleUserType(ut.value)}
                    className="w-3.5 h-3.5 accent-orange-500" />
                  {ut.label}
                </label>
              ))}
            </div>
          </div>

          {/* Is Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => set("isActive", e.target.checked)}
              className="w-4 h-4 accent-orange-500" />
            <span className="text-sm font-semibold text-gray-700">Is Active</span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">
              {saving ? "Saving…" : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}