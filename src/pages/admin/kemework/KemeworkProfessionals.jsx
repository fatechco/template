import { useState } from "react";
import { Search } from "lucide-react";

const PROS = [
  { id: 1, name: "Ahmed Hassan", username: "ahmed.hassan", category: "Interior Design", country: "Egypt", services: 3, orders: 84, rating: 4.9, verified: true, accredited: true, status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=70" },
  { id: 2, name: "Sara Mohamed", username: "sara.m", category: "Electrical", country: "UAE", services: 2, orders: 62, rating: 4.8, verified: true, accredited: false, status: "Active", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70" },
  { id: 3, name: "Omar Khalid", username: "omar.k", category: "Plumbing", country: "Saudi Arabia", services: 1, orders: 145, rating: 4.7, verified: false, accredited: false, status: "Pending", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=70" },
  { id: 4, name: "Layla Nour", username: "layla.n", category: "Landscaping", country: "Jordan", services: 4, orders: 41, rating: 4.9, verified: true, accredited: true, status: "Active", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&q=70" },
  { id: 5, name: "Kareem Saad", username: "kareem.s", category: "Carpentry", country: "Egypt", services: 2, orders: 112, rating: 4.6, verified: false, accredited: false, status: "Suspended", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70" },
];

const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
};

export default function KemeworkProfessionals() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = PROS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.username.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const allSelected = filtered.length > 0 && filtered.every(p => selected.includes(p.id));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Professionals</h1>
          <p className="text-sm text-gray-500">{PROS.length} total professionals</p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-700">✅ Verify Selected ({selected.length})</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700">⛔ Suspend Selected</button>
            </>
          )}
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600">Export CSV</button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or username..." className="text-sm outline-none flex-1" />
        </div>
        {["Category", "Country", "Status"].map(f => (
          <select key={f} className="border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none bg-white">
            <option>All {f}</option>
          </select>
        ))}
        <div className="flex gap-2">
          {["Verified", "Accredited"].map(f => (
            <label key={f} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
              <input type="checkbox" className="accent-teal-600" /> {f}
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left"><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filtered.map(p => p.id))} className="accent-teal-600" /></th>
              {["Professional", "Category", "Country", "Services", "Orders", "Rating", "Verified", "Accredited", "Status", "Actions"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-black text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(pro => (
              <tr key={pro.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(pro.id)} onChange={() => toggleSelect(pro.id)} className="accent-teal-600" /></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <img src={pro.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{pro.name}</p>
                      <p className="text-[10px] text-gray-400">@{pro.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-gray-600">{pro.category}</td>
                <td className="px-3 py-3 text-xs text-gray-600">{pro.country}</td>
                <td className="px-3 py-3 text-xs font-bold text-gray-900">{pro.services}</td>
                <td className="px-3 py-3 text-xs font-bold text-gray-900">{pro.orders}</td>
                <td className="px-3 py-3 text-xs">⭐ {pro.rating}</td>
                <td className="px-3 py-3 text-xs">{pro.verified ? "✅" : <span className="text-gray-300">—</span>}</td>
                <td className="px-3 py-3 text-xs">{pro.accredited ? "🏅" : <span className="text-gray-300">—</span>}</td>
                <td className="px-3 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[pro.status]}`}>{pro.status}</span></td>
                <td className="px-3 py-3">
                  <div className="flex gap-1 flex-wrap">
                    <button className="px-2 py-1 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">View</button>
                    {!pro.verified && <button className="px-2 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-lg hover:bg-green-200">✅ Verify</button>}
                    {pro.status !== "Suspended" && <button className="px-2 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-lg hover:bg-red-200">⛔ Suspend</button>}
                    {!pro.accredited && <button className="px-2 py-1 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200">🏅 Accredit</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}