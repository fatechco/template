import { useState } from "react";
import { Eye, Edit, CheckCircle, Star, Shield, XCircle, Trash2, Download, Search } from "lucide-react";

const TABS = ["All", "Active", "Pending", "Imported", "On-Site", "Franchise"];

const CATEGORY_FILTER_OPTIONS = ["All Categories", "Apartment", "Villa", "Duplex", "Studio", "Chalet", "Land", "Commercial", "Other"];
const PURPOSE_FILTER_OPTIONS = ["All Purposes", "For Sale", "For Rent", "For Investment", "For Daily Booking"];
const SOURCE_FILTER_OPTIONS = ["All Sources", "Aqarmap", "OLX", "Property Finder", "Bayut", "Direct"];
const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Rejected: "bg-red-100 text-red-700", "On-Site": "bg-blue-100 text-blue-700" };

const MOCK_PROPS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: ["Modern Apartment New Cairo", "Villa Sheikh Zayed", "Studio Maadi", "Office Downtown", "Duplex 5th Settlement", "Penthouse Heliopolis", "Twin House 6th October", "Chalet North Coast", "Shop Citystars", "Land New Capital"][i % 10],
  owner: ["Ahmed Hassan", "Fatima Agency", "Omar Dev", "Sara Khaled", "Mohamed Co"][i % 5],
  category: ["Apartment", "Villa", "Studio", "Office", "Duplex"][i % 5],
  purpose: ["Sale", "Rent", "Investment", "Daily Booking"][i % 4],
  price: ["$120,000", "$380,000", "$700/mo", "$3,200/mo", "$260,000", "$850,000", "$1.2M", "$145,000", "$95,000", "$320,000"][i % 10],
  city: ["New Cairo", "Sheikh Zayed", "Maadi", "Downtown", "6th October"][i % 5],
  status: ["Active", "Active", "Pending", "Active", "Pending", "On-Site"][i % 6],
  source: ["Direct", "Imported", "Franchise"][i % 3],
  featured: i % 4 === 0,
  verified: i % 3 === 0,
  views: Math.floor(Math.random() * 1500),
  date: `2026-03-${String((i % 18) + 1).padStart(2, "0")}`,
  image: ["photo-1545324418-cc1a3fa10c00", "photo-1600596542815-ffad4c1539a9", "photo-1502672260266-1c1ef2d93688", "photo-1497366216548-37526070297c"][i % 4],
}));

export default function AdminProperties() {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterPurpose, setFilterPurpose] = useState("All Purposes");
  const [filterSource, setFilterSource] = useState("All Sources");

  const isImportedView = tab === "Imported" || tab === "Pending";

  const filtered = MOCK_PROPS.filter(p => {
    const matchTab = tab === "All" || p.status === tab || (tab === "Franchise" && p.source === "Franchise") || (tab === "Imported" && p.source === "Imported");
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All Categories" || p.category === filterCategory;
    const matchPurpose = filterPurpose === "All Purposes" || p.purpose === filterPurpose;
    const matchSource = filterSource === "All Sources" || (isImportedView ? p.source === filterSource : true);
    return matchTab && matchSearch && matchCat && matchPurpose && matchSource;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Properties Management</h1>
          <p className="text-gray-500 text-sm">{filtered.length} properties</p>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-3 py-2 rounded-lg text-xs transition-colors">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search title or owner..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-52" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          {CATEGORY_FILTER_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={filterPurpose} onChange={e => setFilterPurpose(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          {PURPOSE_FILTER_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        {isImportedView && (
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            {SOURCE_FILTER_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        )}
        {!isImportedView && <>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            <option>All Country</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            <option>All City</option>
          </select>
        </>}
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>Featured: All</option><option>Featured Only</option><option>Not Featured</option>
        </select>
        {isImportedView && (
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">📥 {filtered.length} imported results</span>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-orange-700">{selected.length} selected</span>
          <button className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-600">Approve Selected</button>
          <button className="text-xs bg-yellow-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-600">Feature Selected</button>
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
                <th className="px-4 py-3 text-left font-bold text-gray-700">Property</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Purpose</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
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
                      <span className="font-semibold text-gray-800 text-xs max-w-[140px] truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.owner}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.category}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">{p.purpose}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs">{p.price}</td>
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