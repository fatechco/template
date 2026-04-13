import { Zap } from "lucide-react";
import KemeFracOptIn from "./KemeFracOptIn";
import SwapOptInSection from "@/components/swap/SwapOptInSection";
import AuctionOptIn from "./AuctionOptIn";

const MODULE_CONFIG = [
  {
    key: "auction",
    purposes: ["In Auction"],
    icon: "🔨",
    label: "KemedarBid™",
    color: "#DC2626",
    tagline: "Sell by Auction — Let buyers compete for your property",
  },
  {
    key: "frac",
    purposes: ["For Fractional Investment"],
    icon: "🏗️",
    label: "KemeFrac™",
    color: "#00C896",
    tagline: "Enable fractional ownership — Let investors buy shares",
  },
  {
    key: "swap",
    purposes: ["For Sale", "For Swap"],
    icon: "🔄",
    label: "Kemedar Swap™",
    color: "#7C3AED",
    tagline: "Trade without selling first — AI finds your perfect match",
  },
  {
    key: "twin",
    requiresImages: true,
    icon: "🎥",
    label: "Kemedar Twin™",
    color: "#0077B6",
    tagline: "Create a virtual tour for remote buyers and expats",
  },
  {
    key: "verify",
    alwaysShow: true,
    icon: "✅",
    label: "Verify Pro™",
    color: "#16A34A",
    tagline: "Get verified for maximum buyer trust and top search placement",
  },
  {
    key: "predict",
    purposes: ["For Sale", "For Fractional Investment", "In Auction"],
    icon: "📊",
    label: "Predict™",
    color: "#6366F1",
    tagline: "AI price forecast — Know your property's future value",
  },
];

function SuggestionBadge({ mod, isRecommended }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
      <span className="text-2xl flex-shrink-0">{mod.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black" style={{ color: mod.color }}>{mod.label}</span>
          {isRecommended && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">RECOMMENDED</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{mod.tagline}</p>
      </div>
      <Zap size={14} style={{ color: mod.color }} className="flex-shrink-0" />
    </div>
  );
}

export default function SmartModuleSuggestions({ form, updateForm }) {
  const purpose = form.purpose || "";
  const hasImages = !!(form.featured_image_url || (form.image_gallery_urls || []).length > 0);

  // Determine which modules to suggest
  const suggested = MODULE_CONFIG.filter(mod => {
    if (mod.alwaysShow) return true;
    if (mod.requiresImages && !hasImages) return false;
    if (mod.requiresImages && hasImages) return true;
    if (mod.purposes && mod.purposes.includes(purpose)) return true;
    return false;
  });

  // Determine which are "recommended" (exact purpose match)
  const recommendedKeys = MODULE_CONFIG
    .filter(mod => mod.purposes && mod.purposes.includes(purpose))
    .map(mod => mod.key);

  // Modules that have full opt-in forms
  const showAuction = purpose === "In Auction" || form.auctionData?.enabled;
  const showFrac = purpose === "For Fractional Investment" || form.fracEnabled;
  const showSwap = ["For Sale", "For Swap"].includes(purpose) || form.swapData?.enabled;

  // Link-only modules (Twin, Verify, Predict) — shown as post-submit actions
  const linkModules = suggested.filter(m => ["twin", "verify", "predict"].includes(m.key));

  return (
    <div className="space-y-4">
      {/* Smart Suggestions Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg flex-shrink-0">✨</div>
          <div>
            <p className="font-black text-gray-900">Smart Module Suggestions</p>
            <p className="text-xs text-gray-500">Based on your selection: <span className="font-bold text-purple-700">{purpose || "General"}</span></p>
          </div>
        </div>

        {/* Suggestion badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggested.map(mod => (
            <SuggestionBadge key={mod.key} mod={mod} isRecommended={recommendedKeys.includes(mod.key)} />
          ))}
        </div>

        {suggested.length === 0 && (
          <p className="text-sm text-gray-400 italic mt-2">No specific module suggestions for this purpose. You can still enable any module below.</p>
        )}
      </div>

      {/* Full opt-in forms for relevant modules */}
      {showAuction && (
        <AuctionOptIn
          auctionData={form.auctionData}
          onChange={(auctionData) => updateForm({ auctionData })}
        />
      )}

      {showFrac && (
        <KemeFracOptIn
          form={form}
          updateForm={updateForm}
          verificationLevel={form.verification_level || 1}
        />
      )}

      {showSwap && (
        <SwapOptInSection
          swapData={form.swapData}
          onChange={(swapData) => updateForm({ swapData })}
        />
      )}

      {/* Link-only modules shown as info cards */}
      {linkModules.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 text-sm mb-3">🚀 Available After Publishing</p>
          <p className="text-xs text-gray-500 mb-4">These modules will be available from your property dashboard after you publish:</p>
          <div className="space-y-2">
            {linkModules.map(mod => (
              <div key={mod.key} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <span className="text-xl">{mod.icon}</span>
                <div className="flex-1">
                  <span className="text-sm font-bold" style={{ color: mod.color }}>{mod.label}</span>
                  <p className="text-xs text-gray-500">{mod.tagline}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">After Publish</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Add More Modules" expandable for non-suggested modules */}
      {!showAuction && !showFrac && !showSwap && (
        <OtherModulesExpander form={form} updateForm={updateForm} showAuction showFrac showSwap />
      )}
      {showAuction && !showFrac && (
        <OtherModulesExpander form={form} updateForm={updateForm} showFrac showSwap={!showSwap} />
      )}
      {showFrac && !showAuction && (
        <OtherModulesExpander form={form} updateForm={updateForm} showAuction showSwap={!showSwap} />
      )}
    </div>
  );
}

function OtherModulesExpander({ form, updateForm, showAuction, showFrac, showSwap }) {
  const hasAny = showAuction || showFrac || showSwap;
  if (!hasAny) return null;

  return (
    <details className="bg-white rounded-2xl border border-dashed border-gray-200 overflow-hidden">
      <summary className="px-5 py-4 cursor-pointer text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
        ➕ Want to enable other modules? (click to expand)
      </summary>
      <div className="px-5 pb-5 space-y-4">
        {showAuction && (
          <AuctionOptIn
            auctionData={form.auctionData}
            onChange={(auctionData) => updateForm({ auctionData })}
          />
        )}
        {showFrac && (
          <KemeFracOptIn
            form={form}
            updateForm={updateForm}
            verificationLevel={form.verification_level || 1}
          />
        )}
        {showSwap && (
          <SwapOptInSection
            swapData={form.swapData}
            onChange={(swapData) => updateForm({ swapData })}
          />
        )}
      </div>
    </details>
  );
}