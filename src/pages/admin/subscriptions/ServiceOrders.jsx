import { useState, useEffect } from "react";
import { Search, Download, RefreshCw, Plus } from "lucide-react";
import CreateServiceOrderModal from "@/components/admin/orders/CreateServiceOrderModal";
import { base44 } from "@/api/base44Client";
import ServiceOrderKPIs from "@/components/admin/orders/ServiceOrderKPIs";
import ServiceOrderTable from "@/components/admin/orders/ServiceOrderTable";
import ServiceOrderDetailModal from "@/components/admin/orders/ServiceOrderDetailModal";
import AssignFranchiseModal from "@/components/admin/orders/AssignFranchiseModal";
import ProcessRefundModal from "@/components/admin/orders/ProcessRefundModal";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "assigned", label: "Assigned" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "refunded", label: "Refunded" },
];

export default function ServiceOrders() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [filters, setFilters] = useState({ moduleId: "", serviceId: "", franchiseOwnerId: "" });

  const [detailOrder, setDetailOrder] = useState(null);
  const [assignOrder, setAssignOrder] = useState(null);
  const [refundOrder, setRefundOrder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [ord, svc, mod] = await Promise.all([
      base44.entities.ServiceOrder.list("-created_date", 300),
      base44.entities.PaidService.list(),
      base44.entities.SystemModule.list(),
    ]);
    setOrders(ord);
    setServices(svc);
    setModules(mod);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const serviceById = Object.fromEntries(services.map(s => [s.id, s]));
  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const filtered = orders.filter(o => {
    if (statusTab !== "all" && o.status !== statusTab) return false;
    if (filters.moduleId && o.moduleId !== filters.moduleId) return false;
    if (filters.serviceId && o.serviceId !== filters.serviceId) return false;
    if (filters.franchiseOwnerId && o.franchiseOwnerId !== filters.franchiseOwnerId) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(o.orderCode || "").toLowerCase().includes(q) &&
          !(o.buyerId || "").toLowerCase().includes(q) &&
          !(o.franchiseOwnerId || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const handleMarkCompleted = async (id) => {
    await base44.entities.ServiceOrder.update(id, {
      status: "completed",
      completedDate: new Date().toISOString().slice(0, 10),
    });
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: id, actorRole: "admin", action: "completed",
      description: "Marked as completed by admin",
    });
    fetchAll();
  };

  const handleCancel = async (id) => {
    await base44.entities.ServiceOrder.update(id, { status: "cancelled" });
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: id, actorRole: "admin", action: "cancelled",
      description: "Cancelled by admin",
    });
    fetchAll();
  };

  const handleAssignConfirm = async (orderId, franchiseOwnerId, commissionPct) => {
    await base44.entities.ServiceOrder.update(orderId, {
      franchiseOwnerId,
      status: "assigned",
      assignedDate: new Date().toISOString().slice(0, 10),
    });
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const commAmt = ((order.totalPrice || 0) * commissionPct) / 100;
      await base44.entities.FranchiseCommission.create({
        franchiseOwnerId,
        sourceType: "service_order",
        serviceOrderId: orderId,
        grossAmount: order.totalPrice || 0,
        commissionPercent: commissionPct,
        commissionAmount: commAmt,
        status: "pending",
      });
      await base44.entities.ServiceOrderActivity.create({
        serviceOrderId: orderId, actorRole: "admin", action: "assigned",
        description: `Assigned to franchise owner ${franchiseOwnerId}`,
      });
    }
    setAssignOrder(null);
    fetchAll();
  };

  const handleRefundConfirm = async (orderId, refundType, partialAmt, reason, notes) => {
    const amount = refundType === "full"
      ? (orders.find(o => o.id === orderId)?.totalPrice || 0)
      : partialAmt;
    await base44.entities.ServiceOrder.update(orderId, {
      status: "refunded",
      refundAmount: amount,
      refundDate: new Date().toISOString().slice(0, 10),
      cancellationReason: `${reason}${notes ? ": " + notes : ""}`,
    });
    await base44.entities.ServiceOrderActivity.create({
      serviceOrderId: orderId, actorRole: "admin", action: "refunded",
      description: `${refundType === "full" ? "Full" : "Partial"} refund of $${amount} — ${reason}`,
    });
    setRefundOrder(null);
    fetchAll();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Service Orders</h1>
          <p className="text-gray-500 text-sm">{filtered.length} orders</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={14} /> Create Service Order
          </button>
        </div>
      </div>

      {/* KPIs */}
      <ServiceOrderKPIs orders={orders} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order code, buyer, franchise owner…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filters.moduleId} onChange={e => setFilter("moduleId", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Modules</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
        </select>
        <select value={filters.serviceId} onChange={e => setFilter("serviceId", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Services</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white">
        {STATUS_TABS.map(tab => {
          const count = tab.key === "all" ? orders.length : orders.filter(o => o.status === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setStatusTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                statusTab === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              {tab.label}
              <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <ServiceOrderTable
        orders={filtered}
        services={services}
        modules={modules}
        loading={loading}
        onView={setDetailOrder}
        onAssign={setAssignOrder}
        onComplete={handleMarkCompleted}
        onCancel={handleCancel}
        onRefund={setRefundOrder}
      />

      {/* Modals */}
      {showCreate && (
        <CreateServiceOrderModal
          modules={modules}
          services={services}
          onClose={() => setShowCreate(false)}
          onCreated={fetchAll}
        />
      )}
      {detailOrder && (
        <ServiceOrderDetailModal
          order={detailOrder}
          service={serviceById[detailOrder.serviceId]}
          module={moduleById[detailOrder.moduleId]}
          onClose={() => setDetailOrder(null)}
          onRefresh={fetchAll}
          onAssign={() => { setDetailOrder(null); setAssignOrder(detailOrder); }}
        />
      )}
      {assignOrder && (
        <AssignFranchiseModal
          order={assignOrder}
          service={serviceById[assignOrder.serviceId]}
          onConfirm={(foId, pct) => handleAssignConfirm(assignOrder.id, foId, pct)}
          onClose={() => setAssignOrder(null)}
        />
      )}
      {refundOrder && (
        <ProcessRefundModal
          order={refundOrder}
          onConfirm={(type, amt, reason, notes) => handleRefundConfirm(refundOrder.id, type, amt, reason, notes)}
          onClose={() => setRefundOrder(null)}
        />
      )}
    </div>
  );
}