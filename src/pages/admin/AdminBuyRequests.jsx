import { useState } from "react";
import { Eye, Edit, Link as LinkIcon, PauseCircle, Trash2 } from "lucide-react";

const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Paused: "bg-yellow-100 text-yellow-700", Expired: "bg-red-100 text-red-700", Pending: "bg-blue-100 text-blue-700" };

const MOCK_REQUESTS = Array.from({ length: 16 }, (_, i) => ({
  id: `BR-${String(i + 1).padStart(3, "0")}`,
  buyer: ["Ahmed Hassan", "Fatima Mohamed", "Omar Rashid", "Sara Khaled", "Mohamed Nasser"][i % 5],
  categories: [["Apartment", "Studio"], ["Villa"], ["Office"], ["Land"], ["Penthouse", "Apartment"]][i % 5],
  location: ["New Cairo, Cairo", "Sheikh Zayed, Giza", "Maadi, Cairo", "6th October", "Downtown Cairo"][i % 5],
  budgetMin: [80000, 300000, 2000, 500000, 1000000][i % 5],
  budgetMax: [150000, 600000, 5000, 900000, 3000000][i % 5],
  purpose: ["Buy", "Rent", "Buy", "Buy", "Rent"][i % 5],
  status: ["Active", "Active", "Paused", "Active", "Expired", "Pending"][i % 6],
  date: `2026-03-${String((i % 18) + 1).padStart(2, "0")}`,
}));

export default function AdminBuyRequests() {
  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_REQUESTS.filter(r => {
    const matchSearch = !search || r.buyer.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchPurpose = purposeFilter === "All" || r.purpose === purposeFilter;
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchPurpose && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Buy Requests</h1>
        <p className="text-gray-500 text-sm">{filtered.length} requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search buyer or request #..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-56"
        />
        <select value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="All">All Purposes</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="All">All Statuses</option>
          <option>Active</option>
          <option>Paused</option>
          <option>Expired</option>
          <option>Pending</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>All Categories</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Studio</option>
          <option>Office</option>
          <option>Land</option>
        </select>
        <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="From date" />
        <input type="date" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="To date" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Request #</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Buyer</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Categories</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Budget</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Purpose</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3 font-bold text-gray-900">{r.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{r.buyer}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.categories.map(c => <span key={c} className="bg-blue-50 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{c}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{r.location}</td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-800">
                    ${r.budgetMin.toLocaleString()} – ${r.budgetMax.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.purpose === "Buy" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>{r.purpose}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={12} /></button>
                      <button title="Edit" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Edit size={12} /></button>
                      <button title="Match Properties" className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center"><LinkIcon size={12} /></button>
                      <button title="Deactivate" className="w-7 h-7 rounded-lg hover:bg-yellow-50 text-yellow-600 flex items-center justify-center"><PauseCircle size={12} /></button>
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