import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Search, Pencil, Share2, X, BedDouble, Bath, Maximize2, MapPin, Clock } from "lucide-react";

const TABS = ["All", "Active", "Expired", "Closed"];

const MOCK_REQUESTS = [
  { id: 1, num: "#BR-001", status: "active",  categories: ["Apartment", "Studio"], location: "New Cairo or Maadi",          budgetMin: 150000, budgetMax: 300000, beds: 3, baths: 2, area: 120, description: "Looking for a modern apartment close to the ring road with good security and parking.", postedDays: 2 },
  { id: 2, num: "#BR-002", status: "active",  categories: ["Villa"],               location: "Sheikh Zayed or 6th October", budgetMin: 500000, budgetMax: 900000, beds: 5, baths: 4, area: 350, description: "Need a standalone villa with garden and pool. Private compound preferred.", postedDays: 5 },
  { id: 3, num: "#BR-003", status: "expired", categories: ["Penthouse"],           location: "Heliopolis",                  budgetMin: 400000, budgetMax: 700000, beds: 4, baths: 3, area: 250, description: "Penthouse with Nile view or city skyline. Ultra lux finishing required.", postedDays: 30 },
  { id: 4, num: "#BR-004", status: "closed",  categories: ["Apartment"],           location: "Maadi",                       budgetMin: 80000,  budgetMax: 150000, beds: 2, baths: 1, area: 90,  description: "Cozy 2-bedroom apartment for a small family near metro station.", postedDays: 45 },
];

const STATUS_CONFIG = {
  active:  { label: "Active",  bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
  expired: { label: "Expired", bg: "bg-gray-100",   text: "text-gray-500",   dot: "bg-gray-400" },
  closed:  { label: "Closed",  bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-400" },
};

const TAB_COUNTS = (requests) => TABS.reduce((acc, t) => {
  acc[t] = t === "All" ? requests.length : requests.filter(r => r.status === t.toLowerCase()).length;
  return acc;
}, {});

function BuyRequestCard({ req, onRemove }) {
  const status = STATUS_CONFIG[req.status];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header stripe */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-black text-gray-400">{req.num}</span>
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${status.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                <span className={`text-[11px] font-black ${status.text}`}>{status.label}</span>
              </div>
            </div>
            {/* Category chips */}
            <div className="flex gap-1.5 flex-wrap">
              {req.categories.map(c => (
                <span key={c} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">{c}</span>
              ))}
            </div>
          </div>
          <p className="font-black text-orange-500 text-base whitespace-nowrap">
            ${(req.budgetMin / 1000).toFixed(0)}K – ${(req.budgetMax / 1000).toFixed(0)}K
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
          <p className="text-[13px] text-gray-600">{req.location}</p>
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <BedDouble size={13} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-semibold">{req.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={13} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-semibold">{req.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 size={13} className="text-gray-400" />
            <span className="text-xs text-gray-600 font-semibold">{req.area} m²</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">{req.description}</p>

        {/* Posted */}
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-gray-300" />
          <span className="text-[11px] text-gray-400">Posted {req.postedDays} days ago</span>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex border-t border-gray-100">
        {[
          { icon: Pencil,  label: "Edit",    color: "text-gray-600",  bg: "" },
          { icon: Share2,  label: "Share",   color: "text-teal-600",  bg: "" },
          { icon: Search,  label: "Matches", color: "text-blue-600",  bg: "" },
          { icon: X,       label: "Close",   color: "text-red-500",   bg: "", onClick: onRemove },
        ].map((btn, i) => {
          const Icon = btn.icon;
          return (
            <button key={i} onClick={btn.onClick}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-bold transition-colors hover:bg-gray-50 ${btn.color} ${i < 3 ? "border-r border-gray-100" : ""}`}>
              <Icon size={14} />
              {btn.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MyBuyRequestsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const counts = TAB_COUNTS(requests);

  const filtered = requests.filter(r => {
    const tabMatch = activeTab === "All" || r.status === activeTab.toLowerCase();
    const searchMatch = !search || r.description.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-28">

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 flex items-center justify-between" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-base font-black text-gray-900">My Buy Requests</h1>
        <button
          onClick={() => navigate("/m/add/request")}
          className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm active:opacity-80"
        >
          <Plus size={18} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3" style={{ height: 42 }}>
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by location or description..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-500"
            }`}
          >
            <span>{tab}</span>
            {counts[tab] > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">📋</span>
            <p className="font-black text-gray-700 text-base">No buy requests found</p>
            <p className="text-sm text-gray-400 mt-1">Post what you're looking for and let sellers come to you</p>
            <button
              onClick={() => navigate("/m/add/request")}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl"
            >
              + Post Buy Request
            </button>
          </div>
        ) : (
          filtered.map(req => (
            <BuyRequestCard
              key={req.id}
              req={req}
              onRemove={() => setRequests(prev => prev.filter(r => r.id !== req.id))}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/m/add/request")}
        className="fixed bottom-24 right-4 w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-xl z-30 active:opacity-80"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}