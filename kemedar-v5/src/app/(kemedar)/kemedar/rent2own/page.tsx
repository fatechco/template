"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Home, ArrowRight, Shield, Calculator, Clock, CheckCircle, Loader2, MapPin } from "lucide-react";

const STEPS = [
  { icon: Home, title: "Choose a Property", desc: "Browse rent-to-own eligible properties" },
  { icon: Calculator, title: "Calculate Your Plan", desc: "See monthly payments and ownership timeline" },
  { icon: Clock, title: "Rent & Build Equity", desc: "A portion of each payment goes toward ownership" },
  { icon: CheckCircle, title: "Own Your Home", desc: "Complete the purchase at the end of your term" },
];

export default function Rent2OwnPage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["rent2own-properties"],
    queryFn: () => apiClient.list<any>("/api/v1/properties", { purpose: "rent-to-own", pageSize: 6 }),
  });

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <Home className="w-14 h-14 text-green-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-3">Rent-to-Own</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Start renting today and gradually own your dream home</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.title} className="bg-white border rounded-xl p-5 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-green-700">{i + 1}</span>
            </div>
            <h3 className="font-bold mb-1 text-sm">{s.title}</h3>
            <p className="text-xs text-slate-500">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Available properties */}
      <h2 className="text-lg font-bold mb-4">Available Rent-to-Own Properties</h2>
      {isLoading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : properties?.data?.length ? (
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {properties.data.map((p: any) => (
            <Link key={p.id} href={`/property/${p.id}`} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
              <div className="h-36 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Property Image</div>
              <div className="p-4">
                <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{p.city || p.area || "Egypt"}</p>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <p className="text-xs text-slate-500">Monthly</p>
                    <p className="text-green-700 font-bold text-sm">{((p.priceAmount || 0) / 120).toLocaleString(undefined, { maximumFractionDigits: 0 })} EGP/mo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Total Price</p>
                    <p className="font-bold text-sm">{p.priceAmount?.toLocaleString() || "N/A"} EGP</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-500 bg-green-50 rounded px-2 py-1 text-center">10-year ownership plan</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-400 mb-10">
          <Home className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No rent-to-own properties available</h3>
          <p className="text-sm mt-1">Check back soon for new listings</p>
        </div>
      )}

      <div className="bg-white border rounded-xl p-8 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-bold">Escrow Protected</h3>
            <p className="text-sm text-slate-500">All rent-to-own agreements are secured through Kemedar Escrow</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/search/properties?purpose=rent-to-own" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 inline-flex items-center gap-2">
          Find Rent-to-Own Properties <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
