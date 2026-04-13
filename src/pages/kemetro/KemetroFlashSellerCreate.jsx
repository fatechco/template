import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const DEAL_TYPES = [
  { id: "flash_sale", icon: "⚡", label: "Flash Sale", desc: "Time-limited offer with big discount. Perfect for boosting slow products.", bestFor: "Standard products" },
  { id: "bulk_clearance", icon: "📦", label: "Bulk Clearance", desc: "Clear excess stock quickly. Deep discounts on large lots.", bestFor: "Overstock situations" },
  { id: "bundle_deal", icon: "🎁", label: "Bundle Deal", desc: "Package complementary products together at attractive price.", bestFor: "Cross-selling" },
  { id: "seasonal_offer", icon: "🗓", label: "Seasonal Offer", desc: "Planned sale event tied to season or occasion.", bestFor: "Planned promotions" },
];

const DURATIONS = [
  { label: "24 hours", hours: 24 },
  { label: "48 hours", hours: 48 },
  { label: "72 hours", hours: 72 },
  { label: "1 week", hours: 168 },
  { label: "Custom", hours: null },
];

const STEPS = ["Deal Type", "Product", "Deal Terms", "Timing", "Delivery", "Targeting", "Review"];

export default function KemetroFlashSellerCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    dealType: "flash_sale", productName: "", productDescription: "", category: "flooring",
    unit: "m²", originalPrice: "", dealPrice: "", discountPercent: "",
    totalStockAvailable: "", minimumOrderQty: 10, maximumOrderQtyPerBuyer: "",
    hasTieredPricing: false, priceTiers: [],
    durationHours: 48, dealStartsAt: "", dealStartNow: true,
    deliveryOption: "seller_delivers", deliveryLeadDays: 3,
    freeDeliveryThreshold: 10000, deliveryCostPerUnit: 0,
    targetingType: "nationwide", availableNationwide: true, availableInCityIds: [],
    sendNotification: true,
    agreeTerms: false, agreeStock: false,
  });

  const update = d => setForm(p => ({ ...p, ...d }));

  const calcDiscount = () => {
    if (form.originalPrice && form.dealPrice) {
      const d = Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100);
      update({ discountPercent: d });
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    const user = await base44.auth.me().catch(() => null);
    const now = new Date();
    const endsAt = new Date(now.getTime() + (form.durationHours || 48) * 3600000);
    const dealNumber = `KFD-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await base44.entities.FlashDeal.create({
      dealNumber, sellerId: user?.id, sellerName: user?.full_name || "Seller",
      dealType: form.dealType, productName: form.productName, productDescription: form.productDescription,
      category: form.category, unit: form.unit, originalPrice: Number(form.originalPrice),
      dealPrice: Number(form.dealPrice), discountPercent: Number(form.discountPercent),
      totalStockAvailable: Number(form.totalStockAvailable), stockRemaining: Number(form.totalStockAvailable),
      minimumOrderQty: Number(form.minimumOrderQty), hasTieredPricing: form.hasTieredPricing,
      priceTiers: form.priceTiers, deliveryOption: form.deliveryOption,
      deliveryLeadDays: form.deliveryLeadDays, freeDeliveryThreshold: form.freeDeliveryThreshold,
      availableNationwide: form.availableNationwide,
      dealStartsAt: form.dealStartNow ? now.toISOString() : form.dealStartsAt,
      dealEndsAt: endsAt.toISOString(), status: "active", isAdminApproved: Number(form.originalPrice) < 500000,
    }).catch(() => {});
    setPublishing(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center mx-4">
          <p className="text-6xl mb-4">⚡</p>
          <h2 className="text-3xl font-black text-green-600 mb-2">Flash Deal Published!</h2>
          <p className="text-gray-500 mb-6">Your deal is now live. Share it to get more orders!</p>
          <div className="space-y-2">
            {["📱 Share on WhatsApp", "📘 Facebook", "🔗 Copy Deal Link"].map(a => (
              <button key={a} className="w-full border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">{a}</button>
            ))}
          </div>
          <Link to="/kemetro/seller/flash" className="mt-4 block bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors">View Live Dashboard →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Link to="/kemetro/seller/flash" className="text-gray-400 hover:text-gray-600">‹</Link>
              <span className="font-black text-gray-900">⚡ Create Flash Deal</span>
            </div>
            <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((s, i) => <div key={s} className={`flex-1 h-1 rounded-full ${i < step ? "bg-orange-500" : "bg-gray-200"}`} />)}
          </div>
          <p className="text-xs text-gray-500 mt-1">{STEPS[step - 1]}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* STEP 1 — Deal Type */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">What kind of deal?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEAL_TYPES.map(dt => (
                <button key={dt.id} onClick={() => update({ dealType: dt.id })}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${form.dealType === dt.id ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                  <span className="text-4xl">{dt.icon}</span>
                  <h3 className="font-black text-gray-900 mt-2">{dt.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{dt.desc}</p>
                  <p className="text-xs text-orange-600 font-bold mt-2">Best for: {dt.bestFor}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Product */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Product Details</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700">Product Name *</label>
                <input value={form.productName} onChange={e => update({ productName: e.target.value })} placeholder="e.g. 60×60 Porcelain Floor Tiles — Matte Grey" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select value={form.category} onChange={e => update({ category: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                    {["flooring", "paint", "tiles", "electrical", "plumbing", "kitchen", "bathroom", "adhesives", "grouting", "other"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Unit</label>
                  <select value={form.unit} onChange={e => update({ unit: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                    {["m²", "m", "pcs", "kg", "liter", "bag", "set", "can"].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea value={form.productDescription} onChange={e => update({ productDescription: e.target.value })} rows={3} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="Describe the product quality, specifications, etc." />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Deal Terms */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Deal Terms & Pricing</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Original Price (EGP / {form.unit})</label>
                  <input type="number" value={form.originalPrice} onChange={e => { update({ originalPrice: e.target.value }); calcDiscount(); }} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="285" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Flash Price (EGP / {form.unit})</label>
                  <input type="number" value={form.dealPrice} onChange={e => { update({ dealPrice: e.target.value }); calcDiscount(); }} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="185" />
                </div>
              </div>
              {form.originalPrice && form.dealPrice && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-red-600">-{Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100)}%</span>
                    <div className="text-sm">
                      <p className="text-gray-600">Buyers save: <strong className="text-green-600">{fmt(form.originalPrice - form.dealPrice)} EGP</strong> per {form.unit}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Total Stock for this Deal</label>
                  <input type="number" value={form.totalStockAvailable} onChange={e => update({ totalStockAvailable: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="500" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Min. per buyer ({form.unit})</label>
                  <input type="number" value={form.minimumOrderQty} onChange={e => update({ minimumOrderQty: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Timing */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Deal Duration & Timing</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-bold text-gray-700 mb-3">Duration:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {DURATIONS.map(d => (
                  <button key={d.label} onClick={() => update({ durationHours: d.hours })}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.durationHours === d.hours ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
              {form.durationHours && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
                  <p className="font-bold text-gray-900">Buyers will see:</p>
                  <p className="text-orange-600 font-black text-lg mt-1">⏰ Ends in: {form.durationHours}h 00m 00s</p>
                </div>
              )}
              <div className="mt-4">
                <p className="font-bold text-gray-700 mb-2">When to start:</p>
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 mb-2 cursor-pointer ${form.dealStartNow ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <input type="radio" checked={form.dealStartNow} onChange={() => update({ dealStartNow: true })} className="accent-orange-500" />
                  <span className="font-bold">Start immediately</span>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${!form.dealStartNow ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <input type="radio" checked={!form.dealStartNow} onChange={() => update({ dealStartNow: false })} className="accent-orange-500" />
                  <span className="font-bold">Schedule for later</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Delivery */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Delivery Options</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              {[
                { id: "seller_delivers", label: "🚚 Seller delivers" },
                { id: "buyer_collects", label: "🏪 Buyer collects" },
                { id: "both", label: "✅ Both options" },
              ].map(opt => (
                <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer ${form.deliveryOption === opt.id ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <input type="radio" checked={form.deliveryOption === opt.id} onChange={() => update({ deliveryOption: opt.id })} className="accent-orange-500" />
                  <span className="font-bold">{opt.label}</span>
                </label>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Lead time (days)</label>
                  <input type="number" value={form.deliveryLeadDays} onChange={e => update({ deliveryLeadDays: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Free delivery above (EGP)</label>
                  <input type="number" value={form.freeDeliveryThreshold} onChange={e => update({ freeDeliveryThreshold: e.target.value })} className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6 — Targeting */}
        {step === 6 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Who should see this deal?</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              {[
                { id: "nationwide", label: "🌍 All Kemetro buyers", desc: "Maximum reach" },
                { id: "ai", label: "🤖 AI-targeted (recommended)", desc: "Show to buyers most likely to need this" },
              ].map(opt => (
                <label key={opt.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${form.targetingType === opt.id ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <input type="radio" checked={form.targetingType === opt.id} onChange={() => update({ targetingType: opt.id, availableNationwide: opt.id !== "cities" })} className="mt-0.5 accent-orange-500" />
                  <div>
                    <p className="font-bold">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
              {form.targetingType === "ai" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
                  <p className="font-bold text-blue-800 mb-2">AI will target:</p>
                  {["Users with active BOQs needing this category", "Kemedar Finish™ project owners in relevant phase", "Users who wishlisted similar products"].map(t => (
                    <p key={t} className="text-blue-700">✅ {t}</p>
                  ))}
                  <p className="text-blue-600 font-bold mt-2">Estimated reach: 2,400+ targeted buyers</p>
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                <input type="checkbox" checked={form.sendNotification} onChange={e => update({ sendNotification: e.target.checked })} className="accent-orange-500 w-4 h-4" />
                <div>
                  <p className="font-bold text-sm">🔔 Send push notification when deal starts</p>
                  <p className="text-xs text-gray-400">Recommended for best results</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 7 — Review */}
        {step === 7 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Review & Publish</h2>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 mb-4">
              {[
                ["Deal Type", form.dealType.replace(/_/g, " ")],
                ["Product", form.productName],
                ["Category", form.category],
                ["Original Price", `${fmt(form.originalPrice)} EGP / ${form.unit}`],
                ["Flash Price", `${fmt(form.dealPrice)} EGP / ${form.unit}`],
                ["Discount", `${Math.round(((form.originalPrice - form.dealPrice) / form.originalPrice) * 100)}%`],
                ["Stock", `${form.totalStockAvailable} ${form.unit}`],
                ["Duration", form.durationHours ? `${form.durationHours} hours` : "Custom"],
                ["Delivery", form.deliveryOption.replace(/_/g, " ")],
                ["Targeting", form.targetingType],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-gray-50 pb-2 last:border-0 text-sm">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-bold text-gray-900 capitalize">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <p className="font-black text-blue-800 mb-2">📊 AI Revenue Estimate:</p>
              {[
                { label: "Conservative (10% conversion)", val: fmt(Number(form.totalStockAvailable) * Number(form.dealPrice) * 0.1) },
                { label: "Expected (25% conversion)", val: fmt(Number(form.totalStockAvailable) * Number(form.dealPrice) * 0.25) },
                { label: "Optimistic (40% conversion)", val: fmt(Number(form.totalStockAvailable) * Number(form.dealPrice) * 0.4) },
              ].map(r => <div key={r.label} className="flex justify-between text-sm"><span className="text-blue-700">{r.label}:</span><span className="font-black text-blue-900">{r.val} EGP</span></div>)}
            </div>

            <div className="space-y-2 mb-5">
              {[
                { key: "agreeTerms", label: "I agree to Flash™ deal terms and conditions" },
                { key: "agreeStock", label: "Stock is available and ready to ship" },
              ].map(c => (
                <label key={c.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form[c.key]} onChange={e => update({ [c.key]: e.target.checked })} className="accent-orange-500 w-4 h-4" />
                  <span className="text-sm text-gray-700">{c.label}</span>
                </label>
              ))}
            </div>

            <button onClick={handlePublish} disabled={!form.agreeTerms || !form.agreeStock || publishing} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2">
              {publishing ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "⚡"}
              {publishing ? "Publishing..." : "Publish Flash Deal"}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">← Back</button>}
          {step < STEPS.length && (
            <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors">
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}