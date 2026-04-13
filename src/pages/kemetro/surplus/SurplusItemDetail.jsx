import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";
import { ChevronRight, Heart } from "lucide-react";

const CONDITION_LABELS = {
  brand_new_excess: "✨ Brand New (Excess)",
  open_box: "📦 Open Box",
  lightly_used: "👍 Lightly Used",
  salvaged: "♻️ Salvaged/Reclaimed",
};

const DELIVERY_LABELS = {
  pickup_only: "🤝 Pickup Only",
  shipper_network: "🚛 Kemetro Shipper Network",
  seller_delivers: "🚗 Seller Delivers",
};

function DiscountPill({ pct }) {
  if (!pct) return null;
  return (
    <span className="inline-block px-3 py-1 rounded-full text-sm font-black bg-green-100 text-green-700">
      {Math.round(pct)}% off retail
    </span>
  );
}

export default function SurplusItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showAr, setShowAr] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [user, setUser] = useState(null);
  const [reserveError, setReserveError] = useState("");
  const [reserveSuccess, setReserveSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.SurplusItem.filter({ id: itemId }, "-created_date", 1),
      base44.auth.me().catch(() => null),
    ]).then(([items, u]) => {
      setItem(items?.[0] || null);
      setUser(u);
      setLoading(false);
    });
  }, [itemId]);

  const handleReserve = async () => {
    if (!user) { navigate("/m/login"); return; }
    setReserving(true);
    setReserveError("");
    const res = await base44.functions.invoke("reserveSurplusItem", { surplusItemId: item.id }).catch(e => ({ data: { error: e.message } }));
    setReserving(false);
    if (res.data?.error) setReserveError(res.data.error);
    else setReserveSuccess(true);
  };

  const handleSave = async () => {
    if (!user) { navigate("/m/login"); return; }
    await base44.entities.SurplusSavedItem.create({ surplusItemId: item.id, userId: user.id }).catch(() => {});
    setSaved(true);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <KemetroHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col">
      <KemetroHeader />
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div>
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-xl font-bold text-gray-700">Item not found</p>
          <Link to="/kemetro/surplus" className="mt-4 inline-block text-green-600 font-semibold hover:underline">← Back to Surplus Market</Link>
        </div>
      </div>
    </div>
  );

  const images = item.images?.length ? item.images : [item.primaryImageUrl].filter(Boolean);
  if (!images.length) images.push("https://images.unsplash.com/photo-1558618047-f4e90f6b3b44?w=800&q=80");

  const isActive = item.status === "active";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <KemetroHeader />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center gap-1.5 text-xs text-gray-400">
          <Link to="/kemetro" className="hover:text-green-600">Kemetro</Link>
          <ChevronRight size={12} />
          <Link to="/kemetro/surplus" className="hover:text-green-600">Surplus & Salvage</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-xs">{item.title}</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">
        <div className="flex gap-6 items-start flex-col lg:flex-row">

          {/* LEFT 65% */}
          <div className="flex-[2] min-w-0 space-y-5">

            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="relative cursor-pointer rounded-xl overflow-hidden mb-3" style={{ height: 360 }} onClick={() => setLightbox(true)}>
                <img src={images[activeImg]} alt={item.title} className="w-full h-full object-cover" />
                {item.discountPercent >= 60 && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full">
                    🔥 {Math.round(item.discountPercent)}% OFF RETAIL
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl object-cover flex-shrink-0 cursor-pointer border-2 transition-all ${activeImg === i ? "border-green-500" : "border-transparent hover:border-gray-300"}`} />
                ))}
              </div>
            </div>

            {/* Title + badges */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{CONDITION_LABELS[item.condition]}</span>
                {item.categoryId && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{item.categoryId}</span>}
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">{item.title}</h1>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-base mb-3">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {showAr ? (item.descriptionAr || item.description) : (item.description || "No description provided.")}
              </p>
              {item.descriptionAr && (
                <button onClick={() => setShowAr(v => !v)} className="mt-3 text-sm font-bold text-green-600 hover:underline">
                  {showAr ? "▲ Show in English" : "▼ Show in Arabic العربية"}
                </button>
              )}
            </div>

            {/* Eco Impact */}
            {(item.estimatedWeightKg || item.estimatedCo2SavedKg) && (
              <div className="rounded-2xl border-2 border-green-300 p-5" style={{ background: "#F0FDF4" }}>
                <h3 className="font-black text-green-800 text-base mb-3 flex items-center gap-2">🌍 Environmental Impact of This Purchase</h3>
                <div className="grid grid-cols-2 gap-4">
                  {item.estimatedWeightKg && (
                    <div className="text-center">
                      <p className="text-3xl font-black text-green-700">{item.estimatedWeightKg} kg</p>
                      <p className="text-sm text-green-600">kept out of landfill</p>
                    </div>
                  )}
                  {item.estimatedCo2SavedKg && (
                    <div className="text-center">
                      <p className="text-3xl font-black text-green-700">{item.estimatedCo2SavedKg} kg</p>
                      <p className="text-sm text-green-600">CO₂ emissions avoided</p>
                    </div>
                  )}
                </div>
                {item.ecoImpactNote && <p className="text-sm text-green-700 italic mt-3">{item.ecoImpactNote}</p>}
              </div>
            )}

            {/* Seller info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-black text-gray-900 text-base mb-3">Seller</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-black text-green-700 flex-shrink-0">
                  {item.sellerType === "developer" ? "🏗" : "🏠"}
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">{item.sellerType?.charAt(0).toUpperCase() + item.sellerType?.slice(1)}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {item.sellerType === "developer" ? "🏗️ Developer" : "🏠 Homeowner"}
                  </span>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-700 transition-all">
                💬 Message Seller
              </button>
            </div>
          </div>

          {/* RIGHT 35% */}
          <div className="w-full lg:w-[340px] flex-shrink-0 sticky top-4">
            <div className="bg-white rounded-2xl border-2 border-green-400 shadow-sm p-5 space-y-4">

              {/* Price */}
              <div>
                <p className="text-4xl font-black text-green-700 leading-none">{Number(item.surplusPriceEGP || 0).toLocaleString()} EGP</p>
                {item.originalRetailPriceEGP && (
                  <p className="text-sm text-gray-400 line-through mt-1">Retail: {Number(item.originalRetailPriceEGP).toLocaleString()} EGP</p>
                )}
                <div className="mt-1.5">
                  <DiscountPill pct={item.discountPercent} />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>📦 {item.quantityAvailable} {item.unit} available</p>
                <p>📍 {item.addressText || item.cityId || "Cairo"}</p>
                <p>{DELIVERY_LABELS[item.deliveryOption] || "🤝 Pickup Only"}</p>
              </div>

              {/* Escrow trust box */}
              <div className="rounded-xl p-3 space-y-1.5" style={{ background: "#F0FDF4" }}>
                <p className="text-sm font-black text-green-800">🔒 Secured by XeedWallet Escrow</p>
                <p className="text-xs text-green-700 leading-relaxed">
                  Funds held safely until you inspect and confirm the items in person.
                </p>
                <p className="text-xs text-green-700 font-bold">100% refund if items not as described.</p>
              </div>

              {/* Error */}
              {reserveError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-700 font-semibold">{reserveError}</p>
                  {reserveError.includes("balance") && (
                    <Link to="/m/cp/user/wallet" className="text-xs text-red-600 font-bold underline mt-1 block">Top Up Wallet →</Link>
                  )}
                </div>
              )}

              {/* Success */}
              {reserveSuccess && (
                <div className="bg-green-50 border border-green-300 rounded-xl p-3">
                  <p className="text-sm font-black text-green-800">✅ Reserved! Check your messages for QR code and pickup instructions.</p>
                </div>
              )}

              {/* Reserve button */}
              {!reserveSuccess && (
                <button
                  onClick={handleReserve}
                  disabled={!isActive || reserving}
                  className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  style={{ background: isActive ? "#16A34A" : "#9CA3AF", fontSize: 16 }}
                >
                  {reserving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Reserving...</>
                  ) : isActive ? "🛒 Reserve via XeedWallet Escrow" : item.status === "reserved" ? "⏳ Currently Reserved" : "✅ Sold"}
                </button>
              )}

              {/* Save */}
              <button onClick={handleSave} disabled={saved}
                className="w-full py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Heart size={15} fill={saved ? "#16A34A" : "none"} className={saved ? "text-green-600" : ""} />
                {saved ? "Saved to Watchlist ✓" : "🤍 Save to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <img src={images[activeImg]} className="max-h-[90vh] max-w-full rounded-xl" />
        </div>
      )}

      <KemetroFooter />
    </div>
  );
}