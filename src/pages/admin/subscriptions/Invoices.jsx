import { useState, useEffect } from "react";
import { Search, Download, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import InvoiceKPIs from "@/components/admin/invoices/InvoiceKPIs";
import InvoiceTable from "@/components/admin/invoices/InvoiceTable";
import InvoiceViewModal from "@/components/admin/invoices/InvoiceViewModal";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "", moduleId: "" });
  const [viewInvoice, setViewInvoice] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const data = await base44.entities.Invoice.list("-created_date", 300);
    setInvoices(data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = invoices.filter(inv => {
    if (filters.type && inv.invoiceType !== filters.type) return false;
    if (filters.status && inv.status !== filters.status) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(inv.invoiceNumber || "").toLowerCase().includes(q) &&
          !(inv.userId || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const handleMarkPaid = async (id) => {
    await base44.entities.Invoice.update(id, {
      status: "paid",
      paidDate: new Date().toISOString().slice(0, 10),
    });
    fetchAll();
  };

  const handleVoid = async (id) => {
    await base44.entities.Invoice.update(id, { status: "cancelled" });
    fetchAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm">{filtered.length} invoices</p>
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

      <InvoiceKPIs invoices={invoices} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice #, user…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filters.type} onChange={e => setFilter("type", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="service_order">Service Order</option>
          <option value="franchise_fee">Franchise Fee</option>
          <option value="advertising">Advertising</option>
        </select>
        <select value={filters.status} onChange={e => setFilter("status", e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Statuses</option>
          {["draft","sent","paid","overdue","cancelled","refunded"].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <InvoiceTable
        invoices={filtered}
        loading={loading}
        onView={setViewInvoice}
        onMarkPaid={handleMarkPaid}
        onVoid={handleVoid}
      />

      {viewInvoice && (
        <InvoiceViewModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}
    </div>
  );
}