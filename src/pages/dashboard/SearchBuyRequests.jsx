import { useState } from "react";
import { MessageCircle, Home } from "lucide-react";

const MOCK_REQUESTS = [
  { id: "BR-101", avatar: "AH", name: "Anonymous Buyer", categories: ["Apartment"], location: "New Cairo, Cairo", budgetMin: 80000, budgetMax: 150000, purpose: "Buy", date: "2 days ago" },
  { id: "BR-102", avatar: "FM", name: "Anonymous Buyer", categories: ["Villa", "Townhouse"], location: "Sheikh Zayed, Giza", budgetMin: 300000, budgetMax: 600000, purpose: "Buy", date: "5 days ago" },
  { id: "BR-103", avatar: "OR", name: "Anonymous Buyer", categories: ["Office"], location: "Downtown, Cairo", budgetMin: 2000, budgetMax: 5000, purpose: "Rent", date: "1 week ago" },
  { id: "BR-104", avatar: "SM", name: "Anonymous Buyer", categories: ["Studio"], location: "Maadi, Cairo", budgetMin: 500, budgetMax: 1200, purpose: "Rent", date: "2 weeks ago" },
  { id: "BR-105", avatar: "KA", name: "Anonymous Buyer", categories: ["Chalet"], location: "North Coast", budgetMin: 200000, budgetMax: 400000, purpose: "Buy", date: "3 weeks ago" },
  { id: "BR-106", avatar: "MH", name: "Anonymous Buyer", categories: ["Apartment", "Penthouse"], location: "Zamalek, Cairo", budgetMin: 400000, budgetMax: 900000, purpose: "Buy", date: "1 month ago" },
];

const PURPOSE_COLORS = { Buy: "bg-blue-100 text-blue-700", Rent: "bg-purple-100 text-purple-700" };

const BG_COLORS = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-teal-500"];

export default function SearchBuyRequests() {
  const [purposeFilter, setPurposeFilter] = useState("All");

  const filtered = purposeFilter === "All" ? MOCK_REQUESTS : MOCK_REQUESTS.filter(r => r.purpose === purposeFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Search Buy Requests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Find buyers actively looking for properties like yours</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-gray-700">Filter by:</span>
        {["All", "Buy", "Rent"].map(p => (
          <button key={p} onClick={() => setPurposeFilter(p)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${purposeFilter === p ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {p}
          </button>
        ))}
        <p className="ml-auto text-sm text-gray-400">{filtered.length} results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r, i) => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${BG_COLORS[i % BG_COLORS.length]} text-white font-bold text-sm flex items-center justify-center`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PURPOSE_COLORS[r.purpose]}`}>{r.purpose}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">Looking for</p>
                <div className="flex flex-wrap gap-1">
                  {r.categories.map(c => <span key={c} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">{c}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-semibold text-gray-800">{r.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="font-bold text-gray-900">${r.budgetMin.toLocaleString()} – ${r.budgetMax.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                <MessageCircle size={14} /> Contact Buyer
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2 rounded-lg text-sm transition-colors">
                <Home size={14} /> Match My Property
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}