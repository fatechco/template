import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const BIZ_SECTIONS = [
  { id: "setup", icon: "⚙️", title: "Setup", info: "Configure business", color: "bg-green-100 text-green-700" },
  { id: "leads", icon: "🆕", title: "Leads", info: "245 leads", color: "bg-blue-100 text-blue-700" },
  { id: "customers", icon: "👥", title: "Customers", info: "3 customers", color: "bg-rose-100 text-rose-700" },
  { id: "sales", icon: "💰", title: "Sales", info: "3 invoices", color: "bg-emerald-100 text-emerald-700" },
  { id: "employees", icon: "👤", title: "Employees", info: "3 team members", color: "bg-orange-100 text-orange-700" },
  { id: "tasks", icon: "📋", title: "Tasks", info: "8 active", color: "bg-cyan-100 text-cyan-700" },
  { id: "reports", icon: "📊", title: "Reports", info: "Generate reports", color: "bg-indigo-100 text-indigo-700" },
];

export default function BizHomeMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Business Manager</h1>
      </div>

      {/* Section Cards */}
      <div className="p-4 space-y-2">
        {BIZ_SECTIONS.map(section => (
          <button key={section.id} onClick={() => navigate(`/m/kemedar/franchise/biz/${section.id}`)}
            className="w-full bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow active:bg-gray-50"
          >
            <div className={`w-14 h-14 rounded-2xl ${section.color} flex items-center justify-center text-2xl flex-shrink-0`}>
              {section.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-gray-900 text-base">{section.title}</p>
              <p className="text-xs text-gray-600">{section.info}</p>
            </div>
            <span className="text-gray-400 text-lg">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}