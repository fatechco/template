import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, X, Building2, MapPin, BedDouble, DollarSign, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_date" },
  { label: "Price: Low → High", value: "min_price" },
  { label: "Price: High → Low", value: "-min_price" },
  { label: "Most Viewed", value: "-view_count" },
];

const MOCK_PROJECTS = Array.from({ length: 12 }, (_, i) => ({
  id: `proj-mock-${i}`,
  name: [
    "Marassi North Coast", "Midtown Condo", "Sodic West", "Palm Hills October",
    "Mountain View iCity", "The Groove North Coast", "Zed East", "Sarai New Cairo",
    "Badya October", "Swan Lake New Cairo", "Hyde Park New Cairo", "Bloomfields Mostakbal"
  ][i % 12],
  developer_name: ["EMAAR Misr", "Diar Misr", "SODIC", "Palm Hills", "Mountain View", "Inertia", "ORA Developers", "MNHD", "Palm Hills", "Hassan Allam", "Hyde Park", "Tatweer Misr"][i % 12],
  city_name: ["North Coast", "New Cairo", "6th October", "6th October", "New Cairo", "North Coast", "New Cairo", "New Cairo", "6th October", "New Cairo", "New Cairo", "Mostakbal City"][i % 12],
  status: ["Under Construction", "Ready to Move", "Off Plan", "Under Construction", "Ready to Move", "Off Plan"][i % 6],
  min_price: [850000, 1200000, 2500000, 1800000, 950000, 700000, 3200000, 1100000, 880000, 2100000, 1600000, 750000][i % 12],
  max_price: [5000000, 8000000, 12000000, 9000000, 4500000, 3000000, 18000000, 6500000, 4200000, 11000000, 8500000, 3500000][i % 12],
  currency: "EGP",
  total_units: [500, 200, 1200, 800, 450, 300, 150, 600, 900, 250, 700, 1000][i % 12],
  area_from: [85, 120, 200, 160, 95, 75, 250, 110, 90, 180, 140, 80][i % 12],
  area_to: [400, 350, 600, 450, 280, 200, 700, 320, 260, 500, 380, 300][i % 12],
  delivery_year: [2025, 2026, 2027, 2025, 2026, 2027, 2028, 2026, 2027, 2025, 2026, 2027][i % 12],
  is_featured: i % 3 === 0,
  thumbnail_image: null,
  description: "A premier residential development featuring world-class amenities, modern architecture, and a prime location. Designed for those who seek quality living.",
}));

const STATUS_COLORS = {
  "Ready to Move": "bg-green-100 text-green-700",
  "Under Construction": "bg-orange-100 text-orange-700",
  "Off Plan": "bg-blue-100 text-blue-700",
};

function ProjectCard({ project }) {
  const img = project.thumbnail_image || `https://images.unsplash.com/photo-${["1545324418-cc1a3fa10c00", "1512917774080-9991f1c4c750", "1486325212027-8081e485255e", "1580587771525-78b9dba3b914"][parseInt(project.id?.slice(-1) || "0") % 4]}?w=600&q=80`;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img src={img} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {project.is_featured && (
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-xs font-bold px-2 py-1 rounded-lg">Featured</span>
        )}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-lg ${STATUS_COLORS[project.status] || "bg-gray-100 text-gray-700"}`}>
          {project.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#FF6B00] transition-colors">{project.title || project.name}</h3>
        <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
          <Building2 size={13} /> {project.developer_name}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
          <MapPin size={12} /> {project.city_name}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
          <span>From <span className="font-bold text-gray-800">{project.area_from}m²</span></span>
          <span>Delivery <span className="font-bold text-gray-800">{project.delivery_year}</span></span>
          <span><span className="font-bold text-gray-800">{project.total_units?.toLocaleString()}</span> units</span>
        </div>
        <div className="mt-3">
          <p className="text-xs text-gray-400">Starting from</p>
          <p className="font-black text-[#FF6B00] text-lg">{(project.min_price / 1000000).toFixed(1)}M <span className="text-sm font-bold text-gray-500">{project.currency}</span></p>
        </div>
        <Link
          to={`/project-details/${project.id}`}
          className="mt-3 block w-full text-center bg-gray-900 hover:bg-[#FF6B00] text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}

export default function SearchProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("-created_date");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSugg, setShowSearchSugg] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSugg, setShowLocationSugg] = useState(false);

  useEffect(() => {
    const param = searchParams.get("city") || searchParams.get("province") || "";
    setLocationFilter(param);
    setPage(1);
  }, [searchParams]);

  const handleSearchInput = async (val) => {
    setSearchQuery(val);
    if (val.trim().length < 2) { setSearchSuggestions([]); setShowSearchSugg(false); return; }
    const q = val.toLowerCase();
    const names = new Set();
    const matches = [];
    projects.forEach(p => {
      const pname = p.title || p.name || "";
      const dname = p.developer_name || "";
      if (pname.toLowerCase().includes(q) && !names.has(pname)) { names.add(pname); matches.push({ label: pname, type: "Project" }); }
      if (dname.toLowerCase().includes(q) && !names.has(dname)) { names.add(dname); matches.push({ label: dname, type: "Developer" }); }
    });
    if (matches.length === 0) {
      try {
        const data = await base44.entities.Project.list(undefined, 200);
        data.forEach(p => {
          const pname = p.title || p.name || "";
          const dname = p.developer_name || "";
          if (pname.toLowerCase().includes(q) && !names.has(pname)) { names.add(pname); matches.push({ label: pname, type: "Project" }); }
          if (dname.toLowerCase().includes(q) && !names.has(dname)) { names.add(dname); matches.push({ label: dname, type: "Developer" }); }
        });
      } catch {}
    }
    setSearchSuggestions(matches.slice(0, 8));
    setShowSearchSugg(matches.length > 0);
  };

  const handleLocationInput = async (val) => {
    setLocationFilter(val);
    if (val.trim().length < 2) { setLocationSuggestions([]); setShowLocationSugg(false); return; }
    const q = val.toLowerCase();
    try {
      const [cities, districts, areas] = await Promise.all([
        base44.entities.City.list(undefined, 200),
        base44.entities.District.list(undefined, 200),
        base44.entities.Area.list(undefined, 200),
      ]);
      const matches = [
        ...cities.filter(c => c.name?.toLowerCase().includes(q)).map(c => ({ label: c.name, type: "City" })),
        ...districts.filter(d => d.name?.toLowerCase().includes(q)).map(d => ({ label: d.name, type: "District" })),
        ...areas.filter(a => a.name?.toLowerCase().includes(q)).map(a => ({ label: a.name, type: "Area" })),
      ].slice(0, 8);
      setLocationSuggestions(matches);
      setShowLocationSugg(matches.length > 0);
    } catch {}
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const query = {};
      if (statusFilter) query.status = statusFilter;
      const data = await base44.entities.Project.filter(query, sort, 200);
      setProjects(data.length > 0 ? data : MOCK_PROJECTS);
      setTotal(data.length > 0 ? data.length : MOCK_PROJECTS.length);
    } catch {
      setProjects(MOCK_PROJECTS);
      setTotal(MOCK_PROJECTS.length);
    } finally {
      setLoading(false);
    }
  }, [sort, statusFilter]);

  useEffect(() => { fetchProjects(); setPage(1); }, [fetchProjects]);

  const filtered = projects.filter(p => {
    const displayName = p.title || p.name || "";
    const matchSearch = !searchQuery || displayName.toLowerCase().includes(searchQuery.toLowerCase()) || (p.developer_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchLocation = !locationFilter || (p.city_name || "").toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLocation;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero Search Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project or developer name..."
                value={searchQuery}
                onChange={e => handleSearchInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowSearchSugg(false), 150)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchSugg(searchSuggestions.length > 0)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00]"
              />
              {showSearchSugg && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {searchSuggestions.map((s, i) => (
                    <button key={i} onMouseDown={() => { setSearchQuery(s.label); setShowSearchSugg(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between border-b border-gray-50 last:border-0">
                      <span className="font-semibold text-gray-800">{s.label}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{s.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Location (city, area...)"
                value={locationFilter}
                onChange={e => handleLocationInput(e.target.value)}
                onBlur={() => setTimeout(() => setShowLocationSugg(false), 150)}
                onFocus={() => locationFilter.length >= 2 && setShowLocationSugg(locationSuggestions.length > 0)}
                className="border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00] w-44"
              />
              {showLocationSugg && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden w-64">
                  {locationSuggestions.map((s, i) => (
                    <button key={i} onMouseDown={() => { setLocationFilter(s.label); setShowLocationSugg(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between border-b border-gray-50 last:border-0">
                      <span className="font-semibold text-gray-800">{s.label}</span>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{s.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
              <option value="Off Plan">Off Plan</option>
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="text-sm text-gray-500 ml-auto">
              <span className="font-black text-gray-900">{filtered.length}</span> Projects Found
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-[1400px] mx-auto px-4 py-6 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse h-[380px]">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-3">🏗️</p>
            <p className="font-bold text-gray-700 text-lg">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginated.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(pg => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === pg ? "bg-[#FF6B00] text-white shadow-md" : "border border-gray-200 text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00]"}`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      <SuperFooter />
    </div>
  );
}