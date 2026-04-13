import { useMemo } from "react";

export default function InvoiceKPIs({ invoices }) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const total = invoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
    const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + (i.totalAmount || 0), 0);
    const overdue = invoices.filter(i => i.status === "overdue" || (i.status !== "paid" && i.status !== "cancelled" && i.dueDate && new Date(i.dueDate) < now)).length;
    const thisMonth = invoices.filter(i => i.status === "paid" && i.paidDate && new Date(i.paidDate) >= monthStart)
      .reduce((s, i) => s + (i.totalAmount || 0), 0);
    return { total, paid, overdue, thisMonth };
  }, [invoices]);

  const cards = [
    { icon: "🧾", label: "Total Invoiced",      value: `$${stats.total.toLocaleString()}`, color: "text-gray-900",   bg: "bg-gray-50" },
    { icon: "✅", label: "Paid",                value: `$${stats.paid.toLocaleString()}`,  color: "text-green-600",  bg: "bg-green-50" },
    { icon: "⚠️", label: "Overdue",             value: stats.overdue,                      color: "text-red-600",    bg: "bg-red-50" },
    { icon: "📅", label: "This Month Revenue",  value: `$${stats.thisMonth.toLocaleString()}`, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(c => (
        <div key={c.label} className={`${c.bg} rounded-xl p-4 border border-white shadow-sm`}>
          <div className="text-2xl mb-1">{c.icon}</div>
          <p className={`text-2xl font-black ${c.color}`}>{c.value}</p>
          <p className="text-xs text-gray-500 font-semibold mt-1">{c.label}</p>
        </div>
      ))}
    </div>
  );
}