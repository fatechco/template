import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, Eye, Edit2, Clock, CheckCircle, XCircle, BarChart3 } from "lucide-react";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600", icon: Clock },
  pending_approval: { label: "Pending Review", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  active: { label: "Live", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
  archived: { label: "Archived", color: "bg-gray-100 text-gray-500", icon: Clock },
};

export default function KemeKitsMyKits() {
  const navigate = useNavigate();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.KemeKitTemplate.filter({ creatorId: u.id }, "-created_date", 50)
        .then(setKits)
        .finally(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, []);

  const totalGMV = kits.reduce((s, k) => s + (k.totalGMVEGP || 0), 0);
  const totalCommissions = kits.reduce((s, k) => s + (k.totalCommissionsEarnedEGP || 0), 0);
  const totalCalcs = kits.reduce((s, k) => s + (k.totalCalculationsRun || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">🎨 My KemeKits</h1>
          <p className="text-sm text-gray-500 mt-0.5">Design room kits and earn Kemecoins on every sale</p>
        </div>
        <Link
          to="/kemework/pro/kemekits/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} /> Create New Kit
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Stats */}
        {kits.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total GMV", value: `${totalGMV.toLocaleString()} EGP`, icon: "💰" },
              { label: "Commissions Earned", value: `${totalCommissions.toLocaleString()} EGP`, icon: "🎁" },
              { label: "Calculations Run", value: totalCalcs.toLocaleString(), icon: "📐" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Kit List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : kits.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 p-12 text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Create your first KemeKit</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Design curated room kits with Kemetro products and earn Kemecoins automatically on every sale.
            </p>
            <Link
              to="/kemework/pro/kemekits/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} /> Create My First Kit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {kits.map(kit => {
              const status = STATUS_CONFIG[kit.status] || STATUS_CONFIG.draft;
              const StatusIcon = status.icon;
              return (
                <div key={kit.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                  {kit.heroImageUrl ? (
                    <img src={kit.heroImageUrl} alt={kit.title} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 text-2xl">🛁</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{kit.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                        <StatusIcon size={10} />{status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{kit.roomType} · {kit.styleCategory} · {kit.budgetTier}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                      <span>📐 {kit.totalCalculationsRun || 0} calcs</span>
                      <span>🛒 {kit.totalCartsGenerated || 0} carts</span>
                      <span>💰 {(kit.totalCommissionsEarnedEGP || 0).toLocaleString()} EGP earned</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/kemework/pro/kemekits/${kit.id}/edit`}
                      className="flex items-center gap-1.5 text-xs font-bold border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={12} /> Edit
                    </Link>
                    {kit.status === 'active' && (
                      <Link
                        to={`/kemetro/kemekits/${kit.slug}`}
                        className="flex items-center gap-1.5 text-xs font-bold border border-blue-200 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={12} /> View
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}