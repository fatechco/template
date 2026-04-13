import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, Bell, RotateCcw, X, Star, Heart, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SwipeCard from "@/components/match/SwipeCard";
import MatchCelebration from "@/components/match/MatchCelebration";
import MatchSidebar from "@/components/match/MatchSidebar";

const MOCK_PROPERTIES = [
  { id: "m1", title: "Luxury Apartment New Cairo", price_amount: 2100000, currency: "EGP", beds: 3, baths: 2, area_size: 150, floor_number: 5, city_name: "New Cairo", district_name: "5th Settlement", image_gallery: ["https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"], is_verified: true, description: "Stunning apartment with lake views and premium finishes throughout. Perfect for families or investors." },
  { id: "m2", title: "Modern Villa Sheikh Zayed", price_amount: 8500000, currency: "EGP", beds: 5, baths: 4, area_size: 450, floor_number: 1, city_name: "Sheikh Zayed", district_name: "Beverly Hills", image_gallery: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80"], description: "Spacious villa with private pool and lush garden in a gated compound." },
  { id: "m3", title: "Cozy Studio Maadi", price_amount: 850000, currency: "EGP", beds: 1, baths: 1, area_size: 55, floor_number: 3, city_name: "Maadi", district_name: "Maadi", image_gallery: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], description: "Charming studio in leafy Maadi, close to metro and international schools." },
  { id: "m4", title: "Family Townhouse 6th October", price_amount: 3200000, currency: "EGP", beds: 4, baths: 3, area_size: 280, city_name: "6th October", district_name: "Al Motamayez", image_gallery: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"], description: "Spacious townhouse in quiet compound with community park and clubhouse." },
  { id: "m5", title: "Penthouse Heliopolis", price_amount: 5600000, currency: "EGP", beds: 4, baths: 3, area_size: 320, floor_number: 12, city_name: "Heliopolis", district_name: "Roxy", image_gallery: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"], description: "Top-floor penthouse with panoramic city views and private roof terrace." },
  { id: "m6", title: "Waterfront Apartment North Coast", price_amount: 1800000, currency: "EGP", beds: 2, baths: 2, area_size: 120, city_name: "North Coast", district_name: "Sahel", image_gallery: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80"], description: "Beachfront apartment with direct sea access and resort amenities." },
  { id: "m7", title: "Classic Apartment Zamalek", price_amount: 4200000, currency: "EGP", beds: 3, baths: 2, area_size: 200, floor_number: 4, city_name: "Zamalek", district_name: "Zamalek", image_gallery: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80"], description: "Elegant pre-war building with high ceilings and Nile glimpses." },
];

const MATCH_SCORES = [87, 92, 74, 88, 95, 82, 79];

export default function KemedarMatch() {
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
  const [swiping, setSwiping] = useState(false); // prevent double-swipe
  const startTime = useRef(Date.now());

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);

        // Check for existing profile
        const profiles = await base44.entities.MatchProfile.filter({ userId: me.id, isActive: true });
        if (!profiles.length) {
          navigate("/kemedar/match/setup");
          return;
        }
        const profile = profiles[0];
        setMatchProfile(profile);

        // Load existing matches count for badge
        const existingMatches = await base44.entities.PropertyMatch.filter({ buyerId: me.id, status: "matched" });
        setMatchCount(existingMatches.length);

        // Get already-swiped IDs to exclude
        const swipes = await base44.entities.PropertySwipe.filter({ userId: me.id });
        const swipedIds = new Set(swipes.map(s => s.propertyId));

        // Try to load from generated queue first
        let loaded = false;
        const queueData = await base44.entities.MatchQueue.filter({ userId: me.id, isActive: true });
        if (queueData.length) {
          const q = queueData[0];
          const isExpired = q.expiresAt && new Date(q.expiresAt) < new Date();
          if (!isExpired && q.propertyIds?.length > 0) {
            // Fetch unswiped properties from queue
            const allProps = await base44.entities.Property.filter({ status: "active" }, "-created_date", 100);
            const filtered = allProps.filter(p => q.propertyIds.includes(p.id) && !swipedIds.has(p.id));
            if (filtered.length >= 3) {
              setQueue(filtered);
              loaded = true;
            }
          }
        }

        if (!loaded) {
          // Fallback: load real properties filtered by profile, excluding swiped
          const allProps = await base44.entities.Property.filter({ status: "active" }, "-created_date", 100);
          const filtered = allProps.filter(p => !swipedIds.has(p.id) && p.created_by !== me.id);
          if (filtered.length >= 3) {
            setQueue(filtered);
          } else {
            // Use mock + real mixed
            const realUnswiped = allProps.filter(p => !swipedIds.has(p.id)).slice(0, 5);
            setQueue([...realUnswiped, ...MOCK_PROPERTIES]);
          }
        }
      } catch (err) {
        // Auth failed or network error — use mock
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

    if (action === "super_like" && superLikesLeft <= 0) {
      setSwiping(false);
      return;
    }
    if (action === "super_like") setSuperLikesLeft(prev => prev - 1);

    const duration = Math.round((Date.now() - startTime.current) / 1000);
    startTime.current = Date.now();

    setHistoryStack(prev => [...prev, { idx: currentIdx, property }]);

    // Advance card immediately for responsive feel
    setCurrentIdx(prev => prev + 1);
    setSwiping(false);

    // Record swipe in background
    if (user && matchProfile) {
      const result = await base44.functions.invoke("recordSwipe", {
        propertyId: property.id,
        action,
        matchProfileId: matchProfile.id,
        viewDuration: duration
      }).catch(() => null);

      const isMatch = result?.data?.isMatch;
      if (isMatch) {
        // Show celebration — step back index temporarily so card is still "visible" in bg
        setCelebration({ match: result?.data?.match, property });
        setMatchCount(prev => prev + 1);
      }
    }
  }, [swiping, superLikesLeft, currentIdx, user, matchProfile]);

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    setHistoryStack(prev => prev.slice(0, -1));
    setCurrentIdx(prev => Math.max(0, prev - 1));
  };

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-pulse">💘</div>
        <p className="font-bold text-xl">Loading your queue...</p>
        <p className="text-white/40 text-sm mt-2">AI is picking the best matches for you</p>
      </div>
    </div>
  );

  const isEmpty = currentIdx >= queue.length;

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col overflow-hidden">
      {/* Match celebration overlay */}
      {celebration && (
        <MatchCelebration
          match={celebration.match}
          property={celebration.property}
          onDismiss={() => setCelebration(null)}
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <Link to="/kemedar/match/setup" className="text-white/60 hover:text-white transition-colors" title="Change preferences">
          <Settings className="w-5 h-5" />
        </Link>

        <div className="text-center">
          <h1 className="text-white font-black text-xl">💘 Kemedar Match™</h1>
          {matchProfile && (
            <p className="text-white/40 text-[11px]">
              {matchProfile.budgetMin ? `${(matchProfile.budgetMin/1000000).toFixed(1)}M` : "Any"} – {matchProfile.budgetMax ? `${(matchProfile.budgetMax/1000000).toFixed(1)}M` : "Any"} EGP
              {matchProfile.preferredCityIds?.length > 0 ? ` · ${matchProfile.preferredCityIds.slice(0,2).join(", ")}` : ""}
            </p>
          )}
        </div>

        <Link to="/kemedar/match/history" className="relative text-white/60 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          {matchCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-[9px] font-black text-white">
              {matchCount > 9 ? "9+" : matchCount}
            </span>
          )}
        </Link>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 gap-4 px-4 min-h-0">
        {/* Card stack */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">
          {isEmpty ? (
            <EmptyState onReset={() => setCurrentIdx(0)} />
          ) : (
            <div className="relative" style={{ width: 420, height: 580, maxWidth: "calc(100vw - 2rem)" }}>
              {nnProperty && (
                <SwipeCard
                  property={nnProperty}
                  matchScore={MATCH_SCORES[(currentIdx + 2) % MATCH_SCORES.length]}
                  isTop={false}
                  style={{ width: "100%", height: "100%", top: 16, left: 0, transform: "scale(0.94)", zIndex: 1 }}
                />
              )}
              {nextProperty && (
                <SwipeCard
                  property={nextProperty}
                  matchScore={MATCH_SCORES[(currentIdx + 1) % MATCH_SCORES.length]}
                  isTop={false}
                  style={{ width: "100%", height: "100%", top: 8, left: 0, transform: "scale(0.97)", zIndex: 2 }}
                />
              )}
              {currentProperty && (
                <SwipeCard
                  key={currentProperty.id}
                  property={currentProperty}
                  matchScore={MATCH_SCORES[currentIdx % MATCH_SCORES.length]}
                  isTop={true}
                  onSwipe={handleSwipe}
                  style={{ width: "100%", height: "100%", top: 0, left: 0, zIndex: 3 }}
                />
              )}
            </div>
          )}

          {/* Progress indicator */}
          {!isEmpty && (
            <p className="text-white/30 text-xs mt-4">
              {currentIdx + 1} of {queue.length} properties
            </p>
          )}
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden lg:flex w-80 flex-shrink-0 py-2">
          <MatchSidebar userId={user?.id} matchCount={matchCount} />
        </div>
      </div>

      {/* Action buttons */}
      {!isEmpty && (
        <div className="flex items-end justify-center gap-3 pb-6 pt-3 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Undo</span>
            <button
              onClick={handleUndo}
              disabled={historyStack.length === 0}
              className="w-11 h-11 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-full flex items-center justify-center transition-all border border-white/20"
            >
              <RotateCcw className="w-4 h-4 text-white/70" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Pass</span>
            <button
              onClick={() => handleSwipe("pass", currentProperty)}
              className="w-14 h-14 bg-red-500 hover:bg-red-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 transition-all"
            >
              <X className="w-7 h-7 text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">{superLikesLeft}/5</span>
            <button
              onClick={() => handleSwipe("super_like", currentProperty)}
              disabled={superLikesLeft <= 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${superLikesLeft > 0 ? "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30 hover:scale-110" : "bg-white/10 cursor-not-allowed"}`}
            >
              <Star className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Like</span>
            <button
              onClick={() => handleSwipe("like", currentProperty)}
              className="w-14 h-14 bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all"
            >
              <Heart className="w-7 h-7 text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white/30 text-[9px]">Details</span>
            <button
              className="w-11 h-11 bg-blue-500/20 hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-all border border-blue-400/30"
            >
              <Info className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }) {
  const navigate = useNavigate();
  return (
    <div className="text-center text-white px-8">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-black mb-2">You've been thorough!</h2>
      <p className="text-white/60 mb-8 text-sm">No more properties match your current filters</p>
      <div className="space-y-3 w-full max-w-xs">
        <button onClick={() => navigate("/kemedar/match/setup")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
          ⚙️ Expand preferences
        </button>
        <button onClick={onReset}
          className="w-full border border-white/20 hover:border-white/40 text-white/80 font-bold py-3 rounded-xl transition-colors">
          ↩ Reset & Start Over
        </button>
        <Link to="/kemedar/match/history"
          className="block w-full border border-white/10 text-white/50 font-bold py-3 rounded-xl text-center">
          🎉 View my matches
        </Link>
      </div>
    </div>
  );
}