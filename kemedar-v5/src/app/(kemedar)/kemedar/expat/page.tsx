"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Globe, Shield, MapPin, Languages, Building2, Phone, Loader2, ArrowRight } from "lucide-react";

const COUNTRIES = [
  { code: "UAE", name: "United Arab Emirates", flag: "AE", color: "bg-green-50 border-green-200" },
  { code: "KSA", name: "Saudi Arabia", flag: "SA", color: "bg-emerald-50 border-emerald-200" },
  { code: "UK", name: "United Kingdom", flag: "GB", color: "bg-blue-50 border-blue-200" },
  { code: "USA", name: "United States", flag: "US", color: "bg-red-50 border-red-200" },
];

const FEATURES = [
  { icon: Languages, title: "Multi-language Support", desc: "Browse in English, Arabic, and more" },
  { icon: Shield, title: "Escrow Protection", desc: "Safe transactions for overseas buyers" },
  { icon: MapPin, title: "Virtual Tours", desc: "View properties remotely with 3D tours" },
  { icon: Building2, title: "Verified Listings", desc: "All properties verified by local agents" },
  { icon: Phone, title: "Dedicated Support", desc: "Expat-focused customer support team" },
  { icon: Globe, title: "Currency Options", desc: "View prices in USD, EUR, GBP, or EGP" },
];

export default function ExpatPage() {
  const [selectedCountry, setSelectedCountry] = useState("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["expat-resources", selectedCountry],
    queryFn: () => apiClient.list<any>("/api/v1/expat/resources", { country: selectedCountry }),
    enabled: !!selectedCountry,
  });

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <Globe className="w-14 h-14 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-3">Kemedar for Expats</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Buy, sell, or invest in Egyptian real estate from anywhere in the world</p>
      </div>

      {/* Country selector */}
      <h2 className="text-lg font-bold mb-3">Where are you based?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {COUNTRIES.map((c) => (
          <button key={c.code} onClick={() => setSelectedCountry(selectedCountry === c.code ? "" : c.code)}
            className={`rounded-xl border p-4 text-center transition hover:shadow-md ${c.color} ${selectedCountry === c.code ? "ring-2 ring-blue-400" : ""}`}>
            <div className="text-2xl mb-1">{c.flag === "AE" ? "AE" : c.flag === "SA" ? "SA" : c.flag === "GB" ? "GB" : "US"}</div>
            <h3 className="font-semibold text-sm">{c.name}</h3>
          </button>
        ))}
      </div>

      {/* Resources for selected country */}
      {selectedCountry && (
        <div className="bg-white border rounded-xl p-6 mb-10">
          <h2 className="font-bold text-lg mb-4">Relocation Guide: {COUNTRIES.find((c) => c.code === selectedCountry)?.name}</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : resources?.data?.length ? (
            <div className="space-y-3">
              {resources.data.map((r: any) => (
                <div key={r.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{r.title}</h4>
                    <p className="text-xs text-slate-500">{r.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-6">
              <p className="text-sm">Guides for property buying, legal requirements, and moving tips coming soon.</p>
            </div>
          )}
        </div>
      )}

      {/* Features */}
      <h2 className="text-lg font-bold mb-3">Why Kemedar for Expats?</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {FEATURES.map((f) => (
          <div key={f.title} className="bg-white border rounded-xl p-5">
            <f.icon className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/search/properties" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Browse Properties</Link>
      </div>
    </div>
  );
}
