import { useState } from "react";
import { ChevronDown } from "lucide-react";

const NEAR_BADGE = (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black"
    style={{ background: "#0A1628", color: "#00C896" }}>
    <span className="w-2 h-2 rounded-full bg-[#00C896] inline-block" />
    NEAR Protocol
  </span>
);

function OfferingTypeCard({ value, icon, title, sub, selected, onClick }) {
  return (
    <button type="button" onClick={() => onClick(value)}
      className="flex-1 text-left p-4 rounded-2xl border-2 transition-all"
      style={{ borderColor: selected ? "#00C896" : "#e5e7eb", background: selected ? "#00C89608" : "white" }}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-black text-gray-900 text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{sub}</p>
      {selected && (
        <div className="mt-2 flex items-center gap-1 text-[10px] font-black" style={{ color: "#00C896" }}>
          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00C896] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
          </span>
          Selected
        </div>
      )}
    </button>
  );
}

function InfoBox({ icon, text, bg, warning }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl text-sm" style={{ background: bg }}>
      <span className="text-xl flex-shrink-0">{icon}</span>
      <p className={`leading-relaxed text-sm ${warning ? "text-red-700 font-bold" : "text-gray-700"}`}>{text}</p>
    </div>
  );
}

export default function KemeFracOptIn({ form, updateForm, verificationLevel = 1 }) {
  const enabled = form.fracEnabled || false;
  const offeringType = form.fracOfferingType || "";

  const set = (fields) => updateForm(fields);

  const previewReady = offeringType && form.fracMinTokens;
  const yieldLabel = form.fracYieldFrequency
    ? { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" }[form.fracYieldFrequency]
    : "";

  return (
    <div className="mt-8"
      style={{ borderLeft: "4px solid #0A1628", borderRadius: 16, background: "#00C89606", padding: 0, overflow: "hidden" }}>

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-5 pb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
            style={{ background: "#0A1628" }}>
            🏗️
          </div>
          <div>
            <p className="font-black text-base" style={{ color: "#0A1628" }}>
              KemeFrac™ — Offer Fractional Ownership
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Let investors buy fractions of your property and earn returns.
              Powered by NEAR blockchain.
            </p>
          </div>
        </div>
        {NEAR_BADGE}
      </div>

      {/* TOGGLE CARD */}
      <div className="mx-5 mb-4">
        <button type="button"
          onClick={() => set({ fracEnabled: !enabled })}
          className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all bg-white"
          style={{ borderColor: enabled ? "#00C896" : "#e5e7eb" }}>
          {/* Toggle knob */}
          <div className="relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200"
            style={{ background: enabled ? "#00C896" : "#d1d5db" }}>
            <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
              style={{ transform: enabled ? "translateX(24px)" : "translateX(2px)" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-black text-gray-900 text-sm">Enable KemeFrac™ for this property</p>
            <p className="text-xs text-gray-500 mt-0.5">Investors can purchase fractional ownership tokens</p>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${enabled ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* EXPANDED FIELDS */}
      {enabled && (
        <div className="px-5 pb-5 space-y-5" style={{ animation: "fadeInDown 0.2s ease" }}>

          {/* GROUP 1: Offering Type */}
          <div>
            <p className="text-sm font-black text-gray-800 mb-3">What are you offering?</p>
            <div className="flex gap-3">
              <OfferingTypeCard
                value="fractional_sale"
                icon="📈"
                title="Fractional Sale"
                sub="Investors buy a % of property ownership. Share profits if property sells."
                selected={offeringType === "fractional_sale"}
                onClick={v => set({ fracOfferingType: v })}
              />
              <OfferingTypeCard
                value="fractional_investment"
                icon="💰"
                title="Investment & Yield"
                sub="Investors earn regular rental income proportional to their token holdings."
                selected={offeringType === "fractional_investment"}
                onClick={v => set({ fracOfferingType: v })}
              />
            </div>
          </div>

          {/* GROUP 2: Investment Details */}
          {offeringType && (
            <div className="space-y-4">
              <p className="text-sm font-black text-gray-800">Investment Details</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Min tokens per investor
                  </label>
                  <input type="number" min={1}
                    value={form.fracMinTokens || 1}
                    onChange={e => set({ fracMinTokens: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]" />
                  <p className="text-[10px] text-gray-400 mt-1">e.g. 10 = must buy at least 10 tokens</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Max tokens per investor <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input type="number" min={1}
                    value={form.fracMaxTokens || ""}
                    onChange={e => set({ fracMaxTokens: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="No limit"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]" />
                  <p className="text-[10px] text-gray-400 mt-1">Prevents one investor buying everything</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Offering start date</label>
                  <input type="date"
                    value={form.fracStartDate || new Date().toISOString().split("T")[0]}
                    onChange={e => set({ fracStartDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Offering end date <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input type="date"
                    value={form.fracEndDate || ""}
                    onChange={e => set({ fracEndDate: e.target.value || null })}
                    placeholder="Open-ended"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]" />
                </div>
              </div>
            </div>
          )}

          {/* GROUP 3: Yield Details */}
          {offeringType === "fractional_investment" && (
            <div className="space-y-4">
              <p className="text-sm font-black text-gray-800">Yield Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Expected annual yield (%)</label>
                  <div className="relative">
                    <input type="number" step="0.1" min={0} max={100}
                      value={form.fracYieldPercent || ""}
                      onChange={e => set({ fracYieldPercent: parseFloat(e.target.value) || null })}
                      placeholder="e.g. 8.5"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896]" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Based on estimated rental income</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Yield payment frequency</label>
                  <select
                    value={form.fracYieldFrequency || ""}
                    onChange={e => set({ fracYieldFrequency: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896] bg-white">
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* GROUP 4: Description */}
          {offeringType && (
            <div className="space-y-3">
              <p className="text-sm font-black text-gray-800">Description for Investors</p>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Investment description (English)</label>
                <textarea
                  value={form.fracDescription || ""}
                  onChange={e => set({ fracDescription: e.target.value.slice(0, 1000) })}
                  rows={4}
                  placeholder="Describe the investment opportunity, location advantages, tenant history, expected returns..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896] resize-none" />
                <p className="text-[10px] text-gray-400 mt-1 text-right">{(form.fracDescription || "").length}/1000</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">وصف الاستثمار (عربي)</label>
                <textarea
                  value={form.fracDescriptionAr || ""}
                  onChange={e => set({ fracDescriptionAr: e.target.value.slice(0, 1000) })}
                  rows={3}
                  dir="rtl"
                  placeholder="اكتب وصف الفرصة الاستثمارية بالعربي..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C896]/30 focus:border-[#00C896] resize-none text-right" />
              </div>
            </div>
          )}

          {/* INFO BOXES */}
          <div className="space-y-2.5">
            <InfoBox
              icon="ℹ️"
              bg="#00C89612"
              text="Your property valuation and token price will be set by Kemedar admin after review. You will be notified and can approve before going live."
            />
            <InfoBox
              icon="⚡"
              bg="#F59E0B12"
              text="Important: Your property must have Kemedar Verify Pro™ Level 3 or above to be listed as a KemeFrac™ offering."
            />
            {verificationLevel < 3 && (
              <InfoBox
                icon="⚠️"
                bg="#fee2e2"
                warning
                text={`Your property is currently Level ${verificationLevel}. You can still submit, but the offering will not go live until Level 3 is reached.`}
              />
            )}
            <InfoBox
              icon="🔗"
              bg="#0A162808"
              text="Tokens are deployed on NEAR Protocol blockchain. Investors do not need a crypto wallet — they can use a Kemedar custodial account."
            />
          </div>

          {/* TOKENIZATION PREVIEW */}
          {previewReady && (
            <div className="rounded-2xl border-2 p-4" style={{ borderColor: "#00C896", background: "#0A162808", animation: "fadeInDown 0.2s ease" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🔐</span>
                <p className="font-black text-sm" style={{ color: "#0A1628" }}>Your KemeFrac™ Token Preview</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Token Symbol</span>
                  <span className="font-black text-gray-400 italic">KMF-XX-XXX (assigned by admin)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Blockchain</span>
                  <span className="font-black" style={{ color: "#00C896" }}>NEAR Protocol</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Offering Type</span>
                  <span className="font-black text-gray-800 capitalize">{offeringType.replace("_", " ")}</span>
                </div>
                {offeringType === "fractional_investment" && form.fracYieldPercent && (
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Yield</span>
                    <span className="font-black" style={{ color: "#F59E0B" }}>
                      {form.fracYieldPercent}% annual {yieldLabel && `· ${yieldLabel}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Min purchase</span>
                  <span className="font-black text-gray-800">{form.fracMinTokens || 1} tokens</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Token price</span>
                  <span className="text-gray-400 italic text-[10px] font-bold">Set by admin review</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}