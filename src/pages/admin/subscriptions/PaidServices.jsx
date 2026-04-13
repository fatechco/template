import { useState, useEffect } from "react";
import { Plus, Edit, Power, Trash2, RefreshCw, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ServiceFormModal from "@/components/admin/subscriptions/ServiceFormModal";

const MODULE_META = {
  kemedar: { label: "Kemedar", icon: "🏠", color: "bg-orange-100 text-orange-700" },
  kemework: { label: "Kemework", icon: "🔧", color: "bg-teal-100 text-teal-700" },
  kemetro: { label: "Kemetro", icon: "🛒", color: "bg-blue-100 text-blue-700" },
};

const TYPE_CONFIG = {
  one_time: { label: "One-Time", color: "bg-purple-100 text-purple-700" },
  recurring: { label: "Recurring", color: "bg-blue-100 text-blue-700" },
  custom_quote: { label: "Custom Quote", color: "bg-yellow-100 text-yellow-700" },
};

export default function PaidServices() {
  const [services, setServices] = useState([]);
  const [modules, setModules] = useState([]);
  const [activeOrders, setActiveOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [moduleTab, setModuleTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const [svcData, modData, ordersData] = await Promise.all([
      base44.entities.PaidService.list("sortOrder"),
      base44.entities.SystemModule.list(),
      base44.entities.ServiceOrder.list(),
    ]);
    setServices(svcData);
    setModules(modData);
    // Count active orders per service
    const counts = {};
    ordersData.forEach(o => {
      if (!["cancelled", "refunded", "completed"].includes(o.status)) {
        counts[o.serviceId] = (counts[o.serviceId] || 0) + 1;
      }
    });
    setActiveOrders(counts);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

  const filteredServices = moduleTab === "all"
    ? services
    : services.filter(s => moduleById[s.moduleId]?.slug === moduleTab);

  const openCreate = () => { setEditingService(null); setModalOpen(true); };
  const openEdit = (svc) => { setEditingService(svc); setModalOpen(true); };

  const handleToggleActive = async (svc) => {
    await base44.entities.PaidService.update(svc.id, { isActive: !svc.isActive });
    fetchAll();
  };

  const handleDelete = async (id) => {
    await base44.entities.PaidService.delete(id);
    setDeleteConfirm(null);
    fetchAll();
  };

  const handleSave = async (data) => {
    if (editingService?.id) {
      await base44.entities.PaidService.update(editingService.id, data);
    } else {
      await base44.entities.PaidService.create(data);
    }
    setModalOpen(false);
    setEditingService(null);
    fetchAll();
  };

  const moduleTabs = [
    { key: "all", label: "All", icon: "🛍" },
    { key: "kemedar", label: "Kemedar", icon: "🏠" },
    { key: "kemework", label: "Kemework", icon: "🔧" },
    { key: "kemetro", label: "Kemetro", icon: "🛒" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Paid Services Catalog</h1>
          <p className="text-gray-500 text-sm">{filteredServices.length} services across all modules</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={15} /> Add New Service
          </button>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {moduleTabs.map(tab => {
          const count = tab.key === "all"
            ? services.length
            : services.filter(s => moduleById[s.moduleId]?.slug === tab.key).length;
          return (
            <button key={tab.key} onClick={() => setModuleTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                moduleTab === tab.key ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="ml-1 bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <RefreshCw size={28} className="mx-auto mb-3 animate-spin opacity-40" />
            <p className="text-sm font-semibold">Loading services…</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Module", "Service Name", "Type", "Base Price", "Price Unit", "Req. Franchise", "Active Orders", "Sort", "Status", "Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredServices.length === 0 && (
                  <tr><td colSpan={10} className="py-16 text-center text-gray-400">
                    <p className="text-2xl mb-2">🛍</p>
                    <p className="font-semibold">No services found</p>
                  </td></tr>
                )}
                {filteredServices.map(svc => {
                  const mod = moduleById[svc.moduleId];
                  const modMeta = MODULE_META[mod?.slug] || { label: mod?.name || "—", icon: "📦", color: "bg-gray-100 text-gray-600" };
                  const typeCfg = TYPE_CONFIG[svc.serviceType] || { label: svc.serviceType, color: "bg-gray-100 text-gray-600" };
                  return (
                    <tr key={svc.id} className={`hover:bg-gray-50 transition-colors ${!svc.isActive ? "opacity-50" : ""}`}>
                      {/* Module */}
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${modMeta.color}`}>
                          {modMeta.icon} {modMeta.label}
                        </span>
                      </td>
                      {/* Name */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{svc.icon}</span>
                          <div>
                            <p className="font-bold text-gray-900">{svc.name}</p>
                            <p className="text-[10px] text-gray-400 max-w-[180px] truncate">{svc.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      {/* Type */}
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCfg.color}`}>
                          {typeCfg.label}
                        </span>
                      </td>
                      {/* Base Price */}
                      <td className="px-3 py-3 font-bold text-gray-900">
                        {svc.serviceType === "custom_quote"
                          ? <span className="text-gray-400 italic text-[10px]">Custom</span>
                          : svc.basePrice != null
                            ? `$${svc.basePrice}`
                            : svc.pricingTiers?.length
                              ? <span className="text-purple-600 text-[10px] font-bold">Tiered</span>
                              : "—"
                        }
                      </td>
                      {/* Price Unit */}
                      <td className="px-3 py-3 text-gray-500">{svc.priceUnit || "—"}</td>
                      {/* Requires Franchise */}
                      <td className="px-3 py-3 text-center">
                        {svc.requiresFranchiseOwner
                          ? <span className="text-green-600 font-bold text-base">✅</span>
                          : <span className="text-red-400 font-bold text-base">❌</span>}
                      </td>
                      {/* Active Orders */}
                      <td className="px-3 py-3">
                        <span className={`font-black text-sm ${(activeOrders[svc.id] || 0) > 0 ? "text-orange-600" : "text-gray-300"}`}>
                          {activeOrders[svc.id] || 0}
                        </span>
                      </td>
                      {/* Sort */}
                      <td className="px-3 py-3 text-gray-500">{svc.sortOrder ?? 0}</td>
                      {/* Status */}
                      <td className="px-3 py-3">
                        <button onClick={() => handleToggleActive(svc)}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${
                            svc.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {svc.isActive ? <><Check size={10} /> Active</> : <><X size={10} /> Inactive</>}
                        </button>
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => openEdit(svc)} title="Edit"
                            className="p-1.5 hover:bg-orange-50 text-orange-500 rounded">
                            <Edit size={13} />
                          </button>
                          <button onClick={() => handleToggleActive(svc)} title={svc.isActive ? "Deactivate" : "Activate"}
                            className="p-1.5 hover:bg-yellow-50 text-yellow-500 rounded">
                            <Power size={13} />
                          </button>
                          <button onClick={() => setDeleteConfirm(svc.id)} title="Delete"
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded">
                            <Trash2 size={13} />
                          </button>
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

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-black text-gray-900 mb-2">Delete Service?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. Existing orders will still reference this service.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {modalOpen && (
        <ServiceFormModal
          service={editingService}
          modules={modules}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingService(null); }}
        />
      )}
    </div>
  );
}