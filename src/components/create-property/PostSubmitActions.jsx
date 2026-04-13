import { Eye, Plus, ArrowRight } from "lucide-react";

const POST_SUBMIT_MODULES = [
  {
    key: "twin",
    icon: "🎥",
    label: "Create Virtual Tour",
    desc: "Set up Kemedar Twin™ for this property",
    color: "#0077B6",
    bg: "#E0F2FE",
    getUrl: (id) => `/kemedar/twin/${id}`,
    condition: (form) => !!(form.featured_image_url || (form.image_gallery_urls || []).length),
  },
  {
    key: "verify",
    icon: "✅",
    label: "Start Verification",
    desc: "Get Verify Pro™ badge for buyer trust",
    color: "#16A34A",
    bg: "#DCFCE7",
    getUrl: (id) => `/verify/my-property/${id}`,
    condition: () => true,
  },
  {
    key: "predict",
    icon: "📊",
    label: "See Price Forecast",
    desc: "Get AI predictions for this area",
    color: "#6366F1",
    bg: "#EEF2FF",
    getUrl: () => `/kemedar/predict`,
    condition: (form) => ["For Sale", "For Fractional Investment", "In Auction"].includes(form.purpose),
  },
  {
    key: "life-score",
    icon: "🌍",
    label: "Check Life Score",
    desc: "Neighborhood quality report for buyers",
    color: "#D97706",
    bg: "#FEF3C7",
    getUrl: () => `/kemedar/life-score`,
    condition: (form) => !!form.city_id,
  },
  {
    key: "coach",
    icon: "🎯",
    label: "Get Selling Tips",
    desc: "AI Coach for selling strategy",
    color: "#EC4899",
    bg: "#FCE7F3",
    getUrl: () => `/kemedar/coach`,
    condition: () => true,
  },
];

export default function PostSubmitActions({ propertyId, form, auctionSubmitted, fracSubmitted, swapSubmitted, auctionCode, auctionDeposit, propertyCode, onAddAnother }) {
  const availableModules = POST_SUBMIT_MODULES.filter(m => m.condition(form));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Property Published Successfully!</h2>
        <p className="text-gray-500 text-sm">Your listing is being reviewed and will be live shortly.</p>
        {propertyCode && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mt-4 inline-block">
            <p className="text-xs text-gray-500 mb-0.5">Property Reference Code</p>
            <p className="font-black text-[#FF6B00] text-lg tracking-widest">{propertyCode}</p>
          </div>
        )}
      </div>

      {/* Module activation confirmations */}
      <div className="space-y-3 mb-6">
        {auctionSubmitted && (
          <div className="rounded-xl p-4 text-left" style={{ background: "#FFF1F2", border: "1.5px solid #DC2626" }}>
            <p className="font-black text-sm mb-1 text-red-700">🔨 KemedarBid™ Auction Submitted</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {auctionCode && <><strong>{auctionCode}</strong> — </>}
              Review takes 24–48h. Seller deposit: <strong>{Number(auctionDeposit).toLocaleString()} EGP</strong> after approval.
            </p>
          </div>
        )}
        {fracSubmitted && (
          <div className="rounded-xl p-4 text-left" style={{ background: "#00C89612", border: "1.5px solid #00C896" }}>
            <p className="font-black text-sm mb-1" style={{ color: "#0A1628" }}>🏗️ KemeFrac™ Offering Submitted</p>
            <p className="text-xs text-gray-600">Fractional offering submitted for admin review. Notification in 2–3 business days.</p>
          </div>
        )}
        {swapSubmitted && (
          <div className="rounded-xl p-4 text-left" style={{ background: "#F5F3FF", border: "1.5px solid #7C3AED" }}>
            <p className="font-black text-sm mb-1 text-purple-800">🔄 Kemedar Swap™ Intent Active</p>
            <p className="text-xs text-gray-600">Your swap intent is in the pool. We'll notify you when we find a match.</p>
          </div>
        )}
      </div>

      {/* Next Steps — Module shortcuts */}
      {availableModules.length > 0 && (
        <div className="mb-6">
          <p className="font-black text-gray-900 text-sm mb-3">🚀 Enhance Your Listing</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableModules.map(mod => (
              <a
                key={mod.key}
                href={mod.getUrl(propertyId)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group"
                style={{ background: mod.bg }}
              >
                <span className="text-2xl">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: mod.color }}>{mod.label}</p>
                  <p className="text-[11px] text-gray-500">{mod.desc}</p>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Primary actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={propertyId ? `/property/${propertyId}` : "/search-properties"}
          className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md text-sm">
          <Eye size={15} /> View Your Listing
        </a>
        <button onClick={onAddAnother}
          className="flex items-center justify-center gap-2 border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
          <Plus size={15} /> Add Another Property
        </button>
      </div>
    </div>
  );
}