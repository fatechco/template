import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, FileText, Mail } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

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

const TYPE_OPTIONS = ["All", "Kemedar", "Kemetro", "Kemework"];
const DATE_OPTIONS = ["This Month", "Last 3 Months", "This Year", "All Time"];

function FilterSheet({ title, options, selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 mb-3">{title}</p>
        {options.map(opt => (
          <button key={opt} onClick={() => { onSelect(opt); onClose(); }}
            className={`w-full text-left py-3 px-2 text-sm font-semibold border-b border-gray-100 flex justify-between ${selected === opt ? "text-orange-600" : "text-gray-700"}`}>
            {opt} {selected === opt && <span className="font-black text-orange-600">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function InvoiceCard({ invoice }) {
  const [expanded, setExpanded] = useState(false);
  const mc = MODULE_CONFIG[invoice.module];
  const sc = STATUS_CONFIG[invoice.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full p-4 flex items-center gap-3 text-left">
        {/* Module icon */}
        <div className={`w-10 h-10 rounded-full ${mc.color} flex items-center justify-center text-xl flex-shrink-0`}>
          {mc.icon}
        </div>

        {/* Center */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-gray-400">{invoice.num}</p>
          <p className="text-[13px] font-black text-gray-900 line-clamp-1">{invoice.description}</p>
          <p className="text-[12px] text-gray-400">{invoice.date}</p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p className="text-[15px] font-black text-gray-900">${invoice.amount.toFixed(2)}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.badge}`}>{sc.label}</span>
        </div>
      </button>

      {expanded && (
        <div className="flex gap-2 px-4 pb-4 border-t border-gray-50 pt-3">
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">
            <FileText size={13} /> Download PDF
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">
            <Mail size={13} /> Send to Email
          </button>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);

  const filtered = MOCK_INVOICES.filter(inv => {
    const typeMatch = typeFilter === "All" || MODULE_CONFIG[inv.module].label === typeFilter;
    const searchMatch = !search || inv.num.toLowerCase().includes(search.toLowerCase()) || inv.description.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  const totalAmount = filtered.reduce((s, i) => s + (i.status !== "refunded" ? i.amount : 0), 0);
  const paidCount = filtered.filter(i => i.status === "paid").length;
  const pendingCount = filtered.filter(i => i.status === "pending" || i.status === "overdue").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Invoices" showBack
        rightAction={<button><Search size={20} className="text-gray-700" /></button>} />

      <div className="px-4 py-3 space-y-3">
        {/* Filter row */}
        <div className="flex gap-2">
          <button onClick={() => setShowTypeSheet(true)}
            className="flex-1 flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700">
            {typeFilter} <ChevronDown size={14} />
          </button>
          <button onClick={() => setShowDateSheet(true)}
            className="flex-1 flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700">
            {dateFilter} <ChevronDown size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search invoice # or description..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400" />
        </div>

        {/* Summary strip */}
        {filtered.length > 0 && (
          <div className="bg-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
            <p className="font-black text-gray-900 text-base">${totalAmount.toLocaleString()}</p>
            <div className="flex gap-3 text-xs">
              <span className="font-bold text-green-600">Paid: {paidCount}</span>
              <span className="font-bold text-orange-600">Pending: {pendingCount}</span>
            </div>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧾</span>
            </div>
            <p className="font-bold text-gray-700 text-base mb-1">No invoices yet</p>
            <p className="text-sm text-gray-400">Your invoices will appear here after purchases</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => <InvoiceCard key={inv.id} invoice={inv} />)}
          </div>
        )}
      </div>

      {showTypeSheet && (
        <FilterSheet title="Filter by Type" options={TYPE_OPTIONS} selected={typeFilter}
          onSelect={setTypeFilter} onClose={() => setShowTypeSheet(false)} />
      )}
      {showDateSheet && (
        <FilterSheet title="Filter by Date" options={DATE_OPTIONS} selected={dateFilter}
          onSelect={setDateFilter} onClose={() => setShowDateSheet(false)} />
      )}
    </div>
  );
}