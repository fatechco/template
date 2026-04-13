import { useState } from "react";
import { Search, Plus, FileText, AlertCircle, CheckCircle2, Clock, DollarSign, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const TABS = ["All", "Open", "Quotes Received", "Accepted", "Closed"];

const STATUS_CONFIG = {
  open: { label: "Open", badge: "bg-blue-100 text-blue-700", icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50" },
  quotes_received: { label: "Quotes Received", badge: "bg-orange-100 text-orange-700", icon: MessageCircle, color: "text-orange-600", bg: "bg-orange-50" },
  accepted: { label: "Accepted", badge: "bg-green-100 text-green-700", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  closed: { label: "Closed", badge: "bg-gray-100 text-gray-500", icon: FileText, color: "text-gray-600", bg: "bg-gray-50" },
};

const MOCK_RFQS = [
  { id: 1, num: "KT-RFQ001", status: "quotes_received", product: "Office Chairs - Executive Model", category: "Furniture", qty: 50, unit: "pieces", budget: 3000, city: "Cairo", deadline: "2026-03-28", quotesCount: 4 },
  { id: 2, num: "KT-RFQ002", status: "open", product: "Ceramic Floor Tiles 60×60", category: "Building Materials", qty: 200, unit: "sqm", budget: 1500, city: "Dubai", deadline: "2026-04-10", quotesCount: 0 },
  { id: 3, num: "KT-RFQ003", status: "accepted", product: "Laptop Bags - Corporate Branded", category: "Electronics", qty: 100, unit: "pieces", budget: 800, city: "Riyadh", deadline: "2026-03-15", quotesCount: 6 },
  { id: 4, num: "KT-RFQ004", status: "closed", product: "Office Stationery Bundle", category: "Office Supplies", qty: 20, unit: "boxes", budget: 400, city: "Amman", deadline: "2026-03-01", quotesCount: 2 },
];

export default function KemetroRFQsDesktop() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = MOCK_RFQS.filter(r => {
    const tabMatch = activeTab === "All" || STATUS_CONFIG[r.status].label === activeTab;
    const searchMatch = !search || r.product.toLowerCase().includes(search.toLowerCase()) || r.num.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📝 My RFQs</h1>
            <p className="text-sm text-gray-500 mt-1">Post what you need and let sellers send you their best offers</p>
          </div>
          <Link to="/m/add/rfq"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
            <Plus size={16} /> Post RFQ
          </Link>
        </div>
        
        <div className="relative mt-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search RFQs..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-500">No RFQs found</p>
          <Link to="/m/add/rfq" className="mt-4 inline-block bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm">
            Post Your First RFQ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(rfq => {
            const sc = STATUS_CONFIG[rfq.status];
            const StatusIcon = sc.icon;
            const isUrgent = rfq.status === "open" && new Date(rfq.deadline) - new Date() < 3 * 24 * 60 * 60 * 1000;
            const daysLeft = Math.ceil((new Date(rfq.deadline) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={rfq.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all overflow-hidden">
                {/* Header Bar */}
                <div className={`px-6 py-4 flex items-center justify-between ${sc.bg} border-b border-gray-100`}>
                  <div className="flex items-center gap-3 flex-1">
                    <StatusIcon size={18} className={sc.color} />
                    <div>
                      <p className="text-sm font-black text-gray-900">{rfq.num}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rfq.product}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${sc.badge}`}>{sc.label}</span>
                </div>

                {/* Content Grid */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Budget</p>
                      <p className="text-lg font-black text-orange-600">${rfq.budget}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Quantity</p>
                      <p className="text-sm font-bold text-gray-900">{rfq.qty} {rfq.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Location</p>
                      <p className="text-sm font-bold text-gray-900">{rfq.city}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Category</p>
                      <p className="text-sm font-bold text-gray-900">{rfq.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className={isUrgent ? "text-red-500" : "text-gray-400"} />
                        <span className={`text-xs font-bold ${isUrgent ? "text-red-500" : "text-gray-600"}`}>
                          {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
                        </span>
                      </div>
                      {rfq.quotesCount > 0 && (
                        <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-full">
                          <MessageCircle size={14} className="text-orange-600" />
                          <span className="text-xs font-black text-orange-600">{rfq.quotesCount} Quotes</span>
                        </div>
                      )}
                    </div>
                    <Link to={`/m/kemetro/rfq/${rfq.id}`}
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 transition">
                      View RFQ →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}