"use client";
// @ts-nocheck

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home, DollarSign } from "lucide-react";

const PURPOSES = [
  { value: "sale", label: "Buy" },
  { value: "rent", label: "Rent" },
  { value: "commercial", label: "Commercial" },
];

export function SearchForm() {
  const router = useRouter();
  const [purpose, setPurpose] = useState("sale");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (purpose) params.set("purposeId", purpose);
    if (search) params.set("search", search);
    if (city) params.set("cityId", city);
    router.push(`/search/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 -mt-8 relative z-10 mx-4 max-w-4xl lg:mx-auto">
      {/* Purpose Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1">
        {PURPOSES.map((p) => (
          <button
            key={p.value}
            onClick={() => setPurpose(p.value)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              purpose === p.value ? "bg-blue-600 text-white shadow" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Search Inputs */}
      <div className="grid md:grid-cols-3 gap-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="City or District..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="relative">
          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Property type, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </div>
  );
}
