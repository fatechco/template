import { Link } from "react-router-dom";
const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function ClearanceDealCard({ deal }) {
  const stockPct = deal.totalStockAvailable > 0 ? (deal.stockRemaining / deal.totalStockAvailable) * 100 : 100;
  return (
    <div className="bg-white rounded-2xl border-t-4 border-purple-500 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img src={deal.productImages?.[0] || "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"} alt={deal.productName} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2">
          <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">📦 CLEARANCE</span>
        </div>
        <div className="absolute top-2 right-2 w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center">
          <span className="text-white font-black text-xs text-center">-{deal.discountPercent}%</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-purple-900/80 px-3 py-1.5">
          <p className="text-purple-200 text-xs font-black">{fmt(deal.stockRemaining)} {deal.unit} available</p>
        </div>
      </div>
      <div className="p-4">
        <span className="text-[10px] font-bold text-purple-600 uppercase">{deal.category}</span>
        <h3 className="font-black text-gray-900 text-sm mt-0.5 line-clamp-2">{deal.productName}</h3>
        {deal.specifications && <p className="text-gray-400 text-[11px] mt-0.5">{Object.values(deal.specifications).slice(0, 2).join(" | ")}</p>}
        <div className="mt-2 flex items-end gap-2">
          <span className="text-2xl font-black text-purple-700">{fmt(deal.dealPrice)}</span>
          <div>
            <p className="text-gray-400 text-xs line-through">{fmt(deal.originalPrice)} EGP</p>
            <p className="text-[10px] text-gray-500">per {deal.unit}</p>
          </div>
        </div>
        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1.5 text-xs text-orange-700">
          ⚠️ Seller clearing warehouse space — all sales final
        </div>
        <p className="text-xs font-bold text-gray-600 mt-2">Min. order: {deal.minimumOrderQty} {deal.unit}</p>
        <Link to={`/kemetro/flash/deal/${deal.id}`} className="mt-3 block w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-2.5 rounded-xl text-center text-sm transition-colors">
          📦 View Clearance Deal
        </Link>
      </div>
    </div>
  );
}