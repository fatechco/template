"use client";

import { useState } from "react";
import { useCommunities } from "@/hooks/use-community";
import Link from "next/link";
import { MessageSquare, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminCommunityPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useCommunities({ type: type || undefined });
  const communities = data?.data ?? [];
  const filtered = search ? communities.filter((c: any) => c.name?.toLowerCase().includes(search.toLowerCase())) : communities;

  const totalMembers = communities.reduce((sum: number, c: any) => sum + (c.memberCount ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Communities</h1><p className="text-sm text-slate-500 mt-1">Manage residential communities and moderation</p></div>
        <Link href="/admin/kemedar/community/moderation" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Moderation Queue</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: MessageSquare, label: "Communities", value: communities.length },
          { icon: Users, label: "Total Members", value: totalMembers },
          { icon: MessageSquare, label: "Active Today", value: communities.filter((c: any) => c.activeToday).length },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5 flex items-center gap-3">
            <s.icon className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{isLoading ? <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" /> : s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search communities..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="neighborhood">Neighborhood</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Community</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Type</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Members</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Posts</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
            )) : filtered.length ? filtered.map((c: any) => (
              <tr key={c.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 capitalize">{c.type ?? "residential"}</td>
                <td className="px-4 py-3">{c.memberCount ?? 0}</td>
                <td className="px-4 py-3">{c.postCount ?? 0}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${c.active !== false ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{c.active !== false ? "Active" : "Inactive"}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400"><MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />No communities found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
