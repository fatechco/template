import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, Bell, RotateCcw, X, Star, Heart, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SwipeCard from "@/components/match/SwipeCard";
import MatchCelebration from "@/components/match/MatchCelebration";

const MOCK_PROPERTIES = [
  { id: "m1", title: "Luxury Apartment New Cairo", price_amount: 2100000, currency: "EGP", beds: 3, baths: 2, area_size: 150, floor_number: 5, city_name: "New Cairo", district_name: "5th Settlement", image_gallery: ["https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"], is_verified: true, description: "Stunning apartment with lake views and premium finishes throughout." },
  { id: "m2", title: "Modern Villa Sheikh Zayed", price_amount: 8500000, currency: "EGP", beds: 5, baths: 4, area_size: 450, city_name: "Sheikh Zayed", district_name: "Beverly Hills", image_gallery: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"], description: "Spacious villa with private pool and lush garden in a gated compound." },
  { id: "m3", title: "Cozy Studio Maadi", price_amount: 850000, currency: "EGP", beds: 1, baths: 1, area_size: 55, city_name: "Maadi", image_gallery: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], description: "Charming studio in leafy Maadi, close to metro and international schools." },
  { id: "m4", title: "Family Townhouse 6th October", price_amount: 3200000, currency: "EGP", beds: 4, baths: 3, area_size: 280, city_name: "6th October", image_gallery: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"], description: "Spacious townhouse in quiet compound with community park and clubhouse." },
  { id: "m5", title: "Penthouse Heliopolis", price_amount: 5600000, currency: "EGP", beds: 4, baths: 3, area_size: 320, floor_number: 12, city_name: "Heliopolis", image_gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"], description: "Top-floor penthouse with panoramic city views and private roof terrace." },
  { id: "m6", title: "Waterfront Apartment North Coast", price_amount: 1800000, currency: "EGP", beds: 2, baths: 2, area_size: 120, city_name: "North Coast", image_gallery: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"], description: "Beachfront apartment with direct sea access and resort amenities." },
  { id: "m7", title: "Classic Apartment Zamalek", price_amount: 4200000, currency: "EGP", beds: 3, baths: 2, area_size: 200, city_name: "Zamalek", image_gallery: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"], description: "Elegant pre-war building with high ceilings and Nile glimpses." },
];

const MATCH_SCORES = [87, 92, 74, 88, 95, 82, 79];

export default function KemedarMatchMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matchProfile, setMatchProfile] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [superLikesLeft, setSuperLikesLeft] = useState(5);
  const [celebration, setCelebration] = useState(null);
  const [historyStack, setHistoryStack] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const profiles = await base44.entities.MatchProfile.filter({ userId: me.id, isActive: true });
        if (!profiles.length) { navigate("/m/kemedar/match/setup"); return; }
        const profile = profiles[0];
        setMatchProfile(profile);
        const existingMatches = await base44.entities.PropertyMatch.filter({ buyerId: me.id, status: "matched" });
        setMatchCount(existingMatches.length);
        const swipes = await base44.entities.PropertySwipe.filter({ userId: me.id });
        const swipedIds = new Set(swipes.map(s => s.propertyId));
        const allProps = await base44.entities.Property.filter({ status: "active" }, "-created_date", 100);
        const filtered = allProps.filter(p => !swipedIds.has(p.id) && p.created_by !== me.id);
        setQueue(filtered.length >= 3 ? filtered : [...filtered, ...MOCK_PROPERTIES]);
      } catch {
        setQueue(MOCK_PROPERTIES);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const currentProperty = queue[currentIdx];
  const nextProperty = queue[currentIdx + 1];
  const nnProperty = queue[currentIdx + 2];

  const handleSwipe = useCallback(async (action, property) => {
    if (swiping || !property) return;
    setSwiping(true);
    if (action === "super_like" && superLikesLeft <= 0) { setSwiping(false); return; }
    if (action === "super_like") setSuperLikesLeft(prev => prev - 1);
    const duration = Math.round((Date.now() - startTime.current) / 1000);
    startTime.current = Date.now();
    setHistoryStack(prev => [...prev, { idx: currentIdx, property }]);
    setCurrentIdx(prev => prev + 1);
    setSwiping(false);
    if (user && matchProfile) {
      const result = await base44.functions.invoke("recordSwipe", { propertyId: property.id, action, matchProfileId: matchProfile.id, viewDuration: duration }).catch(() => null);
      if (result?.data?.isMatch) {
        setCelebration({ match: result?.data?.match, property });
        setMatchCount(prev => prev + 1);
      }
    }
  }, [swiping, superLikesLeft, currentIdx, user, matchProfile]);

  const handleUndo = () => {
    if (!historyStack.length) return;
    setHistoryStack(prev => prev.slice(0, -1));
    setCurrentIdx(prev => Math.max(0, prev - 1));
  };

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-pulse">💘</div>
        <p className="font-bold text-xl">Loading your queue...</p>
        <p className="text-white/40 text-sm mt-2">AI is picking the best matches</p>
      </div>
    </div>
  );

  const isEmpty = currentIdx >= queue.length;

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col overflow-hidden z-50">
      {celebration && (
        <MatchCelebration
          match={celebration.match}
          property={celebration.property}
          onDismiss={() => setCelebration(null)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-2 flex-shrink-0" style={{ paddingTop: "max(16px, env(safe-area-inset-top))" }}>
        <Link to="/m/kemedar/match/setup" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
          <Settings className="w-4 h-4 text-white/70" />
        </Link>
        <div className="text-center">
          <h1 className="text-white font-black text-base">💘 Kemedar Match™</h1>
          {matchProfile && (
            <p className="text-white/40 text-[10px]">
              {matchProfile.budgetMin ? `${(matchProfile.budgetMin/1000000).toFixed(1)}M` : "Any"} – {matchProfile.budgetMax ? `${(matchProfile.budgetMax/1000000).toFixed(1)}M` : "Any"} EGP
            </p>
          )}
        </div>
        <Link to="/m/kemedar/match/history" className="relative w-9 h-9 bg-white/10 rounded-full flex items-center justify-center">
          <Bell className="w-4 h-4 text-white/70" />
          {matchCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-black text-white">
              {matchCount > 9 ? "9+" : matchCount}
            </span>
          )}
        </Link>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
        {isEmpty ? (
          <MobileEmptyState onReset={() => setCurrentIdx(0)} />
        ) : (
          <div className="relative w-full" style={{ maxWidth: 400, height: "min(520px, 65vh)" }}>
            {nnProperty && (
              <SwipeCard property={nnProperty} matchScore={MATCH_SCORES[(currentIdx + 2) % MATCH_SCORES.length]} isTop={false}
                style={{ width: "100%", height: "100%", top: 16, left: 0, transform: "scale(0.94)", zIndex: 1 }} />
            )}
            {nextProperty && (
              <SwipeCard property={nextProperty} matchScore={MATCH_SCORES[(currentIdx + 1) % MATCH_SCORES.length]} isTop={false}
                style={{ width: "100%", height: "100%", top: 8, left: 0, transform: "scale(0.97)", zIndex: 2 }} />
            )}
            {currentProperty && (
              <SwipeCard key={currentProperty.id} property={currentProperty} matchScore={MATCH_SCORES[currentIdx % MATCH_SCORES.length]}
                isTop={true} onSwipe={handleSwipe}
                style={{ width: "100%", height: "100%", top: 0, left: 0, zIndex: 3 }} />
            )}
          </div>
        )}
        {!isEmpty && (
          <p className="text-white/30 text-xs mt-3">{currentIdx + 1} of {queue.length} properties</p>
        )}
      </div>

      {/* Action buttons */}
      {!isEmpty && (
        <div className="flex items-end justify-center gap-3 pb-safe pb-6 pt-3 flex-shrink-0" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Undo</span>
            <button onClick={handleUndo} disabled={!historyStack.length}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full flex items-center justify-center border border-white/20">
              <RotateCcw className="w-4 h-4 text-white/70" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Pass</span>
            <button onClick={() => handleSwipe("pass", currentProperty)}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <X className="w-7 h-7 text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">{superLikesLeft}/5</span>
            <button onClick={() => handleSwipe("super_like", currentProperty)} disabled={superLikesLeft <= 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${superLikesLeft > 0 ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30" : "bg-white/10 cursor-not-allowed"}`}>
              <Star className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Like</span>
            <button onClick={() => handleSwipe("like", currentProperty)}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Heart className="w-7 h-7 text-white" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Info</span>
            <button className="w-10 h-10 bg-blue-500/20 hover:bg-blue-500/30 rounded-full flex items-center justify-center border border-blue-400/30">
              <Info className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileEmptyState({ onReset }) {
  const navigate = useNavigate();
  return (
    <div className="text-center text-white px-6">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-xl font-black mb-2">You've been thorough!</h2>
      <p className="text-white/60 mb-6 text-sm">No more properties match your current filters</p>
      <div className="space-y-3 w-full max-w-xs mx-auto">
        <button onClick={() => navigate("/m/kemedar/match/setup")}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl">⚙️ Expand preferences</button>
        <button onClick={onReset}
          className="w-full border border-white/20 text-white/80 font-bold py-3 rounded-xl">↩ Reset & Start Over</button>
        <Link to="/m/kemedar/match/history"
          className="block w-full border border-white/10 text-white/50 font-bold py-3 rounded-xl text-center">🎉 View my matches</Link>
      </div>
    </div>
  );
}