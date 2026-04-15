// @ts-nocheck
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import VerifyProBadge from "@/components/verify/VerifyProBadge";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

function WatchlistCard({ item, onRemove, onToggle }) {
  const o = item.offering || {};
  const pct = o.tokensForSale > 0 ? Math.round((o.tokensSold / o.tokensForSale) * 100) : 0;
  const isSoldOut = o.status === "sold_out" || pct >= 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative">
        <img src={o.image} alt={o.offeringTitle} className="w-full h-40 object-cover" />
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: "#0A1628", color: "#00C896" }}>
          KemeFrac™
        </span>
        {isSoldOut && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">SOLD OUT</span>
        )}
        <button onClick={() => onRemove(item.id)}
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-black bg-white/90 text-red-500 hover:bg-red-50 transition-colors shadow-sm">
          ✕ Remove
        </button>
      </div>

      <div className="p-4">
        <p className="font-black text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{o.offeringTitle}</p>
        <p className="text-xs text-gray-400 mb-3">📍 {o.city}, {o.district}</p>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <p className="text-gray-400">Token Price</p>
            <p className="font-black text-gray-900">{fmt(o.tokenPriceEGP)} EGP</p>
          </div>
          <div>
            <p className="text-gray-400">Yield</p>
            <p className="font-black" style={{ color: o.expectedAnnualYieldPercent ? "#00C896" : "#9ca3af" }}>
              {o.expectedAnnualYieldPercent ? `${o.expectedAnnualYieldPercent}%/yr` : "—"}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: isSoldOut ? "#ef4444" : "#00C896" }} />
        </div>
        <p className="text-[10px] text-right mb-3" style={{ color: isSoldOut ? "#ef4444" : "#00C896" }}>{pct}% funded</p>

        <VerifyProBadge level={o.verificationLevel} size="sm" />

        {/* Notification toggles */}
        <div className="mt-3 space-y-1.5 border-t border-gray-50 pt-3">
          {[
            { key: "notifyOnPriceDrop", label: "Notify on price drop" },
            { key: "notifyOnAvailability", label: "Notify on availability" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"
                checked={!!item[key]}
                onChange={(e) => onToggle(item.id, key, e.target.checked)}
                className="accent-[#00C896] w-3.5 h-3.5" />
              <span className="text-xs text-gray-600">{label}</span>
            </label>
          ))}
        </div>

        <Link href={`/kemefrac/${o.id}`}
          className="mt-3 block w-full text-center py-2 rounded-xl text-xs font-black transition-all hover:opacity-90"
          style={{ background: isSoldOut ? "#f3f4f6" : "#00C896", color: isSoldOut ? "#9ca3af" : "#0A1628" }}>
          {isSoldOut ? "View Details" : "View Offering →"}
        </Link>
      </div>
    </div>
  );
}

export default function TabWatchlist({ watchlist, setWatchlist }) {
  const handleRemove = async (id) => {
    setWatchlist(w => w.filter(item => item.id !== id));
    await apiClient.delete("/api/v1/fracwatchlist/"+id).catch(() => {});
  };

  const handleToggle = async (id, key, val) => {
    setWatchlist(w => w.map(item => item.id === id ? { ...item, [key]: val } : item));
    await apiClient.put("/api/v1/fracwatchlist/", id, { [key]: val }).catch(() => {});
  };

  if (!watchlist || watchlist.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <p className="text-4xl mb-3">🔖</p>
        <p className="font-black text-gray-700">Your watchlist is empty</p>
        <p className="text-gray-400 text-sm mt-1">Add offerings to track them and get notified</p>
        <Link href="/kemefrac" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm mt-5"
          style={{ background: "#00C896", color: "#0A1628" }}>
          Browse Offerings →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {watchlist.map(item => (
        <WatchlistCard key={item.id} item={item} onRemove={handleRemove} onToggle={handleToggle} />
      ))}
    </div>
  );
}