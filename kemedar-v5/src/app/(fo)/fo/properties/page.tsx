"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProperties } from "@/hooks/use-properties";
import Link from "next/link";
import { Building2, Search, Loader2 } from "lucide-react";

export default function FOPropertiesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useProperties({ search, areaId: user?.areaId, isActive: status === "active" ? true : status === "inactive" ? false : undefined } as any);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Area Properties</h1>

      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties in your area..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm sm:w-40">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : data?.data?.length ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Verification</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/property/${p.id}`} className="font-medium hover:text-blue-600 truncate block max-w-xs">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">{p.priceAmount?.toLocaleString() || "N/A"} EGP</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">{p.contactCount || 0} leads</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Level {p.verificationLevel || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No properties in your area</h3>
          <p className="text-sm mt-1">Properties listed in your franchise area will appear here</p>
        </div>
      )}
    </div>
  );
}
