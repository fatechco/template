"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Building, Search, Star, MapPin, Loader2 } from "lucide-react";

export default function FindAgenciesPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["find-agencies", search, city],
    queryFn: () => apiClient.list<any>("/api/v1/users", { role: "agency", search, city, pageSize: 20 }),
  });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Find Real Estate Agencies</h1>

      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agencies..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm sm:w-48">
          <option value="">All Cities</option>
          <option value="cairo">Cairo</option>
          <option value="giza">Giza</option>
          <option value="alexandria">Alexandria</option>
          <option value="hurghada">Hurghada</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : data?.data?.length ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((agency: any) => (
            <Link key={agency.id} href={`/user/${agency.id}`} className="bg-white border rounded-xl p-5 hover:shadow-md transition text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600 font-bold text-lg">
                {agency.name?.charAt(0) || "A"}
              </div>
              <h3 className="font-semibold text-sm">{agency.name}</h3>
              {agency.city && <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1"><MapPin className="w-3 h-3" />{agency.city}</p>}
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{agency.rating || "N/A"}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{agency.propertiesCount || 0} properties</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Building className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No agencies found</h3>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
