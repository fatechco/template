import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import FlashCountdown from "@/components/kemetro/flash/FlashCountdown";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const MOCK_DEAL = {
  id: "cd1", productName: "60×60 Porcelain Floor Tiles — Matte Grey", productNameAr: "بلاط أرضي بورسلان 60×60",
  compoundName: "Silver Compound", cityName: "New Cairo", districtName: "5th Settlement",
  retailPricePerUnit: 285, unit: "m²", suggestedQtyPerUnit: 80,
  priceTiers: [
    { minParticipants: 3, pricePerUnit: 240, discountPercent: 16, label: "Starter", incentiveMessage: "Save 16%!" },
    { minParticipants: 8, pricePerUnit: 218, discountPercent: 23, label: "Better", incentiveMessage: "Save 23%!" },
    { minParticipants: 15, pricePerUnit: 198, discountPercent: 31, label: "Best", incentiveMessage: "Maximum savings!" },
  ],
  currentTierIndex: 1, currentParticipants: 11, minParticipants: 5,
  currentTotalQty: 920, dealClosingAt: new Date(Date.now() + 4 * 24 * 3600000).toISOString(),
  status: "forming", productImage: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80",
  deliveryAddress: "Silver Compound Main Gate, 5th Settlement",
  dealDescription: "Group buy for floor tiles for Silver Compound residents. Coordinated delivery to compound gate.",
  participants: [
    { userName: "Ahmed M.", unitNumber: "3A", quantity: 80, joinedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString() },
    { userName: "Sara K.", unitNumber: "5C", quantity: 100, joinedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString() },
    { userName: "Omar F.", unitNumber: "1B", quantity: 90, joinedAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString() },
    { userName: "Nour T.", unitNumber: "7D", quantity: 80, joinedAt: new Date(Date.now() - 6 * 3600000).toISOString() },
  ]
};

const TIMELINE = [
  { status: "done", date: "Today", label: "Deal is forming", desc: "Residents joining and adding quantities" },
  { status: "pending", date: "Closing date", label: "Deal closes", desc: "Order placed with seller" },
  { status: "pending", date: "+2 days", label: "Seller confirms", desc: "Seller prepares your order" },
  { status: "pending", date: "+5-7 days", label: "Delivery to gate", desc: "Materials arrive at compound gate" },
  { status: "pending", date: "Delivery day", label: "Pick up from gate", desc: "Confirm delivery in app" },
  { status: "pending", date: "+24 hours", label: "Payment processed", desc: "Payment released to seller" },
];

export default function KemetroFlashCompoundDetail() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(80);
  const [unitNum, setUnitNum] = useState("");
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    base44.entities.CompoundDeal.filter({ id: dealId })
      .then(data => { const d = data[0] || MOCK_DEAL; setDeal(d); setQty(d.suggestedQtyPerUnit || 80); })
      .catch(() => setDeal(MOCK_DEAL))
      .finally(() => setLoading(false));
  }, [dealId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!deal) return <div className="p-8 text-center text-gray-400">Deal not found</div>;

  const maxParticipants = deal.priceTiers?.[deal.priceTiers.length - 1]?.minParticipants || 20;
  const progress = Math.min(100, (deal.currentParticipants / maxParticipants) * 100);
  const currentTier = deal.priceTiers?.[deal.currentTierIndex] || {};
  const nextTier = deal.priceTiers?.[deal.currentTierIndex + 1];
  const myTotal = qty * (currentTier.pricePerUnit || deal.retailPricePerUnit);
  const myRetailTotal = qty * deal.retailPricePerUnit;
  const mySavings = myRetailTotal - myTotal;
  const willReachNextTier = nextTier && (deal.currentParticipants + 1) >= nextTier.minParticipants;

  const waMsg = encodeURIComponent(`السلام عليكم يا جيران! 🏘️\n\nفي طلب جماعي لـ${deal.productName}\nفي ${deal.compoundName}!\n\nحالياً: -${currentTier.discountPercent}% خصم (${deal.currentParticipants} وحدة)\nلو وصلنا ${maxParticipants} وحدة: -${deal.priceTiers?.[deal.priceTiers.length - 1]?.discountPercent}% خصم!\n\nكل واحد بيوفر تقريباً ${fmt(mySavings)} جنيه!\n\nانضموا من هنا 👇\n${window.location.href}`);

  const handleJoin = async () => {
    setJoining(true);
    const user = await base44.auth.me().catch(() => null);
    const participants = [...(deal.participants || []), {
      userId: user?.id || "guest", userName: user?.full_name || "Resident",
      unitNumber: unitNum, quantity: qty, totalAmount: myTotal,
      paymentStatus: "pending", joinedAt: new Date().toISOString(), deliveryConfirmed: false
    }];
    await base44.entities.CompoundDeal.update(deal.id, {
      participants, currentParticipants: deal.currentParticipants + 1,
      currentTotalQty: deal.currentTotalQty + qty,
      totalGroupValue: (deal.totalGroupValue || 0) + myTotal,
    }).catch(() => {});
    setJoined(true);
    setJoining(false);
  };

  const copyLink = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 text-white px-4 py-8">
        <Link to="/kemetro/flash" className="text-teal-300 text-sm hover:text-white mb-4 block">‹ Flash™ Marketplace</Link>
        <p className="text-teal-300 font-bold text-sm">🏘 Group Buy</p>
        <h1 className="text-2xl font-black mt-1 leading-tight">{deal.productName}</h1>
        <p className="text-teal-300 mt-2 text-sm">For residents of:</p>
        <p className="text-3xl font-black text-white">{deal.compoundName}</p>
        <p className="text-teal-300 text-sm mt-1">📍 {deal.districtName}, {deal.cityName}</p>
      </div>

      {/* Participation meter */}
      <div className="bg-white mx-4 -mt-4 rounded-2xl shadow-lg p-5 mb-4">
        <div className="text-center mb-3">
          <p className="text-lg font-black text-gray-900">{deal.currentParticipants} / {maxParticipants}+ units have joined</p>
          {nextTier && <p className="text-sm text-teal-600 font-semibold">{nextTier.minParticipants - deal.currentParticipants} more units needed for next tier!</p>}
        </div>
        <div className="h-5 bg-gray-100 rounded-full overflow-hidden relative mb-2">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          {deal.priceTiers?.map((tier, i) => {
            const p = (tier.minParticipants / maxParticipants) * 100;
            return <div key={i} className="absolute top-0 bottom-0 flex flex-col items-center" style={{ left: `${p}%` }}>
              <div className="w-0.5 h-full bg-white/70" />
            </div>;
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          {deal.priceTiers?.map((t, i) => <span key={i} className={`font-bold ${i === deal.currentTierIndex ? "text-teal-600" : ""}`}>{t.minParticipants}: -{t.discountPercent}%</span>)}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Participants", val: deal.currentParticipants },
            { label: "Total Qty", val: fmt(deal.currentTotalQty) + " " + deal.unit },
            { label: "Discount", val: `-${currentTier.discountPercent}%` },
            { label: "Closes", val: <FlashCountdown endsAt={deal.dealClosingAt} small /> },
          ].map(s => (
            <div key={s.label} className="bg-teal-50 rounded-xl p-2">
              <p className="font-black text-teal-700 text-sm">{s.val}</p>
              <p className="text-[10px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {/* Join card */}
        {!joined ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-black text-gray-900 text-lg mb-4">Your Contribution</h2>
            <div className="mb-3">
              <label className="text-sm font-bold text-gray-700">Unit / Apartment number (optional):</label>
              <input value={unitNum} onChange={e => setUnitNum(e.target.value)} placeholder="e.g. Unit 4B" className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Quantity needed (typical 3BR: 80-120 m²):</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border-2 border-teal-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(10, q - 10))} className="px-4 py-3 text-teal-600 hover:bg-teal-50 font-black text-xl">−</button>
                <span className="px-6 py-3 font-black text-2xl text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q + 10)} className="px-4 py-3 text-teal-600 hover:bg-teal-50 font-black text-xl">+</button>
              </div>
              <span className="text-gray-500">{deal.unit}</span>
            </div>
            <div className="bg-teal-50 rounded-xl p-3 mb-3">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Unit price (current tier):</span><span className="font-black">{fmt(currentTier.pricePerUnit)} EGP</span></div>
              <div className="flex justify-between text-sm mt-1"><span className="text-gray-600">Your total:</span><span className="font-black text-teal-700 text-lg">{fmt(myTotal)} EGP</span></div>
              <div className="flex justify-between text-sm mt-1"><span className="text-gray-600">You save:</span><span className="font-black text-green-600">{fmt(mySavings)} EGP ({currentTier.discountPercent}%)</span></div>
            </div>
            {willReachNextTier && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
                <p className="text-green-700 font-bold text-sm">🎉 You joining takes us to the next tier! Everyone gets -{nextTier.discountPercent}% discount!</p>
              </div>
            )}
            <p className="text-xs text-gray-400 mb-2">Delivered to: {deal.deliveryAddress}</p>
            <button onClick={handleJoin} disabled={joining} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-3.5 rounded-xl text-base transition-colors disabled:opacity-60">
              {joining ? "Joining..." : "🏘 Join This Group Buy"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">No payment until order is placed. Withdraw anytime before closing.</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-300 rounded-2xl p-5 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-black text-green-700 text-xl">You've joined!</p>
            <p className="text-sm text-gray-600 mt-1">Your spot is reserved. We'll notify you when the deal closes.</p>
          </div>
        )}

        {/* Participants */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 mb-3">{deal.currentParticipants} units have joined:</p>
          <div className="flex -space-x-2 mb-3">
            {[...Array(Math.min(8, deal.currentParticipants))].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-black text-teal-600">👤</div>
            ))}
            {deal.currentParticipants > 8 && <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500">+{deal.currentParticipants - 8}</div>}
          </div>
          <div className="space-y-2">
            {(deal.participants || []).slice(0, 5).map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-gray-50 pb-1.5 last:border-0">
                <span className="text-gray-700 font-semibold">{p.unitNumber ? `Unit ${p.unitNumber}` : "Resident"}</span>
                <span className="text-gray-500">{p.quantity} {deal.unit}</span>
                <span className="text-xs text-gray-400">{new Date(p.joinedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Share section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-1">📣 Share to get better prices!</h2>
          <p className="text-sm text-gray-500 mb-4">Every neighbor who joins brings closer to {deal.priceTiers?.[deal.priceTiers.length - 1]?.discountPercent}% discount</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono text-xs">
{`السلام عليكم يا جيران! 🏘️

في طلب جماعي لـ${deal.productName}
في ${deal.compoundName}!

حالياً: -${currentTier.discountPercent}% خصم (${deal.currentParticipants} وحدة)
لو وصلنا ${maxParticipants} وحدة: -${deal.priceTiers?.[deal.priceTiers.length - 1]?.discountPercent}% خصم!

كل واحد بيوفر تقريباً ${fmt(mySavings)} جنيه!

انضموا من هنا 👇`}
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={`https://wa.me/?text=${waMsg}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-black py-2.5 rounded-xl text-sm transition-colors">📱 WhatsApp</a>
            <button onClick={copyLink} className="flex-1 text-center border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">{copied ? "✅ Copied!" : "📋 Copy Message"}</button>
            <button onClick={copyLink} className="flex-1 text-center border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">🔗 Copy Link</button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">📅 What Happens Next:</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 mb-4 last:mb-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${item.status === "done" ? "bg-teal-500 border-teal-500" : "bg-white border-gray-200"}`}>
                  {item.status === "done" ? <span className="text-white text-sm">✓</span> : <span className="text-gray-300 text-xs">○</span>}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-gray-900 text-sm">{item.label}</p>
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-semibold">{item.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}