import { useState } from "react";
import { Search, Plus, Download, Mail, X, FileText } from "lucide-react";

const STATUS_CONFIG = {
  paid: { label: "Paid", badge: "bg-green-100 text-green-700" },
  pending: { label: "Pending", badge: "bg-orange-100 text-orange-700" },
  overdue: { label: "Overdue", badge: "bg-red-100 text-red-600" },
  draft: { label: "Draft", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_INVOICES = [
  { id: 1, num: "COMP-INV-001", customer: "Ahmed Hassan", service: "Interior Design", date: "Mar 18, 2026", due: "Apr 18, 2026", amount: 5500, status: "paid" },
  { id: 2, num: "COMP-INV-002", customer: "Sara Mohamed", service: "Carpentry Work", date: "Mar 20, 2026", due: "Apr 20, 2026", amount: 3200, status: "pending" },
  { id: 3, num: "COMP-INV-003", customer: "Karim Ali", service: "Painting & Finishing", date: "Mar 10, 2026", due: "Mar 25, 2026", amount: 2000, status: "overdue" },
  { id: 4, num: "COMP-INV-004", customer: "Layla Nour", service: "Full Interior Renovation", date: "Mar 22, 2026", due: "Apr 22, 2026", amount: 8500, status: "draft" },
];

const EMPTY_FORM = {
  customer: "", email: "", service: "", description: "", amount: "", dueDate: "", notes: "",
};

export default function CompanyInvoicesPage() {
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
      num: `COMP-INV-${String(invoices.length + 1).padStart(3, "0")}`,
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
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black">My Invoices</h1>
                <p className="text-amber-100 text-sm font-medium">Manage and track invoices issued to customers</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white text-amber-600 font-bold px-5 py-3 rounded-xl text-sm hover:bg-amber-50 transition-all shadow-md"
          >
            <Plus size={18} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Collected</span>
          </div>
          <p className="text-3xl font-black text-green-700">${totalPaid.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">{invoices.filter(i => i.status === "paid").length} invoices paid</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Pending</span>
          </div>
          <p className="text-3xl font-black text-orange-700">${totalPending.toLocaleString()}</p>
          <p className="text-xs text-orange-600 mt-1 font-medium">{invoices.filter(i => ["pending", "overdue"].includes(i.status)).length} awaiting payment</p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-gray-600 flex items-center justify-center">
              <FileText size={18} className="text-white" />
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total</span>
          </div>
          <p className="text-3xl font-black text-gray-700">{invoices.length}</p>
          <p className="text-xs text-gray-600 mt-1 font-medium">invoices issued</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl">
            {["All", "Paid", "Pending", "Overdue", "Draft"].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  statusFilter === tab
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 w-full sm:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={40} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-700 text-lg mb-1">No invoices found</p>
          <p className="text-gray-500 text-sm">Create your first invoice to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  {["Invoice #", "Customer", "Service", "Date", "Due Date", "Amount", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-black text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(inv => {
                  const sc = STATUS_CONFIG[inv.status];
                  return (
                    <tr key={inv.id} className="hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-amber-600">{inv.num}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-xs font-black text-amber-600">
                            {inv.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-semibold text-gray-900">{inv.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{inv.service}</td>
                      <td className="px-6 py-4 text-gray-500">{inv.date}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${inv.due === "—" ? "text-gray-400" : "text-gray-600"}`}>{inv.due}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900 text-base">${inv.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${sc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            inv.status === "paid" ? "bg-green-500" :
                            inv.status === "pending" ? "bg-orange-500" :
                            inv.status === "overdue" ? "bg-red-500" : "bg-gray-400"
                          }`}></span>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download PDF">
                            <Download size={16} className="text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send by Email">
                            <Mail size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Customer Email</label>
                  <input value={form.email} onChange={set("email")} placeholder="email@example.com" type="email"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Service / Item *</label>
                <input value={form.service} onChange={set("service")} placeholder="e.g. Interior Design"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
                <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Additional details..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Amount (USD) *</label>
                  <input value={form.amount} onChange={set("amount")} placeholder="0.00" type="number" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Due Date</label>
                  <input value={form.dueDate} onChange={set("dueDate")} type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={set("notes")} rows={2} placeholder="Payment terms, notes..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-pink-400 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreate}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-sm transition-colors">
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}