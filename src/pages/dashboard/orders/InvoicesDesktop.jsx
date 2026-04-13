import { useState } from "react";
import { Search, FileText, Mail, Download } from "lucide-react";

const MODULE_CONFIG = {
  kemedar: { icon: "🏠", color: "bg-orange-100", text: "text-orange-600", label: "Kemedar" },
  kemetro: { icon: "🛒", color: "bg-blue-100", text: "text-blue-600", label: "Kemetro" },
  kemework: { icon: "🔧", color: "bg-teal-100", text: "text-teal-600", label: "Kemework" },
};

const STATUS_CONFIG = {
  paid: { label: "Paid", badge: "bg-green-100 text-green-700" },
  pending: { label: "Pending", badge: "bg-orange-100 text-orange-700" },
  overdue: { label: "Overdue", badge: "bg-red-100 text-red-600" },
  refunded: { label: "Refunded", badge: "bg-gray-100 text-gray-500" },
};

const MOCK_INVOICES = [
  { id: 1, num: "INV-00341", module: "kemedar", description: "KEMEDAR List Service", date: "Mar 15, 2026", amount: 200, status: "paid" },
  { id: 2, num: "INV-00338", module: "kemetro", description: "Kemetro Order #KT-00234", date: "Mar 12, 2026", amount: 225, status: "paid" },
  { id: 3, num: "INV-00335", module: "kemework", description: "Kemework Task Order #KW-00121", date: "Mar 10, 2026", amount: 2800, status: "pending" },
  { id: 4, num: "INV-00330", module: "kemedar", description: "KEMEDAR VERI Service", date: "Mar 5, 2026", amount: 150, status: "paid" },
  { id: 5, num: "INV-00325", module: "kemetro", description: "Kemetro Order #KT-00220", date: "Feb 28, 2026", amount: 74, status: "refunded" },
  { id: 6, num: "INV-00318", module: "kemedar", description: "KEMEDAR UP Boost (30 days)", date: "Feb 20, 2026", amount: 50, status: "overdue" },
];

const MODULE_TABS = ["All", "Kemedar", "Kemetro", "Kemework"];

export default function InvoicesDesktop() {
  const [moduleFilter, setModuleFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_INVOICES.filter(inv => {
    const modMatch = moduleFilter === "All" || MODULE_CONFIG[inv.module].label === moduleFilter;
    const searchMatch = !search || inv.num.toLowerCase().includes(search.toLowerCase()) || inv.description.toLowerCase().includes(search.toLowerCase());
    return modMatch && searchMatch;
  });

  const totalPaid = filtered.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = filtered.filter(i => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🧾 Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">All your invoices across Kemedar, Kemetro and Kemework</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-56" />
        </div>
      </div>

      {/* Summary cards */}
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
          <p className="text-2xl font-black text-gray-700 mt-1">{filtered.length}</p>
        </div>
      </div>

      {/* Module filter tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {MODULE_TABS.map(tab => (
          <button key={tab} onClick={() => setModuleFilter(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              moduleFilter === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

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
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Module</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(inv => {
                const mc = MODULE_CONFIG[inv.module];
                const sc = STATUS_CONFIG[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-700">{inv.num}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${mc.color} ${mc.text}`}>
                        {mc.icon} {mc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{inv.description}</td>
                    <td className="px-5 py-4 text-gray-500">{inv.date}</td>
                    <td className="px-5 py-4 font-black text-gray-900">${inv.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${sc.badge}`}>{sc.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-700 transition-colors" title="Download PDF"><Download size={15} /></button>
                        <button className="text-gray-400 hover:text-gray-700 transition-colors" title="Send to Email"><Mail size={15} /></button>
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
  );
}