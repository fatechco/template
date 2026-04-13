import { useState } from "react";
import { Star, Eye, UserCheck, CheckCircle } from "lucide-react";

const MOCK_HANDYMEN = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  initials: ["MF", "AS", "KR", "TO", "RA", "NP"][i],
  name: ["Mahmoud Fixer", "Ahmed Saber", "Khaled Riad", "Tarek Omar", "Rami Adel", "Nasser Pro"][i],
  specs: [["Electrical", "Plumbing"], ["Painting", "Renovation"], ["Tiling", "Flooring"], ["HVAC", "Electrical"], ["Carpentry", "Renovation"], ["Plumbing", "HVAC"]][i],
  rating: [4.9, 4.7, 4.8, 4.6, 4.5, 4.9][i],
  jobs: [142, 89, 203, 45, 67, 310][i],
  city: ["New Cairo", "Maadi", "Sheikh Zayed", "6th October", "Heliopolis", "Nasr City"][i],
  verified: [true, true, false, true, true, true][i],
  available: [true, false, true, true, false, true][i],
}));

export default function FindHandyman() {
  const [filters, setFilters] = useState({ spec: "", city: "", verified: "", available: "" });

  const filtered = MOCK_HANDYMEN.filter(h => {
    const specMatch = !filters.spec || h.specs.some(s => s.toLowerCase().includes(filters.spec.toLowerCase()));
    const cityMatch = !filters.city || h.city.toLowerCase().includes(filters.city.toLowerCase());
    const verifiedMatch = !filters.verified || (filters.verified === "yes" ? h.verified : !h.verified);
    const availMatch = !filters.available || (filters.available === "yes" ? h.available : !h.available);
    return specMatch && cityMatch && verifiedMatch && availMatch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🔍 Find Handyman / Finishing Company</h1>
        <p className="text-gray-500 text-sm mt-0.5">Browse and accredit professionals in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input placeholder="Specialization (e.g. Electrical)" value={filters.spec} onChange={e => setFilters(f => ({ ...f, spec: e.target.value }))} className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        <input placeholder="City..." value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-36" />
        <select value={filters.verified} onChange={e => setFilters(f => ({ ...f, verified: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="">Verified: All</option><option value="yes">Verified Only</option><option value="no">Not Verified</option>
        </select>
        <select value={filters.available} onChange={e => setFilters(f => ({ ...f, available: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option value="">Available: All</option><option value="yes">Available Now</option><option value="no">Busy</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(h => (
          <div key={h.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-black text-sm flex items-center justify-center">{h.initials}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm">{h.name}</p>
                    {h.verified && <CheckCircle size={14} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-gray-400">📍 {h.city}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${h.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {h.available ? "Available" : "Busy"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {h.specs.map(s => <span key={s} className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-yellow-500 font-black"><Star size={14} className="fill-yellow-400" /> {h.rating}</span>
              <span className="text-gray-500">{h.jobs} jobs done</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold py-2 rounded-lg"><Eye size={12} /> View Profile</button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-teal-600 text-white hover:bg-teal-700 text-xs font-bold py-2 rounded-lg"><UserCheck size={12} /> Assign Task</button>
              <button className="flex items-center justify-center gap-1 bg-orange-500 text-white hover:bg-orange-600 text-xs font-bold py-2 px-3 rounded-lg"><CheckCircle size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}