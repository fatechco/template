import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, ChevronDown, Search } from "lucide-react";

const CATEGORIES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Office", "Retail", "Land", "Chalet", "Duplex"];

const MOCK_REQUESTS = Array.from({ length: 18 }, (_, i) => ({
  id: String(i + 1),
  title: [
    "Looking for 3-bed apartment in New Cairo",
    "Villa with pool in Sheikh Zayed area",
    "Studio apartment near metro station",
    "Office space in 5th Settlement",
    "2-bed apartment for rent in Maadi",
    "Land plot for residential project",
    "Penthouse with Nile view",
    "Furnished apartment short-term",
    "Townhouse with garden, Giza",
    "Duplex in Heliopolis",
    "Chalet in North Coast",
    "Retail space in New Capital",
    "3-bed apartment, New Administrative Capital",
    "Commercial ground floor, Nasr City",
    "Apartment for investment, October City",
    "Villa standalone, Shorouk City",
    "Medical clinic space for rent",
    "Warehouse logistics space",
  ][i],
  categories: [["Apartment"], ["Villa"], ["Studio", "Apartment"], ["Office"], ["Apartment"], ["Land"], ["Penthouse"], ["Apartment"], ["Townhouse"], ["Duplex"], ["Chalet"], ["Retail"], ["Apartment"], ["Retail"], ["Apartment"], ["Villa"], ["Office"], ["Warehouse"]][i],
  location: ["New Cairo", "Sheikh Zayed", "Cairo", "5th Settlement", "Maadi", "October City", "Zamalek", "Heliopolis", "Giza", "Heliopolis", "North Coast", "New Capital", "New Capital", "Nasr City", "October City", "Shorouk", "Nasr City", "6th of October"][i],
  budgetMin: [800000, 5000000, 300000, 15000, 8000, 2000000, 3000000, 5000, 2500000, 1500000, 1200000, 25000, 900000, 20000, 600000, 4000000, 10000, 500000][i],
  budgetMax: [1500000, 10000000, 600000, 30000, 15000, 5000000, 8000000, 12000, 4000000, 3000000, 2000000, 50000, 1800000, 40000, 1200000, 8000000, 25000, 1000000][i],
  purpose: ["For Sale", "For Sale", "For Rent", "For Rent", "For Rent", "For Sale", "For Sale", "For Rent", "For Sale", "For Sale", "For Sale", "For Rent", "For Sale", "For Rent", "For Sale", "For Sale", "For Rent", "For Rent"][i],
  beds: [3, null, 1, null, 2, null, 4, 2, 3, 3, 2, null, 3, null, 2, 5, null, null][i],
  baths: [2, null, 1, null, 1, null, 3, 1, 2, 2, 2, null, 2, null, 1, 4, null, null][i],
  area: [180, 500, 60, 120, 100, 1000, 250, 80, 300, 200, 150, 200, 200, 180, 130, 600, 150, 500][i],
  postedAgo: ["2h", "5h", "1d", "2d", "3h", "1d", "4h", "6h", "2d", "12h", "3d", "1d", "5h", "2d", "7h", "1d", "3h", "2d"][i],
  anonymous: i % 3 === 0,
  avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
  categoryIcon: ["🏠", "🏡", "🏠", "🏢", "🏠", "🌿", "🏙", "🏠", "🏡", "🏠", "🏖", "🛍", "🏠", "🛍", "🏠", "🏡", "🏥", "🏭"][i],
}));

export default function FindBuyRequestPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ category: null, recent: false });
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, []);

  const filtered = MOCK_REQUESTS.filter(r => {
    if (query && !r.title.toLowerCase().includes(query.toLowerCase()) && !r.location.toLowerCase().includes(query.toLowerCase())) return false;
    if (filters.category && !r.categories.includes(filters.category)) return false;
    return true;
  });

  const displayed = filtered.slice(0, page * 8);

  const formatBudget = (min, max) => {
    const fmt = n => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n;
    return `EGP ${fmt(min)} – ${fmt(max)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">Property Buy Requests</span>
          <button className="p-1"><Settings size={20} className="text-gray-700" /></button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3" style={{ height: 44 }}>
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by category, location..."
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none" />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {[{ label: "🏘 Category" }, { label: "📍 Location" }, { label: "💰 Budget" }].map(f => (
            <button key={f.label} className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-200">
              {f.label} <ChevronDown size={10} />
            </button>
          ))}
          <button
            onClick={() => setFilters(f => ({ ...f, recent: !f.recent }))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.recent ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
            📅 Recent
          </button>
        </div>

        <div className="px-4 pb-2">
          <span className="text-[13px] text-gray-500">{filtered.length} requests found</span>
        </div>
      </div>

      {/* Special badge */}
      <div className="mx-4 mt-3 bg-orange-600 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">🔒</span>
          <div>
            <p className="font-black text-white text-sm">Special Feature</p>
            <p className="text-orange-100 text-xs mt-0.5 leading-relaxed">
              Property Buy Requests are visible only to Kemedar registered users and Franchise Owners.
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 mt-3 space-y-3 pb-24">
        {displayed.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {req.anonymous ? (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center" style={{ filter: "blur(4px)" }}>
                      <img src={req.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <img src={req.avatar} alt="buyer" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-sm border border-white">
                  {req.categoryIcon}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm leading-tight">{req.title}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {req.categories.map(c => (
                    <span key={c} className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{req.purpose}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">📍 {req.location}</p>
                <p className="text-sm font-black text-orange-600 mt-0.5">{formatBudget(req.budgetMin, req.budgetMax)}</p>
                {(req.beds || req.baths || req.area) && (
                  <div className="flex gap-2 mt-1">
                    {req.beds && <span className="text-[11px] text-gray-500">🛏 {req.beds}</span>}
                    {req.baths && <span className="text-[11px] text-gray-500">🚿 {req.baths}</span>}
                    {req.area && <span className="text-[11px] text-gray-500">📐 {req.area} sqm</span>}
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1">Posted {req.postedAgo} ago</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => navigate(`/m/buy-request/${req.id}`)}
                className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-xs font-bold">
                Match My Property
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold">
                💬 Message Buyer
              </button>
            </div>
          </div>
        ))}
        <div ref={loaderRef} className="h-4" />
      </div>
    </div>
  );
}