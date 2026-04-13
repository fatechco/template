import { useState, useEffect } from "react";
import { Eye, Star, X, Loader, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CFG = {
  pending:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700",  dot: "bg-yellow-500" },
  confirmed:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700",      dot: "bg-blue-500" },
  assigned:    { label: "Assigned",    color: "bg-orange-100 text-orange-700",  dot: "bg-orange-500" },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-700",  dot: "bg-purple-500" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700",    dot: "bg-green-500" },
  cancelled:   { label: "Cancelled",   color: "bg-red-100 text-red-500",        dot: "bg-red-400" },
  refunded:    { label: "Refunded",    color: "bg-gray-100 text-gray-500",      dot: "bg-gray-400" },
};

function RatingStars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange && onChange(n)}>
          <Star size={20} className={n <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
        </button>
      ))}
    </div>
  );
}

function OrderDetailModal({ order, service, franchiseUser, activities, onClose, onRated, onCancelled }) {
  const [rating, setRating] = useState(order.rating || 0);
  const [reviewText, setReviewText] = useState(order.reviewText || "");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusCfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
  const canCancel = ["pending", "confirmed"].includes(order.status);
  const canRate = order.status === "completed" && !order.rating;
  const showRateForm = canRate;

  const handleRate = async () => {
    setSubmittingRating(true);
    await base44.entities.ServiceOrder.update(order.id, { rating, reviewText });
    setSubmittingRating(false);
    onRated();
  };

  const handleCancel = async () => {
    setCancelling(true);
    await base44.entities.ServiceOrder.update(order.id, { status: "cancelled" });
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: order.id,
      actorRole: "buyer",
      action: "cancelled",
      description: "Cancelled by buyer.",
    });
    setCancelling(false);
    onCancelled();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900">Order #{order.orderCode || order.id.slice(-6)}</h2>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
            </span>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "Service", value: service?.name || "—" },
              { label: "Total Price", value: <span className="font-black text-orange-600">${order.totalPrice || 0}</span> },
              { label: "Ordered On", value: order.created_date ? new Date(order.created_date).toLocaleDateString() : "—" },
              { label: "Assigned Date", value: order.assignedDate || "—" },
              ...(order.completedDate ? [{ label: "Completed On", value: order.completedDate }] : []),
              ...(order.relatedEntityType ? [{ label: "Related", value: `${order.relatedEntityType}: ${order.relatedEntityId}` }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400 text-[10px] font-semibold mb-0.5">{label}</p>
                <div className="font-bold text-gray-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Buyer Notes */}
          {order.buyerNotes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs">
              <p className="font-bold text-yellow-800 mb-1">Your Notes</p>
              <p className="text-gray-700">{order.buyerNotes}</p>
            </div>
          )}

          {/* Franchise Owner Contact */}
          {franchiseUser && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <p className="text-[10px] font-black text-blue-700 uppercase mb-2">Service Provider</p>
              <p className="font-bold text-gray-900 text-sm">{franchiseUser.full_name}</p>
              <p className="text-xs text-gray-500">{franchiseUser.email}</p>
            </div>
          )}

          {/* Franchise Notes */}
          {order.franchiseNotes && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs">
              <p className="font-bold text-green-800 mb-1">Provider Notes</p>
              <p className="text-gray-700">{order.franchiseNotes}</p>
            </div>
          )}

          {/* Rating (existing) */}
          {order.rating > 0 && !showRateForm && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              <p className="text-[10px] font-black text-yellow-700 uppercase mb-2">Your Rating</p>
              <RatingStars value={order.rating} />
              {order.reviewText && <p className="text-xs text-gray-600 mt-2">{order.reviewText}</p>}
            </div>
          )}

          {/* Rate Form */}
          {showRateForm && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-black text-gray-800">Rate this service</p>
              <RatingStars value={rating} onChange={setRating} />
              <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience…" rows={3}
                className="w-full border border-yellow-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none resize-none" />
              <button onClick={handleRate} disabled={submittingRating || rating === 0}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-4 py-2 rounded-lg text-xs disabled:opacity-40 flex items-center gap-1.5">
                {submittingRating ? <Loader size={10} className="animate-spin" /> : <Star size={10} />} Submit Rating
              </button>
            </div>
          )}

          {/* Activity Timeline */}
          {activities.length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-500 uppercase mb-2">Activity Timeline</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-700 capitalize">{a.action?.replace(/_/g, " ")}</span>
                      {a.description && <span className="text-gray-500 ml-1">— {a.description}</span>}
                      <p className="text-gray-400 text-[10px]">{a.created_date ? new Date(a.created_date).toLocaleString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancel */}
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2">
              {cancelling ? <Loader size={13} className="animate-spin" /> : <AlertCircle size={13} />} Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
  }, []);

  const fetchAll = () => {
    if (!me) return;
    setLoading(true);
    Promise.all([
      base44.entities.ServiceOrder.filter({ buyerId: me.id }),
      base44.entities.PaidService.list(),
      base44.entities.User.list(),
    ]).then(([ords, svcs, usrs]) => {
      setOrders(ords.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setServices(svcs);
      setUsers(usrs);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [me]);

  const openOrder = async (order) => {
    setViewOrder(order);
    if (!activities[order.id]) {
      const acts = await base44.entities.ServiceOrderActivity.filter({ serviceOrderId: order.id }).catch(() => []);
      setActivities(prev => ({ ...prev, [order.id]: acts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)) }));
    }
  };

  const serviceById = Object.fromEntries(services.map(s => [s.id, s]));
  const userById = Object.fromEntries(users.map(u => [u.id, u]));

  const kpis = [
    { icon: "📦", label: "Total Orders", value: orders.length, bg: "bg-gray-50", color: "text-gray-900" },
    { icon: "🔄", label: "In Progress", value: orders.filter(o => o.status === "in_progress").length, bg: "bg-purple-50", color: "text-purple-600" },
    { icon: "✅", label: "Completed", value: orders.filter(o => o.status === "completed").length, bg: "bg-green-50", color: "text-green-600" },
    { icon: "⭐", label: "Rated", value: orders.filter(o => o.rating > 0).length, bg: "bg-yellow-50", color: "text-yellow-700" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Service Orders</h1>
        <p className="text-gray-500 text-sm">{orders.length} orders total</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-white shadow-sm`}>
            <div className="text-2xl mb-1">{k.icon}</div>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-3xl mb-3">📦</p>
            <p className="font-semibold">No orders yet</p>
            <a href="/dashboard/premium-services" className="inline-block mt-3 text-orange-500 font-bold text-sm hover:underline">Browse Services →</a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order","Service","Status","Price","Date","Provider","Rating","Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => {
                  const svc = serviceById[order.serviceId];
                  const provider = userById[order.franchiseOwnerId];
                  const statusCfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
                  const canCancel = ["pending", "confirmed"].includes(order.status);
                  const canRate = order.status === "completed" && !order.rating;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 font-mono font-black text-gray-700 text-[10px]">{order.orderCode || order.id.slice(-6)}</td>
                      <td className="px-3 py-3 font-bold text-gray-800 max-w-[120px] truncate">{svc?.name || "—"}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-black text-orange-600">${order.totalPrice || 0}</td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                        {order.created_date ? new Date(order.created_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-3 py-3 text-gray-500">{provider?.full_name || "—"}</td>
                      <td className="px-3 py-3">
                        {order.rating > 0 ? (
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} size={11} className={n <= order.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />)}</div>
                        ) : canRate ? (
                          <span className="text-[10px] text-orange-500 font-bold cursor-pointer hover:underline" onClick={() => openOrder(order)}>Rate ⭐</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => openOrder(order)} title="View Details"
                            className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                          {canCancel && (
                            <button onClick={() => openOrder(order)} title="Cancel"
                              className="p-1.5 hover:bg-red-50 text-red-500 rounded"><AlertCircle size={13} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewOrder && (
        <OrderDetailModal
          order={viewOrder}
          service={serviceById[viewOrder.serviceId]}
          franchiseUser={userById[viewOrder.franchiseOwnerId]}
          activities={activities[viewOrder.id] || []}
          onClose={() => setViewOrder(null)}
          onRated={() => { fetchAll(); setViewOrder(null); }}
          onCancelled={() => { fetchAll(); setViewOrder(null); }}
        />
      )}
    </div>
  );
}