import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, ChevronDown, Search } from "lucide-react";

const CATEGORY_COLORS = {
  "Tiles": "#E97316", "Flooring": "#8B5CF6", "Electrical": "#F59E0B",
  "Plumbing": "#3B82F6", "Paint": "#10B981", "Furniture": "#EC4899",
  "Doors": "#6366F1", "Lighting": "#F59E0B", "AC Units": "#06B6D4", "Steel": "#6B7280",
};
const CATEGORY_ICONS = {
  "Tiles": "🪨", "Flooring": "🪵", "Electrical": "⚡", "Plumbing": "🔧",
  "Paint": "🎨", "Furniture": "🛋", "Doors": "🚪", "Lighting": "💡",
  "AC Units": "❄️", "Steel": "🔩",
};

const MOCK_RFQS = Array.from({ length: 16 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "Need 500 sqm Floor Tiles – Marble Effect",
    "500 LED Downlights 12W for New Project",
    "PVC Pipes Set – 3 Buildings",
    "Custom Kitchen Cabinets – 12 Units",
    "Exterior Wall Paint – 8,000 sqm",
    "Steel Beams for Industrial Warehouse",
    "UPVC Windows – 200 Units",
    "AC Split Units – 50 Pieces",
    "Bathroom Sets – Complete – 30 Units",
    "Electrical Wiring Full Set – Villa",
    "Wooden Parquet Flooring – 300 sqm",
    "Security Camera System – 20 Cameras",
    "Ceramic Floor Tile 60×60 – 200 sqm",
    "Smart Door Locks – 40 Units",
    "Gypsum Ceiling Boards – 400 sqm",
    "Garden Landscape Stones – 100 sqm",
  ][i],
  category: ["Tiles","Lighting","Plumbing","Furniture","Paint","Steel","Doors","AC Units","Plumbing","Electrical","Flooring","Electrical","Tiles","Doors","Flooring","Tiles"][i],
  quantity: [500, 500, 1, 12, 8000, 20, 200, 50, 30, 1, 300, 20, 200, 40, 400, 100][i],
  unit: ["sqm","pcs","set","units","sqm","tons","units","units","sets","set","sqm","cameras","sqm","units","sqm","sqm"][i],
  budgetMax: [42500, 15000, 8000, 60000, 32000, 120000, 90000, 75000, 45000, 25000, 27000, 18000, 14000, 20000, 12000, 8000][i],
  hasBudget: i % 4 !== 3,
  location: ["New Cairo","Giza","Alexandria","Cairo","New Capital","October City","Heliopolis","Maadi","Sheikh Zayed","Nasr City","Rehab","5th Settlement","Shorouk","New Cairo","Giza","North Coast"][i],
  daysLeft: [3, 7, 1, 14, 5, 2, 10, 1, 7, 3, 4, 1, 6, 8, 2, 14][i],
  quotesReceived: [4, 2, 7, 1, 0, 3, 5, 1, 2, 6, 3, 0, 4, 2, 1, 3][i],
}));

export default function FindRFQPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = MOCK_RFQS.filter(r =>
    !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase())
  );
  const displayed = filtered.slice(0, page * 8);

  const isUrgent = days => days <= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">Product RFQ</span>
          <button className="p-1"><Settings size={20} className="text-gray-700" /></button>
        </div>

        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3" style={{ height: 44 }}>
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by product, category..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {[{ label: "📦 Category" }, { label: "📍 Location" }, { label: "📅 Deadline" }, { label: "💰 Budget" }].map(f => (
            <button key={f.label} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-200">
              {f.label} <ChevronDown size={10} />
            </button>
          ))}
        </div>

        <div className="px-4 pb-2">
          <span className="text-[13px] text-gray-500">{filtered.length} RFQs found</span>
        </div>
      </div>

      {/* Special badge */}
      <div className="mx-4 mt-3 bg-blue-600 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">🔒</span>
          <div>
            <p className="font-black text-white text-sm">Kemetro Sellers & Franchise Owners Only</p>
            <p className="text-blue-100 text-xs mt-0.5 leading-relaxed">
              Request For Quotation — buyers need your products. Submit competitive quotes to win orders.
            </p>
          </div>
        </div>
      </div>

      {/* RFQ cards */}
      <div className="px-4 mt-3 space-y-3 pb-24">
        {displayed.map(rfq => {
          const color = CATEGORY_COLORS[rfq.category] || "#6B7280";
          const icon = CATEGORY_ICONS[rfq.category] || "📦";
          return (
            <div key={rfq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex gap-3">
                {/* Category icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${color}18` }}>
                  {icon}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm leading-tight line-clamp-2">{rfq.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color }}>
                      {rfq.category}
                    </span>
                  </div>
                  <p className="text-sm font-black text-orange-600 mt-1">
                    {rfq.quantity.toLocaleString()} {rfq.unit}
                  </p>
                  {rfq.hasBudget && (
                    <p className="text-xs text-gray-500 mt-0.5">Budget: Up to EGP {rfq.budgetMax.toLocaleString()}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">📍 {rfq.location}</span>
                    <span className={`text-[11px] font-bold ${isUrgent(rfq.daysLeft) ? "text-red-500" : "text-gray-500"}`}>
                      ⏰ {isUrgent(rfq.daysLeft) ? "🔴 " : ""}In {rfq.daysLeft}d
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{rfq.quotesReceived} offers received</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/m/rfq/${rfq.id}`)}
                className="mt-3 w-full bg-orange-600 text-white text-xs font-black py-3 rounded-xl">
                Submit Quote
              </button>
            </div>
          );
        })}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
}