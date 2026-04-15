"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2 } from "lucide-react";

export default function SearchProjectsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Search Projects</h1>

      <div className="bg-white border rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by name, developer, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
          </div>
          <button className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">Search</button>
        </div>
      </div>

      <div className="text-center py-16 text-slate-400">
        <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">Coming Soon</h3>
        <p>Project search with developer profiles, unit listings, and payment plans</p>
      </div>
    </div>
  );
}
