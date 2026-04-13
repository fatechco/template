import { Link } from "react-router-dom";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

function timeAgo(isoStr) {
  if (!isoStr) return "—";
  const diff = Date.now() - new Date(isoStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function HoldingCard({ holding }) {
  const annualReturn = holding.expectedAnnualYieldPercent
    ? (holding.totalInvestedEGP * holding.expectedAnnualYieldPercent) / 100 : null;
  const monthlyReturn = annualReturn ? annualReturn / 12 : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Top row */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-50">
        <img src={holding.image} alt={holding.offeringTitle}
          className="w-20 h-16 object-cover rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm leading-snug truncate">{holding.offeringTitle}</p>
          <p className="text-xs text-gray-400 mt-0.5">📍 {holding.city}, {holding.district}</p>
          <code className="text-xs font-mono font-black mt-1 block" style={{ color: "#00C896" }}>{holding.tokenSymbol}</code>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 flex-shrink-0">
          {holding.offeringType === "fractional_investment" ? "💰 Yield" : "🏢 Sale"}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-50 border-b border-gray-50">
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Tokens held</p>
          <p className="text-2xl font-black text-gray-900">{holding.tokensHeld}</p>
          <p className="text-xs text-gray-400 mt-0.5">{holding.tokensHeldPercent?.toFixed(2)}% ownership</p>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-1">Invested</p>
          <p className="text-xl font-black text-gray-900">{fmt(holding.totalInvestedEGP)} EGP</p>
          <p className="text-xs text-gray-400 mt-0.5">@ {fmt(holding.averagePurchasePriceEGP)} EGP / token</p>
        </div>
      </div>

      {/* Yield strip */}
      {annualReturn && (
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#F59E0B0F", borderBottom: "1px solid #F59E0B20" }}>
          <span className="text-xs font-bold text-gray-600">Expected annual return:</span>
          <div className="text-right">
            <span className="font-black text-sm" style={{ color: "#F59E0B" }}>{fmt(annualReturn)} EGP</span>
            <span className="text-xs text-gray-400 ml-2">= {fmt(monthlyReturn)} EGP/mo</span>
          </div>
        </div>
      )}

      {/* Blockchain row */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 flex-wrap gap-2">
        <div>
          <p className="text-xs text-gray-500">
            🔗 On-chain balance: <span className="font-black text-gray-800">{holding.nearTokenBalance ?? "—"} tokens</span>
          </p>
          <p className="text-[10px] text-gray-400">Last synced: {timeAgo(holding.nearLastSyncedAt)}</p>
        </div>
        {holding.nearExplorerUrl && (
          <a href={holding.nearExplorerUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold hover:underline" style={{ color: "#00C896" }}>
            View on Explorer →
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-3">
        <Link to={`/kemefrac/${holding.fracSlug || holding.fracPropertyId}`}
          className="flex-1 text-center py-2 rounded-xl text-xs font-black border-2 transition-all hover:bg-[#00C896] hover:text-[#0A1628]"
          style={{ borderColor: "#00C896", color: "#00C896" }}>
          View Offering →
        </Link>
        <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
          View Transactions →
        </button>
      </div>
    </div>
  );
}

export default function TabHoldings({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <p className="text-5xl mb-4">🏗️</p>
        <p className="font-black text-gray-800 text-xl mb-2">No KemeFrac™ tokens yet</p>
        <p className="text-gray-400 text-sm mb-6">Start investing in fractional Egyptian real estate</p>
        <Link to="/kemefrac"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm"
          style={{ background: "#00C896", color: "#0A1628" }}>
          Browse Offerings →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {holdings.map((h) => <HoldingCard key={h.id} holding={h} />)}
    </div>
  );
}