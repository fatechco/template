import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LEAD_STATUSES = [
  { id: "new", title: "New", count: 2 },
  { id: "contacted", title: "Contacted", count: 1 },
  { id: "qualified", title: "Qualified", count: 0 },
  { id: "converted", title: "Converted", count: 0 },
];

const LEADS = [
  { id: 1, name: "Ahmed Hassan", company: "Tech Solutions", phone: "+20 100 1234567", value: 5000, status: "new" },
  { id: 2, name: "Fatima Ali", company: "Design Studio", phone: "+20 100 1234568", value: 3500, status: "new" },
  { id: 3, name: "Mohamed Samir", company: "Construction Co", phone: "+20 100 1234569", value: 8000, status: "contacted" },
];

export default function BizLeadsMobile() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("new");

  const filtered = LEADS.filter(l => l.status === activeStatus);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Leads</h1>
        <button className="p-1.5">
          <Plus size={22} className="text-blue-600" />
        </button>
      </div>

      {/* Status Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-2 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {LEAD_STATUSES.map(s => (
          <button key={s.id} onClick={() => setActiveStatus(s.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeStatus === s.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {s.title} ({s.count})
          </button>
        ))}
      </div>

      {/* Lead Cards */}
      <div className="p-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-600">No leads in this status</p>
          </div>
        ) : (
          filtered.map(lead => (
            <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="font-black text-gray-900 text-base">{lead.name}</p>
              <p className="text-xs text-gray-600 mt-1">{lead.company}</p>
              <p className="text-xs text-gray-600 mt-1">{lead.phone}</p>
              <p className="text-sm font-bold text-green-600 mt-2">${lead.value.toLocaleString()}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs">Edit</button>
                <button className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-xs">Convert</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}