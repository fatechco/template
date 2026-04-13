import { Link } from "react-router-dom";

const CONDITION_BADGES = {
  brand_new_excess: { label: "✨ Brand New", cls: "bg-teal-500 text-white" },
  open_box:         { label: "📦 Open Box",  cls: "bg-blue-500 text-white" },
  lightly_used:     { label: "👍 Lightly Used", cls: "bg-sky-500 text-white" },
  salvaged:         { label: "♻️ Salvaged",  cls: "bg-olive-600 text-white bg-[#6b7c3f]" },
};

function DiscountBadge({ pct }) {
  if (!pct) return null;
  if (pct >= 60) return <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">🔥 {Math.round(pct)}% OFF RETAIL</span>;
  if (pct >= 40) return <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">💚 {Math.round(pct)}% OFF</span>;
  return <span className="bg-gray-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{Math.round(pct)}% OFF</span>;
}

export default function SurplusItemCard({ item, featured = false }) {
  const condBadge = CONDITION_BADGES[item.condition] || CONDITION_BADGES.lightly_used;
  const isActive = item.status === "active";
  const isReserved = item.status === "reserved";
  const isSold = item.status === "sold";
  const hasEco = item.estimatedWeightKg > 0;
  const viewHigh = (item.viewCount || 0) > 10;

  const image = item.primaryImageUrl || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1558618047-f4e90f6b3b44?w=400&q=80";

  return (
    <Link
      to={`/kemetro/surplus/${item.id}`}
      className="block bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
      style={{
        borderLeft: "4px solid #16A34A",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image */}
      <div className="relative" style={{ height: 180 }}>
        <img src={image} alt={item.title} className="w-full h-full object-cover" />

        {/* Overlay badges */}
        <div className="absolute top-2 left-2">
          <DiscountBadge pct={item.discountPercent} />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${condBadge.cls}`}>{condBadge.label}</span>
        </div>
        {hasEco && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              🌍 {item.estimatedWeightKg} kg saved
            </span>
          </div>
        )}
        {isSold && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-black text-sm px-4 py-2 rounded-full">✅ Sold</span>
          </div>
        )}
        {isReserved && !isSold && (
          <div className="absolute inset-0 bg-yellow-900/30 flex items-center justify-center">
            <span className="bg-white text-yellow-700 font-black text-sm px-4 py-2 rounded-full">⏳ Reserved</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{item.title}</h3>

        <p className="text-xs text-gray-400">
          📍 {item.addressText || item.cityId || "Cairo"} &nbsp;·&nbsp; 📦 {item.quantityAvailable} {item.unit} available
        </p>

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-green-700">{Number(item.surplusPriceEGP || 0).toLocaleString()} EGP</span>
          {item.originalRetailPriceEGP && (
            <span className="text-xs text-gray-400 line-through">{Number(item.originalRetailPriceEGP).toLocaleString()} EGP retail</span>
          )}
        </div>

        {/* Scarcity */}
        {isActive && viewHigh && (
          <p className="text-[11px] text-orange-500 font-semibold">⚠️ High interest — reserve before it's gone</p>
        )}

        {/* Eco strip */}
        {(item.estimatedWeightKg || item.estimatedCo2SavedKg) && (
          <div className="rounded-lg px-2 py-1.5 text-[11px] text-green-700 font-semibold" style={{ background: "#F0FDF4" }}>
            🌍 {item.estimatedWeightKg ? `${item.estimatedWeightKg} kg` : ""}{item.estimatedCo2SavedKg ? ` · ${item.estimatedCo2SavedKg} kg CO₂ saved` : ""}
          </div>
        )}

        {/* CTA */}
        <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
          isActive
            ? "text-white hover:opacity-90"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`} style={isActive ? { background: "#16A34A" } : {}}>
          {isActive ? "🛒 Reserve via Escrow" : isReserved ? "⏳ Reserved" : "✅ Sold"}
        </button>
      </div>
    </Link>
  );
}