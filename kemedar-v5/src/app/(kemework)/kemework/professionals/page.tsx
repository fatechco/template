"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Users, Search, Star, MapPin, Loader2, Wrench } from "lucide-react";

export default function ProfessionalsPage() {
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["kemework-pros", search, service],
    queryFn: () => apiClient.list<any>("/api/v1/kemework/professionals", { search, serviceType: service, pageSize: 20 }),
  });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Find Professionals</h1>

      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or location..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
        </div>
        <select value={service} onChange={(e) => setService(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm sm:w-48">
          <option value="">All Services</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="painter">Painter</option>
          <option value="carpenter">Carpenter</option>
          <option value="hvac">AC / HVAC</option>
          <option value="general">General Repair</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : data?.data?.length ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.data.map((pro: any) => (
            <div key={pro.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold">
                  {pro.name?.charAt(0) || "P"}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">{pro.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Wrench className="w-3 h-3" />{pro.serviceType || "General"}</p>
                </div>
              </div>
              {pro.city && <p className="text-xs text-slate-500 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{pro.city}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">{pro.rating || "N/A"}</span>
                  <span className="text-xs text-slate-400">({pro.reviewCount || 0})</span>
                </div>
                <span className="text-xs text-green-600 font-medium">{pro.completedJobs || 0} jobs</span>
              </div>
              <Link href={`/kemework/professionals/${pro.id}`} className="block text-center mt-3 text-sm text-orange-600 border border-orange-200 rounded-lg py-1.5 hover:bg-orange-50">
                View Profile
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No professionals found</h3>
          <p className="text-sm mt-1">Try adjusting your search or service filter</p>
        </div>
      )}
    </div>
  );
}
