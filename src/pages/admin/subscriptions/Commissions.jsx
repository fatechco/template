import { useState, useEffect } from "react";
import { Search, Download, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CommissionKPIs from "@/components/admin/commissions/CommissionKPIs";
import CommissionTable from "@/components/admin/commissions/CommissionTable";

export default function Commissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ sourceType: "", status: "" });
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    const data = await base44.entities.FranchiseCommission.list("-created_date", 300);
    setCommissions(data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = commissions.filter(c => {
    if (filters.sourceType && c.sourceType !== filters.sourceType) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(c.franchiseOwnerId || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const handleApprove = async (id) => {
    await base44.entities.FranchiseCommission.update(id, { status: "approved" });
    fetchAll();
  };

  const handleMarkPaid = async (id) => {
    await base44.entities.FranchiseCommission.update(id, {
      status: "paid",
      paidDate: new Date().toISOString().slice(0, 10),
    });
    fetchAll();
  };

  const handleDispute = async (id) => {
    await base44.entities.FranchiseCommission.update(id, { status: "disputed" });
    fetchAll();
  };

  const handleBulkApprove = async () => {
    await Promise.all(selectedIds.map(id => base44.entities.FranchiseCommission.update(id, { status: "approved" })));
    setSelectedIds([]);
    fetchAll();
  };

  const handleBulkPaid = async () => {
    await Promise.all(selectedIds.map(id => base44.entities.FranchiseCommission.update(id, {
      status: "paid",
      paidDate: new Date().toISOString().slice(0, 10),
    })));
    setSelectedIds([]);
    fetchAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Franchise Commissions</h1>
          <p className="text-gray-500 text-sm">{filtered.length} commission records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
        </div>
      </div>

      <CommissionKPIs commissions={commissions} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search franchise owner…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filters.sourceType} onChange={e => setFilter("sourceType", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Sources</option>
          <option value="subscription">Subscription</option>
          <option value="service_order">Service Order</option>
        </select>
        <select value={filters.status} onChange={e => setFilter("status", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Statuses</option>
          {["pending","approved","paid","disputed"].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-orange-700">{selectedIds.length} selected</span>
          <button onClick={handleBulkApprove}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
            ✅ Approve Selected
          </button>
          <button onClick={handleBulkPaid}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
            💰 Mark as Paid
          </button>
          <button className="border border-orange-300 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-orange-100">
            <Download size={11} className="inline mr-1" /> Export
          </button>
          <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 font-bold px-2">Clear</button>
        </div>
      )}

      <CommissionTable
        commissions={filtered}
        loading={loading}
        selectedIds={selectedIds}
        onSelectIds={setSelectedIds}
        onApprove={handleApprove}
        onMarkPaid={handleMarkPaid}
        onDispute={handleDispute}
      />
    </div>
  );
}