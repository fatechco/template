import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RefreshCw, TrendingUp, MapPin, Star } from "lucide-react";

function KPICard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} text-lg`}>{icon}</span>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}

export default function LifeScoreOverview() {
  const [scores, setScores] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, r, d] = await Promise.all([
        base44.entities.NeighborhoodLifeScore.list("-overallLifeScore", 200),
        base44.entities.LifeScoreReview.filter({ isApproved: false }),
        base44.entities.LifeScoreDataPoint.filter({ isActive: true })
      ]);
      setScores(s);
      setReviews(r);
      setDataPoints(d);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Life Score overview...</div>;
  }

  const published = scores.filter(s => s.isPublished);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + (s.overallLifeScore || 0), 0) / scores.length) : 0;
  const lowest = [...scores].sort((a, b) => (a.overallLifeScore || 0) - (b.overallLifeScore || 0)).slice(0, 5);
  const highest = [...scores].sort((a, b) => (b.overallLifeScore || 0) - (a.overallLifeScore || 0)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🏙️ Life Score™ Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Neighborhood Intelligence System</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Areas Scored" value={scores.length} icon="📍" color="bg-purple-100" />
        <KPICard label="Published" value={published.length} icon="✅" color="bg-green-100" />
        <KPICard label="Avg Life Score" value={`${avgScore}/100`} icon="🌟" color="bg-orange-100" />
        <KPICard label="Pending Reviews" value={reviews.length} icon="📝" color="bg-yellow-100" />
      </div>

      {/* Top and Bottom Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lowest Scoring */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-black text-gray-900 mb-4">📉 Lowest Scoring Areas</h3>
          <div className="space-y-3">
            {lowest.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{s.displayName}</p>
                  <p className="text-xs text-gray-400">{s.overallGrade}</p>
                </div>
                <span className="text-lg font-black text-red-500">{Math.round(s.overallLifeScore || 0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Scoring */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-black text-gray-900 mb-4">🏆 Top Scoring Areas</h3>
          <div className="space-y-3">
            {highest.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{s.displayName}</p>
                  <p className="text-xs text-gray-400">{s.overallGrade}</p>
                </div>
                <span className="text-lg font-black text-green-600">{Math.round(s.overallLifeScore || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}