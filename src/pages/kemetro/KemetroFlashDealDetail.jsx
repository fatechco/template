import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import FlashCountdown from "@/components/kemetro/flash/FlashCountdown";
import FlashOrderSheet from "@/components/kemetro/flash/FlashOrderSheet";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const SOCIAL_PROOF = [
  "Ahmed from New Cairo ordered 80 m²",
  "Sara from Maadi saved 3,200 EGP",
  "Company ABC ordered 200 m² — bulk deal",
  "Mohamed from 6th October joined group buy",
  "Nour from Sheikh Zayed saved 4,800 EGP",
  "Group buy in Silver Compound reached 22 units",
];

const MOCK_DEAL = {
  id: "fd1", dealType: "flash_sale", productName: "60×60 Porcelain Floor Tiles — Matte Grey Grade A",
  productNameAr: "بلاط أرضي بورسلان 60×60 رمادي مط درجة أ", category: "flooring",
  originalPrice: 285, dealPrice: 185, discountPercent: 35,
  unit: "m²", stockRemaining: 320, totalStockAvailable: 1000, minimumOrderQty: 10,
  dealEndsAt: new Date(Date.now() + 11 * 3600000).toISOString(),
  productImages: [
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  ],
  specifications: { brand: "Cleopatra", grade: "Grade A", dimensions: "60×60cm", thickness: "8.5mm", finish: "Matte", origin: "Egypt" },
  productDescription: "Premium Grade A rectified porcelain floor tiles with a sophisticated matte grey finish. Perfect for living rooms, bedrooms, and commercial spaces. Excellent slip resistance and durability.",
  sellerName: "Cairo Tiles Direct", sellerRating: 4.8, totalOrders: 847,
  deliveryLeadDays: 3, deliveryOption: "seller_delivers", freeDeliveryThreshold: 10000,
  minimumOrderQty: 10, maximumOrderQtyPerBuyer: 500,
  hasTieredPricing: true, priceTiers: [
    { minQty: 10, maxQty: 50, pricePerUnit: 185, discountPercent: 35 },
    { minQty: 51, maxQty: 150, pricePerUnit: 170, discountPercent: 40 },
    { minQty: 151, maxQty: null, pricePerUnit: 155, discountPercent: 46 },
  ],
  status: "active", availableNationwide: true, isBestSeller: true,
};

const RELATED = [
  { id: "r1", productName: "Tile Adhesive C2 25kg", dealPrice: 95, originalPrice: 165, discountPercent: 42, category: "adhesives", dealEndsAt: new Date(Date.now() + 36 * 3600000).toISOString(), productImages: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80"] },
  { id: "r2", productName: "Tile Grout White 5kg", dealPrice: 55, originalPrice: 90, discountPercent: 39, category: "grouting", dealEndsAt: new Date(Date.now() + 24 * 3600000).toISOString(), productImages: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80"] },
];

export default function KemetroFlashDealDetail() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(10);
  const [saved, setSaved] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [proofIdx, setProofIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setProofIdx(i => (i + 1) % SOCIAL_PROOF.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    base44.entities.FlashDeal.filter({ id: dealId })
      .then(data => { setDeal(data[0] || MOCK_DEAL); setQty(data[0]?.minimumOrderQty || 10); })
      .catch(() => setDeal(MOCK_DEAL))
      .finally(() => setLoading(false));
  }, [dealId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!deal) return <div className="p-8 text-center text-gray-400">Deal not found</div>;

  const stockPct = (deal.stockRemaining / deal.totalStockAvailable) * 100;
  const activeTier = deal.hasTieredPricing ? (deal.priceTiers?.findLast(t => qty >= t.minQty) || deal.priceTiers?.[0]) : null;
  const unitPrice = activeTier ? activeTier.pricePerUnit : deal.dealPrice;
  const subtotal = unitPrice * qty;
  const delivery = subtotal >= (deal.freeDeliveryThreshold || 10000) ? 0 : 500;
  const total = subtotal + delivery;
  const savings = (deal.originalPrice - unitPrice) * qty;
  const endsHrs = (new Date(deal.dealEndsAt) - Date.now()) / 3600000;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
          <Link to="/kemetro/flash" className="text-gray-400 hover:text-orange-500 text-lg">‹</Link>
          <p className="flex-1 font-bold text-gray-900 text-sm truncate">{deal.productName}</p>
          <span className={`text-xs font-black px-2 py-1 rounded-full text-white ${endsHrs < 2 ? "bg-red-500 animate-pulse" : endsHrs < 12 ? "bg-orange-500" : "bg-green-500"}`}>
            <FlashCountdown endsAt={deal.dealEndsAt} small />
          </span>
          <span className="bg-red-600 text-white text-xs font-black px-2 py-1 rounded-full">-{deal.discountPercent}%</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT — Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gray-100" style={{ height: 400 }}>
              <img src={deal.productImages?.[activeImg]} alt={deal.productName} className="w-full h-full object-cover" />
              {/* Live stats overlay */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs space-y-0.5">
                <p>👀 {Math.round(Math.random() * 20 + 5)} viewing now</p>
                <p>🛒 {deal.totalOrders} ordered this deal</p>
              </div>
            </div>
            {/* Thumbnails */}
            {deal.productImages?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {deal.productImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-orange-500" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Social proof ticker */}
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 overflow-hidden">
              <p className="text-xs text-orange-500 font-bold mb-1">📡 Real-time Activity</p>
              <p key={proofIdx} className="text-sm text-gray-700 font-semibold animate-pulse">{SOCIAL_PROOF[proofIdx]}</p>
            </div>

            {/* Seller */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600 text-lg">K</div>
                <div>
                  <p className="font-black text-gray-900">{deal.sellerName}</p>
                  <p className="text-sm text-yellow-500">⭐ {deal.sellerRating} · {deal.totalOrders} Flash orders</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/kemetro/seller/${deal.sellerId}`} className="flex-1 text-center text-sm border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors">Visit Store</Link>
                <button className="flex-1 text-sm bg-orange-50 text-orange-600 font-bold py-2 rounded-xl hover:bg-orange-100 transition-colors">Message Seller</button>
              </div>
            </div>
          </div>

          {/* RIGHT — Deal info */}
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase bg-teal-50 px-2 py-1 rounded-full">{deal.category}</span>
            <h1 className="text-2xl font-black text-gray-900 mt-2 leading-tight">{deal.productName}</h1>
            {deal.specifications && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(deal.specifications).map(([k, v]) => (
                  <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{v}</span>
                ))}
              </div>
            )}

            {/* Price card */}
            <div className="mt-4 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-5">
              <p className="text-red-200 text-sm mb-1">⚡ Flash Price:</p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-white">{fmt(unitPrice)}</p>
                <div>
                  <p className="text-red-200 line-through text-sm">Original: {fmt(deal.originalPrice)} EGP</p>
                  <p className="text-red-200 text-sm">per {deal.unit}</p>
                </div>
              </div>
              <p className="text-yellow-300 font-bold text-sm mt-1">You save: {fmt(deal.originalPrice - unitPrice)} EGP / {deal.unit} ({deal.discountPercent}%)</p>
              <div className="mt-3">
                <p className="text-red-200 text-xs mb-1">Ends in:</p>
                <FlashCountdown endsAt={deal.dealEndsAt} large />
              </div>
              {/* Stock bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-red-200 mb-1">
                  <span>{fmt(deal.stockRemaining)} {deal.unit} remaining</span>
                  <span>{Math.round(stockPct)}%</span>
                </div>
                <div className="h-2 bg-red-900 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${stockPct < 20 ? "animate-pulse bg-red-300" : "bg-red-300"}`} style={{ width: `${stockPct}%` }} />
                </div>
                {stockPct < 20 && <p className="text-yellow-300 text-xs font-black mt-1 animate-pulse">⚠️ Only {deal.stockRemaining} {deal.unit} remaining!</p>}
              </div>
            </div>

            {/* Quantity + Order */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Min: {deal.minimumOrderQty} {deal.unit}</p>
                  {deal.maximumOrderQtyPerBuyer && <p className="text-xs text-gray-400">Max: {deal.maximumOrderQtyPerBuyer} {deal.unit} per buyer</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(deal.minimumOrderQty, q - 5))} className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl font-black">−</button>
                  <span className="px-6 py-3 font-black text-xl text-gray-900">{qty}</span>
                  <button onClick={() => setQty(q => q + 5)} className="px-4 py-3 text-gray-600 hover:bg-gray-100 text-xl font-black">+</button>
                </div>
                <span className="text-gray-500 font-bold">{deal.unit}</span>
              </div>

              {/* Price calculator */}
              <div className="bg-orange-50 rounded-xl p-3 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-bold">{fmt(subtotal)} EGP</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Delivery:</span><span className="font-bold">{delivery === 0 ? "FREE" : fmt(delivery) + " EGP"}</span></div>
                <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between"><span className="font-black text-gray-900">Total:</span><span className="font-black text-orange-600 text-xl">{fmt(total)} EGP</span></div>
                <p className="text-green-600 text-xs font-bold mt-1">💚 You save: {fmt(savings)} EGP</p>
              </div>

              {/* Tiered pricing */}
              {deal.hasTieredPricing && deal.priceTiers && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">Buy more, save more:</p>
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50"><tr>{["Quantity", "Price", "Discount"].map(h => <th key={h} className="px-2 py-1 text-left text-gray-500 font-bold">{h}</th>)}</tr></thead>
                    <tbody>
                      {deal.priceTiers.map((tier, i) => (
                        <tr key={i} className={`border-t border-gray-50 ${activeTier === tier ? "bg-orange-50 font-bold" : ""}`}>
                          <td className="px-2 py-1">{tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : "+"} {deal.unit} {activeTier === tier && "← YOU"}</td>
                          <td className="px-2 py-1 font-black text-orange-600">{fmt(tier.pricePerUnit)} EGP</td>
                          <td className="px-2 py-1 text-green-600">-{tier.discountPercent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button onClick={() => setShowOrder(true)} className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-xl text-lg transition-colors mb-2">
                ⚡ Order Now
              </button>
              <p className="text-xs text-gray-400 text-center">Payment on delivery | Cancel within 2 hours</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setSaved(s => !s)} className={`flex-1 flex items-center justify-center gap-1 text-sm border font-bold py-2 rounded-xl transition-colors ${saved ? "border-red-300 bg-red-50 text-red-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  <Heart size={14} className={saved ? "fill-red-500" : ""} /> {saved ? "Saved" : "Save"}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 text-sm border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 text-sm border border-orange-300 text-orange-600 font-bold py-2 rounded-xl hover:bg-orange-50">
                  <ShoppingCart size={14} /> Cart
                </button>
              </div>
            </div>

            {/* Product details accordion */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {[
                { label: "Product Description", content: deal.productDescription },
                { label: "Delivery Info", content: `Delivery lead time: ${deal.deliveryLeadDays}-${deal.deliveryLeadDays + 2} business days. Free delivery on orders above ${fmt(deal.freeDeliveryThreshold || 10000)} EGP.` },
              ].map((item, i) => (
                <details key={i} className="border-b border-gray-100 last:border-0">
                  <summary className="px-4 py-3 font-bold text-gray-900 cursor-pointer hover:bg-gray-50 text-sm">{item.label}</summary>
                  <p className="px-4 pb-3 text-sm text-gray-600 leading-relaxed">{item.content}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Related deals */}
        {RELATED.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-black text-gray-900 mb-4">More deals you might need:</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {RELATED.map(r => (
                <Link key={r.id} to={`/kemetro/flash/deal/${r.id}`} className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="h-32 overflow-hidden"><img src={r.productImages[0]} alt={r.productName} className="w-full h-full object-cover" /></div>
                  <div className="p-3">
                    <p className="font-black text-gray-900 text-sm">{r.productName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-red-600 font-black">{fmt(r.dealPrice)} EGP</span>
                      <span className="text-gray-400 text-xs line-through">{fmt(r.originalPrice)}</span>
                      <span className="ml-auto text-xs bg-red-100 text-red-600 font-black px-1.5 py-0.5 rounded-full">-{r.discountPercent}%</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-1"><FlashCountdown endsAt={r.dealEndsAt} small /></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {showOrder && <FlashOrderSheet deal={deal} qty={qty} unitPrice={unitPrice} total={total} delivery={delivery} onClose={() => setShowOrder(false)} />}
    </div>
  );
}