import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INVOICES = [
  { id: 1, num: "KFO-001", client: "Ahmed Hassan", amount: 5000, status: "paid", date: "2026-03-20" },
  { id: 2, num: "KFO-002", client: "Fatima Ali", amount: 3500, status: "sent", date: "2026-03-19" },
  { id: 3, num: "KFO-003", client: "Mohamed Samir", amount: 8000, status: "draft", date: "2026-03-18" },
];

export default function BizInvoicesMobile() {
  const navigate = useNavigate();

  const statusColor = (s) => s === "paid" ? "bg-green-100 text-green-700" : s === "sent" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Invoices</h1>
        <button className="p-1.5">
          <Plus size={22} className="text-emerald-600" />
        </button>
      </div>

      {/* Invoice Cards */}
      <div className="p-4 space-y-3">
        {INVOICES.map(inv => (
          <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="font-black text-gray-900">{inv.num}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded ${statusColor(inv.status)}`}>
                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{inv.client}</p>
            <p className="text-lg font-black text-emerald-600 mb-3">${inv.amount.toLocaleString()}</p>
            <p className="text-xs text-gray-600 mb-3">{inv.date}</p>
            <div className="flex gap-2">
              <button className="flex-1 text-xs text-gray-600 border border-gray-200 py-2 rounded-lg font-bold">View</button>
              <button className="flex-1 text-xs text-white bg-emerald-600 py-2 rounded-lg font-bold">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}