"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export default function SurplusStep3Logistics({ formData, setFormData, capturedImages, aiResult, onPublished }) {
  const [user, setUser] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const f = formData;
  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  useEffect(() => { apiClient.get("/api/auth/session").then(setUser).catch(() => {}); }, []);

  const deliveryPickup    = f.deliveryPickup !== false;
  const deliveryShipper   = !!f.deliveryShipper;
  const deliverySelf      = !!f.deliverySelf;

  const shippingEstimate = f.estimatedWeightKg ? Math.round(Number(f.estimatedWeightKg) * 15) : null;
  const isHeavy = f.estimatedWeightKg && Number(f.estimatedWeightKg) > 50;

  const getDeliveryOption = () => {
    if (deliverySelf) return "seller_delivers";
    if (deliveryShipper) return "shipper_network";
    return "pickup_only";
  };

  const handlePublish = async () => {
    setPublishing(true);
    const imageUrls = capturedImages;

    const payload = {
      sellerType: user?.role === "developer" ? "developer" : "homeowner",
      categoryId: f.category,
      title: f.title,
      titleAr: f.titleAr || "",
      description: f.description || "",
      descriptionAr: f.descriptionAr || "",
      condition: f.condition,
      conditionLabel: f.condition,
      quantityAvailable: Number(f.quantity) || 1,
      unit: f.unit || "pieces",
      surplusPriceEGP: Number(f.surplusPriceEGP),
      originalRetailPriceEGP: f.originalRetailPriceEGP ? Number(f.originalRetailPriceEGP) : null,
      images: imageUrls,
      cityId: f.cityId || null,
      districtId: f.districtId || null,
      addressText: f.addressText || null,
      latitude: f.latitude || null,
      longitude: f.longitude || null,
      deliveryOption: getDeliveryOption(),
      pickupInstructions: f.pickupInstructions || null,
      estimatedWeightKg: f.estimatedWeightKg ? Number(f.estimatedWeightKg) : null,
      estimatedCo2SavedKg: f.estimatedCo2SavedKg ? Number(f.estimatedCo2SavedKg) : null,
      ecoImpactNote: f.ecoImpactNote || null,
      aiMatchedProductId: f.aiMatchedProductId || null,
      aiMatchedProductName: f.aiMatchedProductName || null,
      aiMatchedProductRetailPriceEGP: f.aiMatchedProductRetailPriceEGP || null,
      aiSuggestedTitle: aiResult?.aiSuggestedTitle || null,
      aiSuggestedCategory: aiResult?.kemetroCategorySlug || null,
      aiConditionEstimate: aiResult?.conditionEstimate || null,
      aiEstimatedQuantity: aiResult?.estimatedQuantity || null,
      aiSuggestedUnit: aiResult?.suggestedUnit || null,
      aiSuggestedDiscountPercent: aiResult?.suggestedDiscountPercent || null,
      aiDescription: aiResult?.aiDescription || null,
      aiDescriptionAr: aiResult?.aiDescriptionAr || null,
      claudeModel: aiResult?.claudeModel || null,
      aiAnalyzedAt: aiResult?.aiAnalyzedAt || null,
    };

    const res = await apiClient.post("/api/v1/ai/publishSurplusItem", payload);
    setPublishing(false);
    if (res.data?.success) {
      onPublished(res.data.surplusItem);
    }
  };

  return (
    <div className="px-4 py-4 space-y-4 max-w-lg mx-auto pb-10">

      {/* Location */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-gray-900 text-base">📍 Pickup Location</h3>

        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-3 py-2.5">
          <span>✅ GPS detected</span>
          <span className="font-bold">{f.cityDisplay || "Your city"}</span>
          <button onClick={() => {}} className="ml-auto text-xs text-green-600 underline">Change</button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Approximate address (optional)</label>
          <input value={f.addressText || ""} onChange={e => set("addressText", e.target.value)}
            placeholder="Building/street hint (exact address shared only after reservation)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5">Pickup instructions (optional)</label>
          <input value={f.pickupInstructions || ""} onChange={e => set("pickupInstructions", e.target.value)}
            placeholder="e.g. Building entrance on side street, call on arrival"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
        </div>

        <p className="text-[11px] text-gray-400">🔒 Your exact address is never public. Only shared with reserved buyers.</p>
      </div>

      {/* Delivery Options */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h3 className="font-black text-gray-900 text-base">📦 How can buyers get these items?</h3>

        {[
          {
            key: "deliveryPickup",
            icon: "🤝",
            label: "Buyer picks up from my location",
            sub: "Most common — free for buyer, zero hassle for you",
            value: deliveryPickup,
            toggle: () => set("deliveryPickup", !deliveryPickup),
            extra: null,
          },
          {
            key: "deliveryShipper",
            icon: "🚛",
            label: "Allow Kemetro Shipper delivery",
            sub: "Buyer pays shipping — we assign a driver",
            value: deliveryShipper,
            toggle: () => set("deliveryShipper", !deliveryShipper),
            extra: deliveryShipper ? (
              <div className="mt-2 space-y-2">
                {shippingEstimate && (
                  <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                    Est. shipping cost: <span className="font-bold">{shippingEstimate} EGP</span> (shown to buyer at checkout)
                  </p>
                )}
                {isHeavy && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-orange-700">
                      ⚠️ Heavy item ({f.estimatedWeightKg} kg). Confirm this can fit in a standard pickup truck.
                    </p>
                  </div>
                )}
              </div>
            ) : null,
          },
          {
            key: "deliverySelf",
            icon: "🚗",
            label: "I will deliver to the buyer",
            sub: "You agree a delivery price with the buyer",
            value: deliverySelf,
            toggle: () => set("deliverySelf", !deliverySelf),
            extra: null,
          },
        ].map(opt => (
          <div key={opt.key} className="border border-gray-100 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                </div>
              </div>
              <button onClick={opt.toggle}
                className={`flex-shrink-0 w-12 h-6 rounded-full transition-all relative ${opt.value ? "bg-green-500" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${opt.value ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            {opt.extra}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-gray-900 text-base">📋 Listing Summary</h3>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          {capturedImages[0] && <img src={capturedImages[0]} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{f.title || "Unnamed item"}</p>
            <p className="text-xs text-gray-500">{f.cityDisplay || ""}</p>
          </div>
          <p className="font-black text-green-700 text-sm flex-shrink-0">{f.surplusPriceEGP ? `${Number(f.surplusPriceEGP).toLocaleString()} EGP` : ""}</p>
        </div>

        {f.estimatedWeightKg && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-3 py-2.5">
            <span>🌍</span>
            <span className="font-bold">{f.estimatedWeightKg} kg</span>
            <span>saved from landfill</span>
          </div>
        )}

        <button
          onClick={handlePublish}
          disabled={publishing}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
          style={{ background: "#16A34A", fontSize: 17 }}
        >
          {publishing ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Publishing...</>
          ) : "🚀 Publish to Surplus Market"}
        </button>
      </div>
    </div>
  );
}