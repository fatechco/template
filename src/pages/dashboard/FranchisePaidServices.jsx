import { useState, useEffect, useMemo } from "react";
import { Eye, CheckCircle, X, Plus, FileText, Star, Loader } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  pending:     { label: "New",         color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  confirmed:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  assigned:    { label: "Assigned",    color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  in_progress: { label: "In Progress", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  completed:   { label: "Completed",   color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  cancelled:   { label: "Cancelled",   color: "bg-red-100 text-red-500",       dot: "bg-red-400" },
  on_hold:     { label: "On Hold",     color: "bg-gray-100 text-gray-500",     dot: "bg-gray-400" },
};

const avatarBg = ["bg-orange-500","bg-blue-500","bg-teal-500","bg-purple-500","bg-red-500"];
const colorFor = (id) => avatarBg[(id?.charCodeAt(0) || 0) % avatarBg.length];
const initials = (name) => (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

function OrderViewModal({ order, service, buyer, onClose, onRefresh, me }) {
  const [noteText, setNoteText] = useState("");
  const [activities, setActivities] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    base44.entities.ServiceOrderActivity.filter({ serviceOrderId: order.id })
      .then(acts => setActivities(acts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))))
      .catch(() => {});
  }, [order.id]);

  const addActivity = async (action, description) => {
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: order.id,
      actorId: me?.id,
      actorRole: "franchise_owner",
      action,
      description,
    });
    const updated = await base44.entities.ServiceOrderActivity.filter({ serviceOrderId: order.id });
    setActivities(updated.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
  };

  const handleStartWork = async () => {
    setUpdating(true);
    await base44.entities.ServiceOrder.update(order.id, {
      status: "in_progress",
      startedDate: new Date().toISOString().slice(0, 10),
    });
    await addActivity("started", "Work started by franchise owner.");
    setUpdating(false);
    onRefresh();
  };

  const handleComplete = async () => {
    setUpdating(true);
    await base44.entities.ServiceOrder.update(order.id, {
      status: "completed",
      completedDate: new Date().toISOString().slice(0, 10),
    });
    await addActivity("completed", "Marked as completed by franchise owner.");
    setUpdating(false);
    onRefresh();
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await addActivity("note_added", noteText.trim());
    setNoteText("");
    setAddingNote(false);
  };

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900">Order #{order.orderCode}</h2>
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "Service", value: service?.name || "—" },
              { label: "Total Price", value: <span className="font-black text-orange-600">${order.totalPrice || 0}</span> },
              { label: "Quantity", value: order.quantity || 1 },
              { label: "Assigned Date", value: order.assignedDate || "—" },
              ...(order.relatedEntityType ? [{ label: "Related", value: `${order.relatedEntityType}: ${order.relatedEntityId || ""}` }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-gray-400 text-[10px] font-semibold mb-0.5">{label}</p>
                <div className="font-bold text-gray-800">{value}</div>
              </div>
            ))}
          </div>

          {/* Buyer */}
          {buyer && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${colorFor(buyer.id)} text-white text-xs font-black flex items-center justify-center`}>
                {initials(buyer.full_name)}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{buyer.full_name}</p>
                <p className="text-xs text-gray-500">{buyer.email}</p>
              </div>
            </div>
          )}

          {/* Buyer Notes */}
          {order.buyerNotes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-xs text-yellow-800">
              <p className="font-black mb-1">Buyer Notes</p>
              <p>{order.buyerNotes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            {(order.status === "assigned" || order.status === "pending" || order.status === "confirmed") && (
              <button onClick={handleStartWork} disabled={updating}
                className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
                {updating ? <Loader size={11} className="animate-spin" /> : null} ▶ Start Work
              </button>
            )}
            {order.status === "in_progress" && (
              <button onClick={handleComplete} disabled={updating}
                className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs">
                {updating ? <Loader size={11} className="animate-spin" /> : <CheckCircle size={11} />} Mark Complete
              </button>
            )}
          </div>

          {/* Add Note */}
          <div>
            <p className="text-xs font-black text-gray-600 mb-1.5">Add Update Note</p>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Describe progress, findings or next steps…"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400 resize-none" />
            <button onClick={handleAddNote} disabled={addingNote || !noteText.trim()}
              className="mt-1.5 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
              {addingNote ? <Loader size={10} className="animate-spin" /> : <Plus size={10} />} Add Update
            </button>
          </div>

          {/* Activity Timeline */}
          {activities.length > 0 && (
            <div>
              <p className="text-xs font-black text-gray-500 uppercase mb-2">Activity Timeline</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-700 capitalize">{a.action?.replace("_", " ")}</span>
                      {a.description && <span className="text-gray-500 ml-1">— {a.description}</span>}
                      <p className="text-gray-400 text-[10px]">{a.created_date ? new Date(a.created_date).toLocaleString() : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FranchisePaidServices() {
  const [statusTab, setStatusTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(null);
  const [me, setMe] = useState(null);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
  }, []);

  const fetchAll = () => {
    if (!me) return;
    setLoading(true);
    Promise.all([
      base44.entities.ServiceOrder.filter({ franchiseOwnerId: me.id }),
      base44.entities.PaidService.list(),
      base44.entities.User.list(),
    ]).then(([ord, svc, usrs]) => {
      setOrders(ord);
      setServices(svc);
      setUsers(usrs);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [me]);

  const serviceById = Object.fromEntries(services.map(s => [s.id, s]));
  const userById = Object.fromEntries(users.map(u => [u.id, u]));

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    newOrders: orders.filter(o => ["pending","confirmed","assigned"].includes(o.status)).length,
    inProgress: orders.filter(o => o.status === "in_progress").length,
    completed: orders.filter(o => o.status === "completed").length,
    commission: orders.filter(o => o.status === "completed" && o.completedDate && new Date(o.completedDate) >= monthStart)
      .reduce((s, o) => s + (o.totalPrice || 0) * 0.1, 0),
  };

  const TABS = [
    { key: "active", label: "New", count: stats.newOrders },
    { key: "in_progress", label: "In Progress", count: stats.inProgress },
    { key: "completed", label: "Completed", count: stats.completed },
    { key: "all", label: "All", count: orders.length },
  ];

  const filtered = orders.filter(o => {
    if (statusTab === "active") return ["pending","confirmed","assigned"].includes(o.status);
    if (statusTab === "in_progress") return o.status === "in_progress";
    if (statusTab === "completed") return o.status === "completed";
    return true;
  });

  const handleQuickAction = async (orderId, newStatus, action, description) => {
    setUpdating(u => ({ ...u, [orderId]: true }));
    const updates = { status: newStatus };
    if (newStatus === "in_progress") updates.startedDate = new Date().toISOString().slice(0, 10);
    if (newStatus === "completed") updates.completedDate = new Date().toISOString().slice(0, 10);
    await base44.entities.ServiceOrder.update(orderId, updates);
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: orderId, actorId: me?.id,
      actorRole: "franchise_owner", action, description,
    });
    setUpdating(u => ({ ...u, [orderId]: false }));
    fetchAll();
  };

  const kpis = [
    { icon: "📦", label: "New Orders", value: stats.newOrders, color: "text-yellow-700", bg: "bg-yellow-50" },
    { icon: "🔄", label: "In Progress", value: stats.inProgress, color: "text-purple-600", bg: "bg-purple-50" },
    { icon: "✅", label: "Completed", value: stats.completed, color: "text-green-600", bg: "bg-green-50" },
    { icon: "💰", label: "Commission This Month", value: `$${stats.commission.toFixed(2)}`, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Service Orders Assigned to Me</h1>
        <p className="text-gray-500 text-sm">{filtered.length} orders</p>
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

      {/* Status Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setStatusTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              statusTab === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab.label}
            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order Code","Buyer","Service","Price","Status","Assigned Date","Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-16 text-center text-gray-400">No orders found</td></tr>
                )}
                {filtered.map(order => {
                  const svc = serviceById[order.serviceId];
                  const buyer = userById[order.buyerId];
                  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const isUpdating = updating[order.id];
                  const isNew = ["pending","confirmed","assigned"].includes(order.status);
                  const isInProgress = order.status === "in_progress";
                  const isCompleted = order.status === "completed";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 font-mono font-black text-gray-700 text-[10px]">{order.orderCode || order.id.slice(-6)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${colorFor(order.buyerId)} text-white text-[10px] font-black flex items-center justify-center flex-shrink-0`}>
                            {initials(buyer?.full_name || "?")}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{buyer?.full_name || "—"}</p>
                            <p className="text-[10px] text-gray-400">{buyer?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-800 max-w-[120px] truncate">{svc?.name || "—"}</td>
                      <td className="px-3 py-3 font-black text-orange-600">${order.totalPrice || 0}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{order.assignedDate || "—"}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {isNew && (
                            <button onClick={() => handleQuickAction(order.id, "in_progress", "started", "Work started.")}
                              disabled={isUpdating}
                              className="text-[10px] font-bold bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-lg whitespace-nowrap">
                              Accept & Start
                            </button>
                          )}
                          {isInProgress && (
                            <button onClick={() => handleQuickAction(order.id, "completed", "completed", "Marked complete by franchise owner.")}
                              disabled={isUpdating}
                              className="text-[10px] font-bold bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg whitespace-nowrap">
                              Mark Complete
                            </button>
                          )}
                          <button onClick={() => setViewOrder(order)} title="View Details"
                            className="p-1.5 hover:bg-blue-50 text-blue-500 rounded"><Eye size={13} /></button>
                          {isCompleted && order.rating && (
                            <button title="View Rating" className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded">
                              <Star size={13} />
                            </button>
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
        <OrderViewModal
          order={viewOrder}
          service={serviceById[viewOrder.serviceId]}
          buyer={userById[viewOrder.buyerId]}
          me={me}
          onClose={() => setViewOrder(null)}
          onRefresh={() => { fetchAll(); setViewOrder(null); }}
        />
      )}
    </div>
  );
}