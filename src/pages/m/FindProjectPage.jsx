import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Map, ChevronDown, X, SlidersHorizontal, Search, List } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/find-project/ProjectCard";
import ProjectFiltersSheet from "@/components/find-project/ProjectFiltersSheet";
import { base44 } from "@/api/base44Client";

const CITY_TABS = ["All", "New Cairo", "5th Settlement", "6th October", "Sheikh Zayed", "Admin Capital", "Ain Sukhna", "North Coast", "Alexandria"];

const PROJECT_COORDS = [
  [31.0409, 28.7922], // North Coast
  [30.0131, 31.4294], // Sheikh Zayed
  [30.0272, 31.4967], // New Cairo
  [29.9348, 31.0065], // 6th October
  [30.0272, 31.4967], // New Cairo
  [30.0200, 31.7500], // Admin Capital
  [29.9348, 31.0065], // 6th October
  [30.0272, 31.4967], // New Cairo
  [30.0272, 31.4967], // New Cairo
  [30.0272, 31.4967], // New Cairo
  [30.0272, 31.4967], // New Cairo
  [29.5970, 32.3500], // Ain Sukhna
  [31.0409, 28.7922], // North Coast
  [29.9348, 31.0065], // 6th October
];

const MOCK_PROJECTS = Array.from({ length: 14 }, (_, i) => ({
  id: String(i + 1),
  slug: `project-${i + 1}`,
  name: ["Marassi North Coast", "The Crown Sheikh Zayed", "Lumia New Cairo", "Palm Parks 6th October", "Sarai New Cairo", "IL Bosco Admin Capital", "Badya 6th October", "Mountain View iCity", "Swan Lake Residence", "Midtown Condo", "Hyde Park New Cairo", "Azha Ain Sukhna", "Bluemar North Coast", "O West 6th October"][i],
  developer: ["Emaar Misr", "Palm Hills", "SODIC", "Wadi Degla", "MNHD", "Misr Italia", "Palm Hills", "Mountain View", "Hassan Allam", "Better Home", "Hyde Park Dev", "ORA Developers", "Emaar Misr", "Orascom"][i],
  developerLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(["EM","PH","SD","WD","MN","MI","PH","MV","HA","BH","HP","OR","EM","OC"][i])}&background=FF6B00&color=fff&size=80`,
  city: ["North Coast", "Sheikh Zayed", "New Cairo", "6th October", "New Cairo", "Admin Capital", "6th October", "New Cairo", "New Cairo", "New Cairo", "New Cairo", "Ain Sukhna", "North Coast", "6th October"][i],
  area: ["Sidi Abd El Rahman", "Beverly Hills", "5th Settlement", "6th October", "Mostkbal City", "R7", "6th October", "New Cairo", "5th Settlement", "Downtown", "New Cairo", "Ain Sukhna", "Sidi Heneish", "6th October"][i],
  image: `https://images.unsplash.com/photo-${["1613977257592-4871e5fcd7c4","1560518883-ce09059eeffa","1486325212027-8081e485255e","1582407947304-d0b8a61e3a41","1600596542815-ffad4c1539a9","1580587771525-78b9dba3b914","1512917774080-9991f1c4c750","1564013799919-ab600027ffc6","1502672260266-1c1ef2d93688","1600047509807-ba8f99d2cdde","1493809842364-78817add7ffb","1560448204-e02f11c3d0e2","1580587771525-78b9dba3b914","1613977257592-4871e5fcd7c4"][i]}?w=800&q=80`,
  badge: i % 4 === 0 ? "FEATURED" : i % 5 === 0 ? "NEW" : null,
  units: [200, 500, 1200, 800, 3000, 1500, 7000, 2000, 600, 900, 2500, 400, 300, 4000][i],
  area_sqm: [100, 130, 85, 150, 110, 90, 200, 120, 140, 95, 180, 160, 100, 175][i],
  delivery: [2025, 2026, 2027, 2025, 2028, 2026, 2030, 2027, 2025, 2026, 2028, 2026, 2027, 2029][i],
  priceFrom: ["4.5M", "6M", "3.2M", "5M", "2.8M", "7M", "3.5M", "4.2M", "5.5M", "2.5M", "6.5M", "8M", "9M", "3M"][i],
  tags: [["Residential","Beachfront","Pool","Gym"],["Luxury","Pool","Clubhouse"],["Apartments","Gym","Park"],["Villas","Garden","Tennis"],["Mixed Use","Commercial","Residential"],["Smart City","Green","Eco"],["Villas","Apartments","Golf"],["Residential","Club","Pool"],["Residential","Gym","Security"],["Apartments","Rooftop","Commercial"],["Compound","Spa","Club"],["Chalet","Beach","Pool"],["Chalet","Marina","Beachfront"],["Villas","Apartments","Lake"]][i],
  type: ["Residential","Mixed Use","Apartments","Villas"][i % 4],
  lat: PROJECT_COORDS[i][0],
  lng: PROJECT_COORDS[i][1],
}));

export default function FindProjectPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCity, setActiveCity] = useState("All");
  const [activeSheet, setActiveSheet] = useState(null);
  const [filters, setFilters] = useState({ city: null, type: null, price: null, delivery: null });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const loaderRef = useRef(null);
  const cityTabsRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    base44.entities.Project.list(undefined, 300)
      .then(data => setAllProjects(data))
      .catch(() => {});
  }, []);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const q = val.toLowerCase();
    const source = allProjects.length > 0 ? allProjects : MOCK_PROJECTS;
    const names = new Set();
    const matches = [];
    source.forEach(p => {
      const pname = p.title || p.name || "";
      const dname = p.developer_name || p.developer || "";
      if (pname.toLowerCase().includes(q) && !names.has(pname)) { names.add(pname); matches.push({ label: pname, type: "Project" }); }
      if (dname.toLowerCase().includes(q) && !names.has(dname)) { names.add(dname); matches.push({ label: dname, type: "Developer" }); }
    });
    setSuggestions(matches.slice(0, 8));
    setShowSuggestions(matches.length > 0);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => { setPage(p => p + 1); setLoading(false); }, 600);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const filtered = MOCK_PROJECTS.filter(p => {
    const q = query.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.developer.toLowerCase().includes(q)) return false;
    if (activeCity !== "All" && p.city !== activeCity) return false;
    if (filters.type && p.type !== filters.type) return false;
    return true;
  });

  const displayed = filtered.slice(0, page * 6);

  const CHIPS = [
    { key: "city", icon: "📍", label: "City" },
    { key: "type", icon: "🏗", label: "Type" },
    { key: "price", icon: "💰", label: "Price" },
    { key: "delivery", icon: "📅", label: "Delivery" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        {/* Top bar */}
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">Find Projects</span>
          <button className="p-1" onClick={() => setShowMap(v => !v)}>
            {showMap ? <List size={20} className="text-gray-700" /> : <Map size={20} className="text-gray-700" />}
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2 relative">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => query.length >= 2 && setShowSuggestions(suggestions.length > 0)}
              placeholder="Search project name, developer..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
            />
            {query && <button onClick={() => { setQuery(""); setSuggestions([]); setShowSuggestions(false); }}><X size={14} className="text-gray-400" /></button>}
          </div>
          {showSuggestions && (
            <div className="absolute left-4 right-4 top-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button key={i} onMouseDown={() => { setQuery(s.label); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 flex items-center justify-between border-b border-gray-50 last:border-0">
                  <span className="font-semibold text-gray-800">{s.label}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setActiveSheet(chip.key)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                filters[chip.key] ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {chip.icon} {chip.label}
              {filters[chip.key] ? (
                <span onClick={e => { e.stopPropagation(); setFilters(f => ({ ...f, [chip.key]: null })); }}>
                  <X size={10} />
                </span>
              ) : <ChevronDown size={10} />}
            </button>
          ))}
          <button
            onClick={() => setActiveSheet("more")}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-200"
          >
            <SlidersHorizontal size={11} /> More
          </button>
        </div>

        {/* City tabs */}
        <div ref={cityTabsRef} className="flex gap-2 px-4 pb-2.5 overflow-x-auto no-scrollbar">
          {CITY_TABS.map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeCity === city
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-4 pb-2">
          <span className="text-[13px] text-gray-500">{filtered.length} projects found</span>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-3 space-y-4 pb-24">
        {displayed.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <div ref={loaderRef} className="py-2">
          {loading && (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map View */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex items-center px-4 gap-3 bg-white border-b border-gray-100" style={{ height: 52 }}>
            <button onClick={() => setShowMap(false)} className="p-1 -ml-1">
              <ArrowLeft size={22} className="text-gray-900" />
            </button>
            <span className="flex-1 text-center font-black text-gray-900 text-base">Projects Map</span>
          </div>
          <div className="flex-1">
            <MapContainer center={[30.0444, 31.2357]} zoom={10} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filtered.map(project => (
                project.lat && project.lng ? (
                  <Marker key={project.id} position={[project.lat, project.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{project.name}</p>
                        <p className="text-gray-500">{project.developer}</p>
                        <p className="text-orange-600 font-bold">{project.priceFrom}</p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))}
            </MapContainer>
          </div>
          <div className="bg-white border-t border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500 text-center">{filtered.length} projects in this area</p>
          </div>
        </div>
      )}

      {/* Filter sheet */}
      <ProjectFiltersSheet
        open={!!activeSheet}
        activeKey={activeSheet}
        onClose={() => setActiveSheet(null)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}