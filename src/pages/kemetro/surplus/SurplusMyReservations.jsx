import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, QrCode, MessageCircle, Star, RefreshCw, X } from "lucide-react";

const STATUS_COLORS = {
  reserved: "bg-amber-100 text-amber-700",
  sold: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
  expired: "bg-red-100 text-red-400",
};

function Countdown({ expiresAt }) {
  const [diff, setDiff] = useState(Math.max(0, new Date(expiresAt) - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setDiff(d => Math.max(0, d - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  if (diff === 0) return <span className="text-red-500 font-bold text-xs">⚠️ Expired</span>;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return (
    <span className={`font-bold text-xs ${h < 2 ? "text-orange-500" : "text-gray-600"}`}>
      Pick up before: {new Date(expiresAt).toLocaleString("en-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} ({h}h {m}m left)
    </span>
  );
}

function ReservationRow({ item, transaction, onCancel }) {
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    await base44.functions.invoke("cancelSurplusReservation", { surplusItemId: item.id });
    onCancel(item.id);
    setCancelling(false);
  };

  const statusLabel = item.status === "reserved" ? "reserved"
    : item.status === "sold" ? "completed"
    : item.status;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <img
          src={item.primaryImageUrl || item.images?.[0] || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=70"}
          alt=""
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.title}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize ${STATUS_COLORS[item.status] || "bg-gray-100 text-gray-500"}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-green-700 font-bold text-sm mb-2">{Number(item.surplusPriceEGP).toLocaleString()} EGP</p>

          {item.status === "reserved" && item.reservationExpiryAt && (
            <div className="mb-3">
              <Countdown expiresAt={item.reservationExpiryAt} />
            </div>
          )}

          {item.status === "reserved" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/kemetro/surplus/reservation/${item.id}`)}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors"
              >
                <QrCode size={13} /> 📱 Show My QR Code
              </button>
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                <MessageCircle size={12} /> Chat with Seller
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
              >
                <X size={12} /> Cancel
              </button>
            </div>
          )}

          {item.status === "sold" && (
            <div className="flex gap-2 mt-1">
              <button className="flex items-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors">
                <Star size={12} /> Leave a Review
              </button>
              <Link
                to="/kemetro/surplus"
                className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
              >
                <RefreshCw size={12} /> Buy Again?
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirm */}
      {showConfirm && (
        <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-sm font-bold text-red-800 mb-1">Cancel this reservation?</p>
          <p className="text-xs text-red-600 mb-3">
            Your {Number(item.surplusPriceEGP).toLocaleString()} EGP will be refunded to your XeedWallet immediately.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50">
              Keep It
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {cancelling ? "Cancelling…" : "Yes, Cancel"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { key: "reserved", label: "Active Reservations" },
  { key: "sold", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function SurplusMyReservations() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("reserved");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const user = await base44.auth.me();
      const txns = await base44.entities.SurplusTransaction.filter({ buyerUserId: user.id }, "-created_date", 50);
      setTransactions(txns || []);
      const itemIds = [...new Set((txns || []).map(t => t.surplusItemId))];
      const fetched = await Promise.all(
        itemIds.map(id => base44.entities.SurplusItem.filter({ id }, "-created_date", 1).then(r => r?.[0]).catch(() => null))
      );
      setItems(fetched.filter(Boolean));
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "cancelled" } : i));
  };

  const filtered = items.filter(i => {
    if (tab === "cancelled") return i.status === "cancelled" || i.status === "expired";
    return i.status === tab;
  });

  const counts = {
    reserved: items.filter(i => i.status === "reserved").length,
    sold: items.filter(i => i.status === "sold").length,
    cancelled: items.filter(i => i.status === "cancelled" || i.status === "expired").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8FAF8" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="font-black text-gray-900 text-base">My Reservations</h1>
          <p className="text-xs text-gray-500">Surplus & Salvage</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                tab === t.key ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label} {counts[t.key] > 0 && (
                <span className={`ml-1 ${tab === t.key ? "text-green-200" : "text-gray-400"}`}>({counts[t.key]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🛒</p>
            <p className="font-bold text-gray-700 mb-1">No {TABS.find(t => t.key === tab)?.label.toLowerCase()}</p>
            {tab === "reserved" && (
              <Link to="/kemetro/surplus" className="text-green-600 font-bold text-sm hover:underline">
                → Browse the marketplace
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <ReservationRow
                key={item.id}
                item={item}
                transaction={transactions.find(t => t.surplusItemId === item.id)}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}