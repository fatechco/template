import { useState } from "react";
import { Eye, Edit, CheckCircle, Star, Shield, XCircle, Trash2, Download, Building2, Search } from "lucide-react";

const SOURCE_FILTER_OPTIONS = ["All Sources", "Aqarmap", "OLX", "Property Finder", "Bayut", "Direct"];

const TABS = ["All", "Active", "Pending", "Under Construction", "Ready to Move", "Off Plan", "Imported", "Franchise"];
const STATUS_COLORS = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
  "Under Construction": "bg-blue-100 text-blue-700",
  "Ready to Move": "bg-emerald-100 text-emerald-700",
  "Off Plan": "bg-purple-100 text-purple-700",
};

const MOCK_PROJECTS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: [
    "Marassi North Coast", "New Cairo Heights", "Palm Hills October", "Sodic East",
    "Emaar Misr Uptown", "Hyde Park New Cairo", "Mountain View iCity", "Sarai New Cairo",
    "Haptown Hassan Allam", "Badya October City", "The Address East", "Azha Ain Sokhna",
    "O West October", "IL Monte Galala", "Mivida New Cairo", "Zed East New Cairo",
    "Capital Gardens", "Swan Lake October", "Villette New Cairo", "The Crown October"
  ][i % 20],
  developer: ["EMAAR Misr", "SODIC", "Palm Hills", "Mountain View", "Hassan Allam", "Hyde Park Developments", "Ora Developers"][i % 7],
  city: ["North Coast", "New Cairo", "6th October", "Ain Sokhna", "New Capital"][i % 5],
  status: ["Active", "Pending", "Under Construction", "Ready to Move", "Off Plan"][i % 5],
  source: ["Direct", "Imported", "Franchise"][i % 3],
  unitTypes: [["Apartment", "Villa"], ["Chalet", "Studio"], ["Villa", "Twin House"], ["Apartment", "Penthouse"]][i % 4],
  minPrice: ["4.5M", "2.2M", "8M", "1.9M", "12M"][i % 5],
  maxPrice: ["32M", "15M", "45M", "9M", "85M"][i % 5],
  currency: "EGP",
  totalUnits: [3500, 800, 1200, 500, 2000, 650, 4000, 900][i % 8],
  delivery: [2026, 2027, 2025, 2028, 2026][i % 5],
  featured: i % 4 === 0,
  verified: i % 3 === 0,
  views: Math.floor(Math.random() * 2000),
  date: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  image: ["photo-1613977257592-4871e5fcd7c4", "photo-1486325212027-8081e485255e", "photo-1560448204-e02f11c3d0e2", "photo-1545324418-cc1a3fa10c00"][i % 4],
}));

export default function AdminProjects() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterType, setFilterType] = useState("All Types");

  const isImportedView = tab === "Imported" || tab === "Pending";

  const filtered = MOCK_PROJECTS.filter(p => {
    const matchTab =
      tab === "All" ||
      p.status === tab ||
      (tab === "Franchise" && p.source === "Franchise") ||
      (tab === "Imported" && p.source === "Imported");
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.developer.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === "All Sources" || (isImportedView ? p.source === filterSource : true);
    return matchTab && matchSearch && matchSource;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Projects Management</h1>
          <p className="text-gray-500 text-sm">{filtered.length} projects</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-[#FF6B00] text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-orange-600 transition-colors">
            <Building2 size={13} /> Add Project
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-3 py-2 rounded-lg text-xs transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search project or developer..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-56" />
        </div>
        {isImportedView && (
          <>
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
              {SOURCE_FILTER_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
              {["All Types", "Residential", "Commercial", "Mixed Use", "Administrative"].map(o => <option key={o}>{o}</option>)}
            </select>
          </>
        )}
        {!isImportedView && ["Unit Type", "Delivery Year", "Country", "City", "Price Range"].map(f => (
          <select key={f} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            <option>All {f}</option>
          </select>
        ))}
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>Featured: All</option>
          <option>Featured Only</option>
          <option>Not Featured</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>Verified: All</option>
          <option>Verified Only</option>
          <option>Not Verified</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-orange-700">{selected.length} selected</span>
          <button className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-600">Approve Selected</button>
          <button className="text-xs bg-yellow-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-600">Feature Selected</button>
          <button className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-600">Reject Selected</button>
          <button className="text-xs border border-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100">Export CSV</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} className="accent-orange-500" />
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Developer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Unit Types</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price Range</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Delivery</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">⭐</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">🛡</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Views</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-orange-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={`https://images.unsplash.com/${p.image}?w=50&q=60`} alt="" className="w-10 h-8 object-cover rounded-lg flex-shrink-0" />
                      <span className="font-semibold text-gray-800 text-xs max-w-[140px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.developer}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.unitTypes.map(t => (
                        <span key={t} className="bg-blue-50 text-blue-700 font-bold text-[10px] px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs whitespace-nowrap">{p.minPrice} – {p.maxPrice} <span className="text-gray-400 font-normal">{p.currency}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.totalUnits?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.delivery}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.city}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.source}</td>
                  <td className="px-4 py-3">{p.featured ? <Star size={14} className="fill-yellow-400 text-yellow-400" /> : <span className="text-gray-300 text-xs">—</span>}</td>
                  <td className="px-4 py-3">{p.verified ? <Shield size={14} className="text-green-500" /> : <span className="text-gray-300 text-xs">—</span>}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.views}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={12} /></button>
                      <button title="Edit" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Edit size={12} /></button>
                      <button title="Approve" className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle size={12} /></button>
                      <button title="Feature" className="w-7 h-7 rounded-lg hover:bg-yellow-50 text-yellow-500 flex items-center justify-center"><Star size={12} /></button>
                      <button title="Verify" className="w-7 h-7 rounded-lg hover:bg-teal-50 text-teal-600 flex items-center justify-center"><Shield size={12} /></button>
                      <button title="Reject" className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center"><XCircle size={12} /></button>
                      <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}