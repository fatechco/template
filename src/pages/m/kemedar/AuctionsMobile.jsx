import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "live", label: "🔴 Live" },
  { id: "ending_soon", label: "⏰ Ending Soon" },
  { id: "registration", label: "📋 Registration" },
  { id: "upcoming", label: "🗓 Upcoming" },
];

const STATUS_COLORS = {
  live: { bg: "bg-red-100", text: "text-red-700", label: "LIVE" },
  extended: { bg: "bg-orange-100", text: "text-orange-700", label: "EXTENDED" },
  scheduled: { bg: "bg-blue-100", text: "text-blue-700", label: "UPCOMING" },
  registration: { bg: "bg-purple-100", text: "text-purple-700", label: "OPEN REG" },
  ended: { bg: "bg-gray-100", text: "text-gray-600", label: "ENDED" },
  completed: { bg: "bg-green-100", text: "text-green-700", label: "COMPLETED" },
  awaiting_payment: { bg: "bg-yellow-100", text: "text-yellow-700", label: "AWAITING PAYMENT" },
};

function fmt(n) {
  if (!n) return "—";
  return "EGP " + Number(n).toLocaleString();
}

function timeLeft(endAt) {
  if (!endAt) return null;
  const diff = new Date(endAt) - new Date();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

function AuctionCard({ auction }) {
  const navigate = useNavigate();
  const statusCfg = STATUS_COLORS[auction.status] || { bg: "bg-gray-100", text: "text-gray-600", label: auction.status };
  const remaining = timeLeft(auction.auctionEndAt);
  const isLive = ["live", "extended"].includes(auction.status);

  return (
    <div
      onClick={() => navigate(`/auctions/${auction.auctionCode}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="h-36 relative" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🏠</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
            {isLive && <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse" />}
            {statusCfg.label}
          </span>
        </div>
        {remaining && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            ⏱ {remaining}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-black text-gray-900 text-sm line-clamp-2 mb-2">
          {auction.auctionTitle || "Property Auction"}
        </p>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-gray-400">Starting Price</p>
            <p className="font-black text-sm" style={{ color: "#C41230" }}>{fmt(auction.startingPriceEGP)}</p>
          </div>
          {auction.currentHighestBidEGP > 0 && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Current Bid</p>
              <p className="font-black text-sm text-green-600">{fmt(auction.currentHighestBidEGP)}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500 pt-2 border-t border-gray-50">
          <span>🔨 {auction.totalBids || 0} bids</span>
          <span>👥 {auction.totalUniqueBidders || 0} bidders</span>
          {auction.buyNowPriceEGP && <span className="text-green-600 font-bold">Buy Now: {fmt(auction.buyNowPriceEGP)}</span>}
        </div>
      </div>
    </div>
  );
}

export default function AuctionsMobile() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    base44.entities.PropertyAuction.list("-created_date", 100)
      .then(data => { setAuctions(data || []); setLoading(false); });
  }, []);

  const now = new Date();
  const filtered = auctions.filter(a => {
    if (activeTab === "all") return true;
    if (activeTab === "live") return ["live", "extended"].includes(a.status);
    if (activeTab === "ending_soon") {
      const h = (new Date(a.auctionEndAt) - now) / 3600000;
      return h > 0 && h <= 24;
    }
    if (activeTab === "registration") return a.status === "registration";
    if (activeTab === "upcoming") return a.status === "scheduled";
    return true;
  });

  const live = auctions.filter(a => ["live", "extended"].includes(a.status)).length;
  const endingSoon = auctions.filter(a => {
    const h = (new Date(a.auctionEndAt) - now) / 3600000;
    return h > 0 && h <= 24;
  }).length;
  const upcoming = auctions.filter(a => a.status === "scheduled").length;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Navbar */}
      <div style={{ background: "#1a1a2e", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => {
            if (window.history.length > 1) { navigate(-1); } else { navigate('/m/home'); }
          }}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🔨 KemedarBid™ Auctions</p>
        <div style={{ width: 36 }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Hero */}
        <div className="px-5 pt-8 pb-10 text-white"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0d0d1a 100%)" }}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border mb-4"
              style={{ background: "rgba(196,18,48,0.2)", borderColor: "#C41230", color: "#ff6b7a" }}>
              {live > 0 && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              {live > 0 ? `${live} Auctions Live Now` : "KemedarBid™ Auctions"}
            </div>
            <div className="text-5xl mb-3">🔨</div>
            <h1 className="text-3xl font-black mb-2 text-white">KemedarBid™</h1>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Egypt's first transparent property auction platform. Bid live, buy with confidence.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: live, l: "Live Now", color: "#ff6b7a" },
                { v: endingSoon, l: "Ending Soon", color: "#F59E0B" },
                { v: upcoming, l: "Upcoming", color: "#60A5FA" },
              ].map((s, i) => (
                <div key={i} className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <p className="text-xl font-black" style={{ color: s.color }}>{s.v}</p>
                  <p className="text-[10px] text-gray-400">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works strip */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {[
              { icon: "📋", t: "Register to Bid", d: "KYC + deposit" },
              { icon: "🔨", t: "Place Bids", d: "Live or auto-bid" },
              { icon: "🏆", t: "Win & Pay", d: "48h to complete" },
              { icon: "🔗", t: "Blockchain Transfer", d: "Tamper-proof" },
            ].map((s, i) => (
              <div key={i} className="flex-shrink-0 text-center" style={{ width: 72 }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-[10px] font-black text-gray-900">{s.t}</p>
                <p className="text-[9px] text-gray-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2.5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {STATUS_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{
                  background: activeTab === tab.id ? "#C41230" : "#f3f4f6",
                  color: activeTab === tab.id ? "#fff" : "#374151"
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auction List */}
        <div className="px-4 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-gray-400 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🔨</div>
              <p className="font-black text-gray-700 mb-1">No auctions here yet</p>
              <p className="text-gray-500 text-xs">Check back soon or try another filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(auction => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-white text-center"
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
          <p className="font-black text-base mb-1">New to Auctions?</p>
          <p className="text-gray-400 text-xs mb-3">Learn how KemedarBid™ protects buyers and sellers</p>
          <div className="flex gap-2 justify-center">
            <Link to="/m/auctions/how-it-works"
              className="inline-block font-black text-sm px-6 py-2.5 rounded-xl text-white"
              style={{ background: "#C41230" }}>
              📖 How It Works
            </Link>
            <Link to="/m/add/property/"
              className="inline-block font-black text-sm px-6 py-2.5 rounded-xl text-white"
              style={{ background: "#FF6B00" }}>
              🏠 List Your Property
            </Link>
          </div>
        </div>

      </div>{/* end scrollable */}

      <MobileBottomNav />
    </div>
  );
}