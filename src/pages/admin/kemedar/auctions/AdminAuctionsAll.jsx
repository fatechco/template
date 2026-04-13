import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, ChevronDown, Eye, Edit2, Star, Trash2, History } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function AdminAuctionsAll() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "all", city: "all", category: "all" });
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await base44.entities.PropertyAuction.list("-created_date", 500);
    setAuctions(data);
    setLoading(false);
  };

  const loadEvents = async (auctionId) => {
    const data = await base44.entities.AuctionEvent.filter({ auctionId }, "-recordedAt", 100);
    setEvents(data);
  };

  const filtered = auctions.filter(a => {
    const matchesSearch = a.auctionCode?.includes(search.toUpperCase()) || a.auctionTitle?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filters.status === "all" || a.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📋 All Auctions</h1>
        <p className="text-xs text-gray-500 mt-1">{filtered.length} auctions</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by code or property name..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "status", label: "Status", options: ["all", "live", "scheduled", "registration", "completed", "cancelled"] },
          ].map(filter => (
            <select key={filter.key} value={filters[filter.key]} onChange={e => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))} className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-bold bg-white hover:bg-gray-50">
              {filter.options.map(opt => (
                <option key={opt} value={opt}>{opt === "all" ? `All ${filter.label}` : opt}</option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Code", "Property", "Seller", "Type", "Start Price", "Final Bid", "Bidders", "Status", "Dates", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-400">No auctions found</td></tr>
              ) : (
                filtered.slice(0, 50).map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{a.auctionCode}</td>
                    <td className="px-4 py-3 text-gray-600">{a.auctionTitle?.substring(0, 30)}</td>
                    <td className="px-4 py-3 text-gray-600">{a.sellerUserId?.substring(0, 20)}</td>
                    <td className="px-4 py-3 text-xs font-bold capitalize">{a.auctionType}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{fmt(a.startingPriceEGP)}</td>
                    <td className="px-4 py-3 font-bold text-blue-600">{a.winnerBidEGP ? fmt(a.winnerBidEGP) : "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{a.totalUniqueBidders || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.status === "live" ? "bg-red-100 text-red-700" : a.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(a.auctionStartAt).toLocaleDateString()} — {new Date(a.auctionEndAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-blue-100 rounded text-blue-600"><Eye size={14} /></button>
                        <button className="p-1 hover:bg-orange-100 rounded text-orange-600"><Edit2 size={14} /></button>
                        <button className="p-1 hover:bg-yellow-100 rounded text-yellow-600"><Star size={14} /></button>
                        <button onClick={() => { setSelectedAuction(a); loadEvents(a.id); }} className="p-1 hover:bg-purple-100 rounded text-purple-600"><History size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Log Side Panel */}
      {selectedAuction && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-900">Event Log: {selectedAuction.auctionCode}</p>
            <button onClick={() => setSelectedAuction(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-xs text-gray-400">No events recorded</p>
            ) : (
              events.map(e => (
                <div key={e.id} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                  <span className="text-xs text-gray-500 flex-shrink-0 font-mono">{new Date(e.recordedAt).toLocaleTimeString()}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{e.eventType?.replace(/_/g, " ").toUpperCase()}</p>
                    <p className="text-xs text-gray-600">{e.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}