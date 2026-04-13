import { useState, useEffect } from "react";

const CATEGORIES = ["Flooring", "Tiles", "Paint", "Wood & Timber", "Plumbing", "Electrical", "Doors & Windows", "Sanitaryware", "Kitchen", "Hardware", "Other"];
const UNITS = ["boxes", "pieces", "gallons", "liters", "sqm", "meters", "kg", "tons", "rolls", "sheets", "sets"];
const CONDITIONS = [
  { value: "brand_new_excess", label: "✨ Brand New (Excess)" },
  { value: "open_box",         label: "📦 Open Box" },
  { value: "lightly_used",     label: "👍 Lightly Used" },
  { value: "salvaged",         label: "♻️ Salvaged/Reclaimed" },
];

function getDiscountBadge(pct) {
  if (pct === null || isNaN(pct)) return null;
  if (pct >= 60) return { label: `🔥 ${Math.round(pct)}% Off Retail`, cls: "bg-red-100 text-red-700" };
  if (pct >= 40) return { label: `💚 ${Math.round(pct)}% Off Retail`, cls: "bg-green-100 text-green-700" };
  if (pct >= 20) return { label: `👍 ${Math.round(pct)}% Off Retail`, cls: "bg-blue-100 text-blue-700" };
  return { label: `⚡ ${Math.round(pct)}% Off Retail`, cls: "bg-gray-100 text-gray-600" };
}

export default function SurplusStep2Form({ aiResult, capturedImages, formData, setFormData, onNext }) {
  const [showArDesc, setShowArDesc] = useState(false);

  useEffect(() => {
    if (!aiResult) return;
    const suggested = aiResult.aiSuggestedTitle || "";
    const suggestedCat = aiResult.kemetroCategorySlug || "";
    const matchedCat = CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, "-") === suggestedCat) || CATEGORIES[0];
    const suggestedUnit = UNITS.includes(aiResult.suggestedUnit) ? aiResult.suggestedUnit : "pieces";
    const retailPrice = aiResult.aiMatchedProductRetailPriceEGP || null;
    const discountPct = aiResult.suggestedDiscountPercent || 55;
    const suggestedPrice = retailPrice ? Math.round(retailPrice * (1 - discountPct / 100)) : "";

    setFormData(prev => ({
      category: matchedCat,
      title: suggested,
      titleAr: aiResult.aiSuggestedTitleAr || "",
      condition: aiResult.conditionEstimate || "brand_new_excess",
      quantity: aiResult.estimatedQuantity || 1,
      unit: suggestedUnit,
      originalRetailPriceEGP: retailPrice || "",
      surplusPriceEGP: suggestedPrice,
      description: aiResult.aiDescription || "",
      descriptionAr: aiResult.aiDescriptionAr || "",
      estimatedWeightKg: aiResult.estimatedWeightKg || "",
      estimatedCo2SavedKg: aiResult.estimatedCo2SavedKg || "",
      ecoImpactNote: aiResult.ecoImpactNote || "",
      aiMatchedProductId: aiResult.aiMatchedProductId || null,
      aiMatchedProductName: aiResult.aiMatchedProductName || null,
      aiMatchedProductRetailPriceEGP: retailPrice,
      ...prev,
    }));
  }, [aiResult]);

  const f = formData;
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const discountPct = f.originalRetailPriceEGP && f.surplusPriceEGP
    ? (1 - Number(f.surplusPriceEGP) / Number(f.originalRetailPriceEGP)) * 100
    : null;
  const badge = getDiscountBadge(discountPct);

  const isValid = f.title && f.surplusPriceEGP > 0 && f.quantity > 0 && f.condition;

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto pb-10">

      {/* Barcode match banner */}
      {aiResult?.pathUsed === "barcode_match" && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-green-800">✅ Barcode matched! We found this in our catalog — details pre-filled.</p>
          {aiResult.aiMatchedProductName && <p className="text-xs text-green-700 mt-1 font-semibold">"{aiResult.aiMatchedProductName}"</p>}
        </div>
      )}

      {/* Low confidence warning */}
      {aiResult?.dataConfidence === "low" && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-orange-700">⚠️ Our AI wasn't fully certain from this photo. Please review and edit all fields carefully.</p>
        </div>
      )}

      {/* Preview image strip */}
      {capturedImages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {capturedImages.map((img, i) => (
            <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border-2 border-green-200" />
          ))}
        </div>
      )}

      {/* Main form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
          <select value={f.category || ""} onChange={e => set("category", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 bg-white">
            <option value="">Select category...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Item name <span className="text-red-500">*</span></label>
          <input value={f.title || ""} onChange={e => set("title", e.target.value)}
            placeholder="e.g. 3 Boxes Cleopatra Marble Tiles"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Condition <span className="text-red-500">*</span></label>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map(c => (
              <button key={c.value} onClick={() => set("condition", c.value)}
                className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                  f.condition === c.value ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-300"
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Unit */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Quantity available <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => set("quantity", Math.max(1, (f.quantity || 1) - 1))}
                className="px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-50 text-lg">−</button>
              <span className="px-4 py-2 font-black text-gray-900 text-lg min-w-[48px] text-center">{f.quantity || 1}</span>
              <button onClick={() => set("quantity", (f.quantity || 1) + 1)}
                className="px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-50 text-lg">+</button>
            </div>
            <select value={f.unit || "pieces"} onChange={e => set("unit", e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 bg-white">
              {UNITS.map(u => <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing card */}
      <div className="rounded-2xl border border-green-200 p-5 space-y-3" style={{ background: "#F0FDF4" }}>
        <p className="text-sm font-black text-green-800">💰 Smart Pricing</p>

        {f.originalRetailPriceEGP ? (
          <>
            <p className="text-xs text-green-700">Original retail price: <span className="font-bold">{Number(f.originalRetailPriceEGP).toLocaleString()} EGP</span></p>
            {aiResult?.suggestedDiscountPercent && (
              <p className="text-xs text-green-700">AI suggests <span className="font-bold">{aiResult.suggestedDiscountPercent}%</span> discount for quick sale</p>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-500">No retail price found. Enter your asking price:</p>
        )}

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Your asking price</label>
          <div className="flex items-center border-2 border-green-300 rounded-xl overflow-hidden bg-white">
            <input
              type="number"
              value={f.surplusPriceEGP || ""}
              onChange={e => set("surplusPriceEGP", e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 text-2xl font-black text-center focus:outline-none"
            />
            <span className="pr-4 text-gray-400 font-bold text-sm">EGP</span>
          </div>
        </div>

        {badge && (
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-black ${badge.cls}`}>
            {badge.label}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">Description (optional)</label>
          <textarea value={f.description || ""} onChange={e => set("description", e.target.value)}
            rows={3} placeholder="Describe condition, dimensions, reason for selling..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 resize-none" />
        </div>

        <button onClick={() => setShowArDesc(v => !v)} className="text-xs text-green-600 font-semibold">
          {showArDesc ? "▲ Hide Arabic description" : "▼ Show Arabic description"}
        </button>
        {showArDesc && (
          <textarea value={f.descriptionAr || ""} onChange={e => set("descriptionAr", e.target.value)}
            rows={3} placeholder="الوصف بالعربية..." dir="rtl"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 resize-none" />
        )}
      </div>

      {/* Eco Impact */}
      {(f.estimatedWeightKg || f.estimatedCo2SavedKg) && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">🌍</span>
          <div>
            <p className="text-sm font-black text-green-800 mb-1">Your eco-impact:</p>
            {f.estimatedWeightKg && <p className="text-sm text-green-700"><span className="font-bold">{f.estimatedWeightKg} kg</span> kept out of landfill</p>}
            {f.estimatedCo2SavedKg && <p className="text-sm text-green-700"><span className="font-bold">{f.estimatedCo2SavedKg} kg</span> CO₂ saved</p>}
            {f.ecoImpactNote && <p className="text-xs text-green-600 italic mt-1">{f.ecoImpactNote}</p>}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full py-4 rounded-2xl font-black text-white text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        style={{ background: "#16A34A" }}
      >
        Next: Set Location & Delivery →
      </button>
    </div>
  );
}