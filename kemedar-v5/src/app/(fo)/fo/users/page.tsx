"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Users, Search, Loader2 } from "lucide-react";

export default function FOUsersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["fo-users", user?.id, search, role],
    queryFn: () => apiClient.list<any>("/api/v1/fo/users", { search, role, pageSize: 20 }),
    enabled: !!user,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Area Users</h1>

      <div className="bg-white border rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users in your area..." className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm" />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm sm:w-44">
          <option value="">All Roles</option>
          <option value="agent">Agent</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="agency">Agency</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : data?.data?.length ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((u: any) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">{u.name?.charAt(0) || "U"}</div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">{u.role?.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No users in your area</h3>
          <p className="text-sm mt-1">Agents, buyers, and sellers in your franchise area</p>
        </div>
      )}
    </div>
  );
}
