import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Handshake, CheckCircle, XCircle, TrendingDown, Sparkles, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MOCK_SESSIONS = [
  {
    id: "sess-1",
    propertySnapshot: { title: "Luxury Apartment | New Cairo", city: "New Cairo" },
    listedPrice: 3500000,
    currentOfferAmount: 3200000,
    status: "negotiating",
    currentRound: 2,
    buyerRole: "buyer",
    currentOfferExpiresAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    buyerStrategy: { briefingSummary: "Counter at 3,250,000 — you're close to agreement." }
  },
  {
    id: "sess-2",
    propertySnapshot: { title: "Villa Sheikh Zayed | 450m²", city: "Sheikh Zayed" },
    listedPrice: 8500000,
    currentOfferAmount: 7900000,
    status: "offer_sent",
    currentRound: 1,
    buyerRole: "buyer",
    currentOfferExpiresAt: new Date(Date.now() + 18 * 3600000).toISOString(),
    buyerStrategy: { briefingSummary: "Awaiting seller response on your opening offer." }
  },
  {
    id: "sess-3",
    propertySnapshot: { title: "Studio Maadi | 65m²", city: "Maadi" },
    listedPrice: 1200000,
    currentOfferAmount: 1100000,
    agreedPrice: 1100000,
    status: "accepted",
    currentRound: 3,
    buyerRole: "buyer",
    dealClosedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const STATUS_CONFIG = {
  offer_sent:      { label: "Awaiting Seller",       color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  counter_offered: { label: "Counter Received",      color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500", urgent: true },
  negotiating:     { label: "Negotiating",           color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  accepted:        { label: "Accepted ✅",            color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  rejected:        { label: "Rejected",              color: "bg-red-100 text-red-600",       dot: "bg-red-500" },
  withdrawn:       { label: "Withdrawn",             color: "bg-gray-100 text-gray-500",     dot: "bg-gray-400" },
  deal_closed:     { label: "Deal Closed 🎉",         color: "bg-green-100 text-green-700",   dot: "bg-green-600" },
};

function fmt(n) { return n ? Number(n).toLocaleString() : "—"; }

function CountdownTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt) - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const isUrgent = new Date(expiresAt) - Date.now() < 2 * 3600000;
  return (
    <span className={`flex items-center gap-1 text-xs font-bold ${isUrgent ? "text-red-500" : "text-gray-500"}`}>
      <Clock size={11} /> {timeLeft}
    </span>
  );
}

export default function NegotiationsDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.NegotiationSession.filter({ buyerId: u?.id })
        .then(data => setSessions(data.length ? data : MOCK_SESSIONS))
        .catch(() => setSessions(MOCK_SESSIONS))
        .finally(() => setLoading(false));
    }).catch(() => {
      setSessions(MOCK_SESSIONS);
      setLoading(false);
    });
  }, []);

  const TABS = [
    { key: "active",  label: "🔥 Active",   filter: s => ["negotiating","offer_sent","counter_offered"].includes(s.status) },
    { key: "pending", label: "⏳ Pending",   filter: s => s.status === "offer_sent" },
    { key: "closed",  label: "✅ Closed",    filter: s => ["accepted","deal_closed"].includes(s.status) },
    { key: "declined",label: "❌ Declined",  filter: s => ["rejected","withdrawn"].includes(s.status) },
    { key: "all",     label: "📋 All",       filter: () => true },
  ];

  const activeTab = TABS.find(t => t.key === tab);
  const filtered = sessions.filter(activeTab?.filter || (() => true));

  const totalSaved = sessions
    .filter(s => s.agreedPrice && s.listedPrice)
    .reduce((sum, s) => sum + (s.listedPrice - s.agreedPrice), 0);

  const activeCount = sessions.filter(s => ["negotiating","offer_sent","counter_offered"].includes(s.status)).length;
  const awaitingCount = sessions.filter(s => s.status === "offer_sent").length;
  const successCount = sessions.filter(s => ["accepted","deal_closed"].includes(s.status)).length;
  const successRate = sessions.length > 0 ? Math.round((successCount / sessions.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          🤝 <span>My Negotiations</span>
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">All your active and past negotiations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active", value: activeCount, color: "text-orange-600" },
          { label: "Awaiting Response", value: awaitingCount, color: "text-blue-600" },
          { label: "Total Saved", value: totalSaved > 0 ? `${fmt(totalSaved)} EGP` : "—", color: "text-green-600" },
          { label: "Success Rate", value: `${successRate}%`, color: "text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => {
          const count = sessions.filter(t.filter).length;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${tab === t.key ? "text-orange-600 border-orange-500" : "text-gray-500 border-transparent"}`}>
              {t.label} <span className="ml-1 text-gray-400">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Session Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1,2].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">🤝</p>
          <p className="font-black text-gray-700 text-lg">No negotiations here</p>
          <p className="text-gray-400 text-sm mt-1">Browse properties and click "Make an Offer" to start</p>
          <Link to="/search-properties" className="inline-block mt-4 bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.negotiating;
            const isActionNeeded = s.status === "counter_offered";
            const gap = s.listedPrice && s.currentOfferAmount ? s.listedPrice - s.currentOfferAmount : 0;
            return (
              <div key={s.id} className={`bg-white rounded-2xl border shadow-sm p-4 transition-all hover:shadow-md ${isActionNeeded ? "border-l-4 border-l-orange-500 border-t border-r border-b border-gray-100" : "border-gray-100"}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">🏠</div>
                    <div className="min-w-0">
                      <p className="font-black text-gray-900 text-sm truncate">{s.propertySnapshot?.title}</p>
                      <p className="text-xs text-gray-400">{s.propertySnapshot?.city}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-gray-400 text-[9px]">Round</p>
                    <p className="font-black text-gray-800">{s.currentRound}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-gray-400 text-[9px]">Your Offer</p>
                    <p className="font-black text-orange-600 text-[11px]">{fmt(s.currentOfferAmount)} EGP</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-gray-400 text-[9px]">Gap</p>
                    <p className="font-black text-gray-800 text-[11px]">{gap > 0 ? `${fmt(gap)} EGP` : "—"}</p>
                  </div>
                </div>

                {s.currentOfferExpiresAt && !["accepted","rejected","deal_closed"].includes(s.status) && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-gray-400">Offer expires:</span>
                    <CountdownTimer expiresAt={s.currentOfferExpiresAt} />
                  </div>
                )}

                {s.buyerStrategy?.briefingSummary && (
                  <div className="bg-purple-50 rounded-lg px-3 py-2 mb-3">
                    <p className="text-[10px] text-purple-600 leading-snug flex items-start gap-1">
                      <Sparkles size={9} className="mt-0.5 flex-shrink-0" />
                      {s.buyerStrategy.briefingSummary}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link to={`/kemedar/negotiate/${s.id}`}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
                    <Handshake size={12} /> View Deal Room
                  </Link>
                  {isActionNeeded && (
                    <Link to={`/kemedar/negotiate/${s.id}`}
                      className="border border-orange-300 text-orange-600 font-bold py-2.5 px-4 rounded-xl text-xs">
                      Quick Counter
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}