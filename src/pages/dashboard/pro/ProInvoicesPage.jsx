import { useState } from "react";
import { Search, Plus, Download, Mail, X, FileText } from "lucide-react";

const STATUS_CONFIG = {
  paid: { label: "Paid", badge: "bg-green-100 text-green-700" },
  pending: { label: "Pending", badge: "bg-orange-100 text-orange-700" },
  overdue: { label: "Overdue", badge: "bg-red-100 text-red-600" },
  draft: { label: "Draft", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_INVOICES = [
  { id: 1, num: "PRO-INV-001", customer: "Ahmed Hassan", service: "Kitchen Renovation", date: "Mar 18, 2026", due: "Apr 18, 2026", amount: 3500, status: "paid" },
  { id: 2, num: "PRO-INV-002", customer: "Sara Mohamed", service: "Electrical Rewiring", date: "Mar 20, 2026", due: "Apr 20, 2026", amount: 1200, status: "pending" },
  { id: 3, num: "PRO-INV-003", customer: "Karim Ali", service: "Bathroom Tiling", date: "Mar 10, 2026", due: "Mar 25, 2026", amount: 750, status: "overdue" },
  { id: 4, num: "PRO-INV-004", customer: "Layla Nour", service: "Interior Painting", date: "Mar 22, 2026", due: "Apr 22, 2026", amount: 1800, status: "draft" },
];

const EMPTY_FORM = {
  customer: "", email: "", service: "", description: "", amount: "", dueDate: "", notes: "",
};

export default function ProInvoicesPage() {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = invoices.filter(inv => {
    const statusMatch = statusFilter === "All" || STATUS_CONFIG[inv.status].label === statusFilter;
    const searchMatch = !search ||
      inv.num.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.service.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalPaid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  const handleCreate = () => {
    if (!form.customer || !form.service || !form.amount) return;
    const newInv = {
      id: Date.now(),
      num: `PRO-INV-${String(invoices.length + 1).padStart(3, "0")}`,
      customer: form.customer,
      service: form.service,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      due: form.dueDate || "—",
      amount: parseFloat(form.amount),
      status: "pending",
    };
    setInvoices(prev => [newInv, ...prev]);
    setForm(EMPTY_FORM);
    setShowModal(false);
  };

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🧾 My Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Invoices you've issued to your customers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus size={16} /> Create Invoice
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Total Paid</p>
          <p className="text-2xl font-black text-green-700 mt-1">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Pending / Overdue</p>
          <p className="text-2xl font-black text-orange-700 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Invoices</p>
          <p className="text-2xl font-black text-gray-700 mt-1">{invoices.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 border-b border-gray-200">
          {["All", "Paid", "Pending", "Overdue", "Draft"].map(tab => (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                statusFilter === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-52" />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No invoices found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Invoice #", "Customer", "Service", "Date", "Due Date", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(inv => {
                const sc = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-700">{inv.num}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{inv.customer}</td>
                    <td className="px-5 py-4 text-gray-600">{inv.service}</td>
                    <td className="px-5 py-4 text-gray-500">{inv.date}</td>
                    <td className="px-5 py-4 text-gray-500">{inv.due}</td>
                    <td className="px-5 py-4 font-black text-gray-900">${inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.badge}`}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-700 transition-colors" title="Download PDF"><Download size={15} /></button>
                        <button className="text-gray-400 hover:text-gray-700 transition-colors" title="Send by Email"><Mail size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900 text-lg">Create New Invoice</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Customer Name *</label>
                  <input value={form.customer} onChange={set("customer")} placeholder="e.g. Ahmed Hassan"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Customer Email</label>
                  <input value={form.email} onChange={set("email")} placeholder="email@example.com" type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Service / Item *</label>
                <input value={form.service} onChange={set("service")} placeholder="e.g. Kitchen Renovation"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
                <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Additional details..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Amount (USD) *</label>
                  <input value={form.amount} onChange={set("amount")} placeholder="0.00" type="number" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Due Date</label>
                  <input value={form.dueDate} onChange={set("dueDate")} type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Payment terms, notes..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreate}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-sm transition-colors">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}