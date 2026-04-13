import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SwipeCardStack from "@/components/swap/mobile/SwipeCardStack";
import SwapMatchAnimation from "@/components/swap/SwapMatchAnimation";
import { Settings, ArrowLeft } from "lucide-react";

export default function MobileSwapPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchAnimation, setMatchAnimation] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      loadMatches(u);
    }).catch(() => setLoading(false));
  }, []);

  const loadMatches = async (u) => {
    setLoading(true);
    try {
      const [asA, asB] = await Promise.all([
        base44.entities.SwapMatch.filter({ userAId: u.id }, "-matchScore", 30),
        base44.entities.SwapMatch.filter({ userBId: u.id }, "-matchScore", 30),
      ]);
      const all = [...(asA || []), ...(asB || [])].filter(m =>
        ["suggested", "a_seen", "b_seen", "a_interested", "b_interested"].includes(m.status)
      );
      // Sort by matchScore desc
      all.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      setMatches(all);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const showToast = (msg, duration = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  const handleInterest = async (match) => {
    try {
      const res = await base44.functions.invoke("expressInterest", { matchId: match.id });
      const updated = res?.data;
      if (updated?.status === "both_interested") {
        setMatchAnimation({ ...match, status: "both_interested" });
      } else {
        showToast("✅ Interest sent! We'll notify you if they're interested too.");
      }
    } catch (e) {
      showToast("Something went wrong. Try again.");
    }
  };

  const handlePass = async (match) => {
    try {
      await base44.functions.invoke("passOnMatch", { matchId: match.id });
    } catch (_) {}
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4" style={{ animation: "spin 2s linear infinite", display: "inline-block" }}>🔄</div>
          <p className="text-white font-bold text-lg">Finding your matches...</p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0A1628" }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-safe" style={{ paddingTop: "env(safe-area-inset-top, 16px)", height: 56, flexShrink: 0 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center text-white/70">
          <ArrowLeft size={22} />
        </button>
        <span className="text-white font-black text-[17px]">Kemedar Swap™</span>
        <button
          onClick={() => navigate("/dashboard/swap/intent")}
          className="w-9 h-9 flex items-center justify-center text-white/70"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Match counter */}
      <div className="text-center py-1.5 flex-shrink-0">
        <span className="text-[13px] font-bold" style={{ color: "#A78BFA" }}>
          {matches.length} swap match{matches.length !== 1 ? "es" : ""} waiting
        </span>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative overflow-hidden px-4 pb-2">
        <SwipeCardStack
          matches={matches}
          userId={user?.id}
          onInterest={handleInterest}
          onPass={handlePass}
          onBothInterested={(match) => setMatchAnimation(match)}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="absolute left-4 right-4 bottom-28 bg-white rounded-2xl px-4 py-3 shadow-xl text-center text-sm font-bold text-gray-900 z-50"
          style={{ animation: "fadeUp 0.3s ease" }}
        >
          {toast}
        </div>
      )}

      {/* Match animation */}
      {matchAnimation && (
        <SwapMatchAnimation
          match={matchAnimation}
          userId={user?.id}
          onClose={() => setMatchAnimation(null)}
        />
      )}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}