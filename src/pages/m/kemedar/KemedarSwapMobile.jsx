import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Settings, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const TABS = [
  { key: "matches", label: "🔄 Matches" },
  { key: "negotiations", label: "💬 Active" },
  { key: "completed", label: "✅ Done" },
  { key: "passed", label: "👁️ Passed" },
];

const HOW_STEPS = [
  { icon: "🏠", title: "List Your Property", desc: "Add the property you want to swap and set your preferences." },
  { icon: "🤖", title: "AI Finds Matches", desc: "Our algorithm scans the pool daily to find compatible swaps." },
  { icon: "💬", title: "Negotiate & Agree", desc: "Chat in a dedicated room, agree on gap payment terms." },
  { icon: "🔐", title: "Escrow & Transfer", desc: "Secure escrow protects both parties until ownership transfer." },
];

function MatchCard({ match, userId }) {
  const navigate = useNavigate();
  const isA = match.userAId === userId;
  const otherProp = isA ? match.propertyBTitle : match.propertyATitle;
  const otherCity = isA ? match.propertyBCity : match.propertyACity;
  const otherImg = isA ? match.propertyBImage : match.propertyAImage;
  const score = match.matchScore || 0;
  const gap = match.valuationGapEGP || 0;
  const status = match.status;

  const isInterested = (isA && status === "a_interested") || (!isA && status === "b_interested");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex">
        <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
          {otherImg ? (
            <img src={otherImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
          )}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <p className="font-black text-gray-900 text-xs truncate">{otherProp || "Swap Property"}</p>
          {otherCity && <p className="text-[10px] text-gray-400 mt-0.5">📍 {otherCity}</p>}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: score >= 80 ? "#7C3AED20" : "#F59E0B20", color: score >= 80 ? "#7C3AED" : "#F59E0B" }}>
              {score}% match
            </span>
            {gap > 0 && (
              <span className="text-[10px] font-bold text-gray-500">
                Gap: {new Intl.NumberFormat("en-EG").format(gap)} EGP
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {isInterested ? (
              <span className="text-[10px] font-bold text-green-600">✅ Interest sent</span>
            ) : ["both_interested", "negotiating"].includes(status) ? (
              <button onClick={() => navigate(`/dashboard/swap/negotiation/${match.id}`)}
                className="text-[10px] font-black px-3 py-1 rounded-lg text-white" style={{ background: "#7C3AED" }}>
                Open Room →
              </button>
            ) : (
              <button onClick={() => navigate("/m/swap")}
                className="text-[10px] font-black px-3 py-1 rounded-lg text-white" style={{ background: "#7C3AED" }}>
                View & Swipe →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-4xl mb-2">{icon}</p>
      <p className="font-bold text-sm text-gray-700">{title}</p>
      <p className="text-xs mt-1">{subtitle}</p>
    </div>
  );
}

export default function KemedarSwapMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [intent, setIntent] = useState(null);
  const [matches, setMatches] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [passed, setPassed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("matches");

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      loadData(u);
    }).catch(() => setLoading(false));
  }, []);

  const loadData = async (u) => {
    setLoading(true);
    try {
      const intents = await base44.entities.SwapIntent.filter({ userId: u.id, status: "active" }, "-created_date", 1);
      setIntent(intents?.[0] || null);

      const [asA, asB] = await Promise.all([
        base44.entities.SwapMatch.filter({ userAId: u.id }, "-created_date", 50),
        base44.entities.SwapMatch.filter({ userBId: u.id }, "-created_date", 50),
      ]);
      const all = [...(asA || []), ...(asB || [])];

      setMatches(all.filter(m => ["suggested", "a_seen", "b_seen", "a_interested", "b_interested"].includes(m.status)));
      setNegotiations(all.filter(m => ["both_interested", "negotiating", "terms_agreed", "legal_review", "escrow_active"].includes(m.status)));
      setCompleted(all.filter(m => m.status === "completed"));
      setPassed(all.filter(m => m.status === "rejected" || m.status === "expired"));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const tabCounts = {
    matches: matches.length,
    negotiations: negotiations.length,
    completed: completed.length,
    passed: passed.length,
  };

  const tabData = {
    matches,
    negotiations,
    completed,
    passed,
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Navbar */}
      <div style={{ background: "linear-gradient(135deg, #0A1628 0%, #2D1B69 100%)", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => { if (window.history.length > 1) navigate(-1); else navigate("/m/home"); }}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🔄 Kemedar Swap™</p>
        <button onClick={() => navigate("/dashboard/swap/intent")}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <Settings size={16} color="white" />
        </button>
      </div>

      {/* Scrollable */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* Hero */}
        <div className="px-5 pt-6 pb-8 text-white"
          style={{ background: "linear-gradient(135deg, #0A1628 0%, #2D1B69 60%, #0A1628 100%)" }}>
          <div className="text-center">
            <div className="text-5xl mb-3" style={{ animation: "spin 8s linear infinite", display: "inline-block" }}>🔄</div>
            <h1 className="text-2xl font-black mb-2">Swap Your Property</h1>
            <p className="text-gray-300 text-sm mb-5 leading-relaxed">
              Trade your property directly with another verified owner. AI finds your perfect match — no agents, no middlemen.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { v: matches.length || "0", l: "Matches", c: "#A78BFA" },
                { v: negotiations.length || "0", l: "Active", c: "#F59E0B" },
                { v: completed.length || "0", l: "Completed", c: "#10B981" },
              ].map(s => (
                <div key={s.l} className="rounded-xl py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <p className="text-xl font-black" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-[10px] text-gray-400">{s.l}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2">
              <button onClick={() => navigate("/m/swap")}
                className="flex-1 flex items-center justify-center gap-1.5 font-black text-sm py-3 rounded-xl"
                style={{ background: "#7C3AED", color: "white" }}>
                🔄 Swipe Matches
              </button>
              <button onClick={() => navigate("/m/add/property")}
                className="flex-1 flex items-center justify-center gap-1.5 font-bold text-sm py-3 rounded-xl border-2"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                + List Property
              </button>
            </div>
          </div>
        </div>

        {/* Intent Card */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={24} className="animate-spin text-purple-500" />
            </div>
          ) : intent ? (
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Your Active Swap Intent</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏠</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">Property #{intent.offeredPropertyId?.slice(0, 8)}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-0.5">
                    🟢 Active in Pool
                  </span>
                </div>
                <Link to="/dashboard/swap/intent"
                  className="text-[10px] font-black px-3 py-1.5 rounded-lg border-2 flex-shrink-0"
                  style={{ borderColor: "#7C3AED", color: "#7C3AED" }}>
                  Edit →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">You haven't listed a property for swap yet.</p>
              <button onClick={() => navigate("/m/add/property")}
                className="font-black text-sm px-6 py-2.5 rounded-xl text-white" style={{ background: "#7C3AED" }}>
                + List a Property for Swap →
              </button>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="flex-shrink-0 text-center" style={{ width: 80 }}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-[10px] font-black text-gray-900 leading-tight">{s.title}</p>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                style={{ background: tab === t.key ? "#7C3AED" : "#f3f4f6", color: tab === t.key ? "#fff" : "#6b7280" }}>
                {t.label}
                {tabCounts[t.key] > 0 && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                    style={{ background: tab === t.key ? "rgba(255,255,255,0.3)" : "#e5e7eb" }}>
                    {tabCounts[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-purple-400" />
            </div>
          ) : (
            <>
              {tab === "matches" && (
                matches.length === 0 ? (
                  <EmptyState icon="🏠↔️🏠" title="No matches yet" subtitle="We scan the pool daily. You'll be notified when we find a compatible swap." />
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500">{matches.length} swap suggestion{matches.length !== 1 ? "s" : ""}</p>
                    {matches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).map(m => (
                      <MatchCard key={m.id} match={m} userId={user?.id} />
                    ))}
                  </div>
                )
              )}

              {tab === "negotiations" && (
                negotiations.length === 0 ? (
                  <EmptyState icon="💬" title="No active negotiations" subtitle="When you and a match both express interest, a negotiation room opens here." />
                ) : (
                  <div className="space-y-3">
                    {negotiations.map(m => (
                      <MatchCard key={m.id} match={m} userId={user?.id} />
                    ))}
                  </div>
                )
              )}

              {tab === "completed" && (
                completed.length === 0 ? (
                  <EmptyState icon="✅" title="No completed swaps" subtitle="Completed swap deals will appear here." />
                ) : (
                  <div className="space-y-3">
                    {completed.map(m => (
                      <MatchCard key={m.id} match={m} userId={user?.id} />
                    ))}
                  </div>
                )
              )}

              {tab === "passed" && (
                passed.length === 0 ? (
                  <EmptyState icon="👁️" title="No passed matches" subtitle="Matches you declined will appear here." />
                ) : (
                  <div className="space-y-3">
                    {passed.map(m => (
                      <MatchCard key={m.id} match={m} userId={user?.id} />
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mx-4 mb-6 rounded-2xl p-5 text-white text-center"
          style={{ background: "linear-gradient(135deg, #0A1628, #2D1B69)" }}>
          <p className="font-black text-base mb-1">Ready to Swap?</p>
          <p className="text-gray-400 text-xs mb-3">Start swiping through matched properties Tinder-style</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate("/m/swap")}
              className="font-black text-sm px-6 py-2.5 rounded-xl text-white"
              style={{ background: "#7C3AED" }}>
              🔄 Start Swiping
            </button>
            <Link to="/kemedar/swap/landing" className="font-bold text-sm px-5 py-2.5 rounded-xl border border-white/30 text-white">
              📖 How It Works
            </Link>
          </div>
        </div>

        <div className="h-20" />
      </div>

      <MobileBottomNav />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}