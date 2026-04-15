"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Wrench, Search, Paintbrush, Zap, Droplets, Wind, Hammer, Star, Loader2 } from "lucide-react";

const categories = [
  { icon: Paintbrush, label: "Painting", slug: "painting", color: "bg-purple-50 text-purple-600" },
  { icon: Zap, label: "Electrical", slug: "electrical", color: "bg-amber-50 text-amber-600" },
  { icon: Droplets, label: "Plumbing", slug: "plumbing", color: "bg-blue-50 text-blue-600" },
  { icon: Wind, label: "AC & HVAC", slug: "hvac", color: "bg-cyan-50 text-cyan-600" },
  { icon: Hammer, label: "Carpentry", slug: "carpentry", color: "bg-orange-50 text-orange-600" },
  { icon: Wrench, label: "General Repair", slug: "general", color: "bg-green-50 text-green-600" },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const { data: featured, isLoading } = useQuery({
    queryKey: ["kemework-featured", activeCategory],
    queryFn: () => apiClient.list<any>("/api/v1/kemework/services", { category: activeCategory, featured: true, pageSize: 6 }),
  });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Browse Services</h1>

      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a service..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3">Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
        {categories.map((c) => (
          <button key={c.slug} onClick={() => setActiveCategory(activeCategory === c.slug ? "" : c.slug)}
            className={`rounded-xl border p-4 text-center hover:shadow-md transition ${activeCategory === c.slug ? "ring-2 ring-blue-400 border-blue-400" : ""} ${c.color}`}>
            <c.icon className="w-8 h-8 mx-auto mb-2" />
            <div className="text-sm font-medium">{c.label}</div>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">
        {activeCategory ? `${categories.find((c) => c.slug === activeCategory)?.label} Services` : "Featured Services"}
      </h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : featured?.data?.length ? (
        <div className="grid md:grid-cols-3 gap-4">
          {featured.data.map((s: any) => (
            <Link key={s.id} href={`/kemework/services/${s.slug || s.id}`} className="bg-white border rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Wrench className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-500">{s.category || "General"}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">{s.description || "Professional service"}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-medium">{s.rating || "N/A"}</span>
                </div>
                <span className="text-green-600 font-medium">From {s.startingPrice?.toLocaleString() || "N/A"} EGP</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No services found in this category</p>
        </div>
      )}
    </div>
  );
}
