import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const GRADE_CONFIG = {
  Platinum: { icon: "💎", gradient: "from-yellow-900 to-yellow-700", badge: "bg-yellow-800 text-yellow-100" },
  Gold:     { icon: "🥇", gradient: "from-yellow-600 to-amber-500",  badge: "bg-yellow-500 text-white" },
  Silver:   { icon: "🥈", gradient: "from-gray-500 to-gray-400",     badge: "bg-gray-400 text-white" },
  Bronze:   { icon: "🥉", gradient: "from-orange-800 to-orange-600", badge: "bg-orange-700 text-white" },
  Starter:  { icon: "⭐", gradient: "from-gray-600 to-gray-500",     badge: "bg-gray-500 text-white" },
  Restricted: { icon: "⚠️", gradient: "from-red-800 to-red-600",    badge: "bg-red-600 text-white" },
};

export default function ScorePublicView() {
  const { shareToken } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.functions.invoke("getSharedScore", { shareToken })
      .then(res => {
        if (res.data?.success) setData(res.data);
        else setError(res.data?.error || "Not found");
      })
      .catch(() => setError("Unable to load score"))
      .finally(() => setLoading(false));
  }, [shareToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-xl font-black text-gray-900 mb-2">Score Not Available</h2>
        <p className="text-gray-500 mb-5">{error}</p>
        <Link to="/" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-400">
          Go to Kemedar
        </Link>
      </div>
    </div>
  );

  const { score, user, shareRequest, earnedBadges } = data;
  const grade = score?.overallGrade || "Starter";
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG.Starter;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/">
          <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
            alt="Kemedar" className="h-8 w-auto object-contain" />
        </Link>
        <span className="font-black text-gray-700 text-lg">Score™</span>
      </div>

      {/* Certificate card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Gradient top */}
        <div className={`bg-gradient-to-br ${cfg.gradient} p-8 text-white text-center`}>
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">KEMEDAR SCORE™ CERTIFICATE</p>
          <div className="text-7xl mb-3">{cfg.icon}</div>
          <p className="text-white/70 text-sm mb-1">This certifies that</p>
          <p className="font-black text-3xl mb-1">{user?.firstName}</p>
          <p className="text-white/70 text-sm mb-3">has achieved</p>
          <p className="text-6xl font-black">{score?.overallScore}<span className="text-3xl text-white/60"> / 1000</span></p>
          <span className={`inline-block mt-3 font-black text-xl px-5 py-2 rounded-full ${cfg.badge}`}>
            {grade.toUpperCase()}
          </span>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Dimensions shown */}
          <div className="space-y-2">
            {shareRequest.dimensionsShared?.includes("verificationLevel") && score?.verificationLevel != null && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">✅ Identity Verified</span>
                <span className="text-sm font-bold text-gray-900">{score.verificationLevel}/250</span>
              </div>
            )}
            {shareRequest.dimensionsShared?.includes("buyerScore") && score?.buyerScore != null && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">🏠 Buyer Score</span>
                <span className="text-sm font-bold text-gray-900">{score.buyerScore}/1000</span>
              </div>
            )}
            {shareRequest.dimensionsShared?.includes("transactionHistory") && score?.transactionHistory != null && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">🤝 Transactions</span>
                <span className="text-sm font-bold text-gray-900">{score.transactionHistory}/300</span>
              </div>
            )}
            {shareRequest.dimensionsShared?.includes("earnedBadges") && earnedBadges?.length > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">🏅 Badges Earned</span>
                <span className="text-sm font-bold text-gray-900">{earnedBadges.length} badges</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">🗓️ Member Since</span>
              <span className="text-sm font-bold text-gray-900">{user?.memberSince}</span>
            </div>
          </div>

          {/* Issued */}
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">Verified by Kemedar™</p>
            <p className="text-xs text-gray-400 mt-0.5">Generated: {new Date(shareRequest?.expiresAt ? new Date(shareRequest.expiresAt).getTime() - 30 * 24 * 60 * 60 * 1000 : Date.now()).toLocaleDateString()}</p>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            This score reflects the user's Kemedar platform history and verification level.
            It does not constitute a financial credit score or guarantee of any kind.
          </p>

          <div className="flex gap-3">
            <Link to="/search-properties" className="flex-1 text-center text-xs bg-orange-500 text-white font-bold py-2.5 rounded-xl hover:bg-orange-400">
              🏠 View Properties
            </Link>
            <Link to="/kemedar/expat/setup" className="flex-1 text-center text-xs border-2 border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">
              Join Kemedar
            </Link>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">© {new Date().getFullYear()} Kemedar™. All rights reserved.</p>
    </div>
  );
}