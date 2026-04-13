import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Trash2, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmt(n) {
  return n ? Number(n).toLocaleString() : "0";
}

function EstimateCard({ estimate, onDelete }) {
  const property = estimate.propertyId ? { title: estimate.propertyId } : null;
  const tierColors = {
    Economy: "bg-yellow-100 text-yellow-700",
    Standard: "bg-blue-100 text-blue-700",
    Premium: "bg-purple-100 text-purple-700",
    Luxury: "bg-amber-100 text-amber-700",
  };

  const styleEmojis = {
    Modern: "🛋️",
    Classic: "🏛️",
    Minimalist: "🌿",
    Industrial: "🏭",
    Bohemian: "🎨",
  };

  const createdDate = estimate.created_date ? new Date(estimate.created_date).toLocaleDateString() : "—";
  const daysLeft = estimate.expiresAt
    ? Math.ceil((new Date(estimate.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-purple-100 to-gray-50 flex items-center justify-center">
        <span className="text-5xl">{styleEmojis[estimate.desiredStyle] || "✨"}</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">Property</p>
        <p className="font-bold text-gray-900 text-sm mb-2 truncate">{property?.title || estimate.propertyId}</p>

        <div className="flex gap-2 mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tierColors[estimate.desiredTier] || tierColors.Standard}`}>
            {estimate.desiredTier}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
            {estimate.desiredStyle}
          </span>
        </div>

        <p className="text-lg font-black text-purple-600 mb-1">
          {fmt(estimate.estimatedTotalMin)} — {fmt(estimate.estimatedTotalMax)} EGP
        </p>
        <p className="text-xs text-gray-400 mb-3">
          {estimate.estimatedWeeksMin}–{estimate.estimatedWeeksMax} weeks timeline
        </p>

        {daysLeft !== null && (
          <p className={`text-xs font-semibold mb-3 ${daysLeft > 10 ? "text-green-600" : daysLeft > 0 ? "text-amber-600" : "text-red-600"}`}>
            {daysLeft > 0 ? `Expires in ${daysLeft} days` : "Expired"}
          </p>
        )}

        <p className="text-xs text-gray-400 mb-3">Created {createdDate}</p>

        <div className="flex gap-2">
          <Link to={`/dashboard/estimates/${estimate.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-xs transition-colors">
            <Eye size={13} /> View
          </Link>
          <button onClick={() => onDelete(estimate.id)} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold py-2 px-3 rounded-lg text-xs transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyFinishingEstimates() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (me?.id) {
          const ests = await base44.entities.FinishingSimulation.filter({ userId: me.id }, "-created_date", 100);
          setEstimates(ests);
        }
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this estimate? You can always regenerate it.")) {
      await base44.entities.FinishingSimulation.delete(id);
      setEstimates(ests => ests.filter(e => e.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Finishing Estimates</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your AI-generated property finishing calculations.</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {estimates.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-black text-gray-900 text-lg mb-1">No estimates yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Visit any unfinished property and click "Calculate Finishing Cost" to generate your first estimate.
          </p>
          <Link to="/search-properties" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors">
            🔍 Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estimates.map(est => (
            <EstimateCard key={est.id} estimate={est} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}