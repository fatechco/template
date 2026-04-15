"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";

export default function FOWalletPage() {
  const { user } = useAuth();
  const { data: balance, isLoading } = useQuery({
    queryKey: ["fo-wallet", user?.id],
    queryFn: () => apiClient.get<any>("/api/v1/fo/wallet"),
    enabled: !!user,
  });
  const { data: transactions } = useQuery({
    queryKey: ["fo-commissions", user?.id],
    queryFn: () => apiClient.list<any>("/api/v1/fo/wallet/transactions", { pageSize: 15 }),
    enabled: !!user,
  });

  const stats = [
    { icon: Wallet, label: "Balance", value: `${(balance?.balance ?? 0).toLocaleString()} EGP`, color: "text-blue-600 bg-blue-50" },
    { icon: TrendingUp, label: "Total Earned", value: `${(balance?.totalEarned ?? 0).toLocaleString()} EGP`, color: "text-green-600 bg-green-50" },
    { icon: ArrowUpRight, label: "Pending", value: `${(balance?.pending ?? 0).toLocaleString()} EGP`, color: "text-amber-600 bg-amber-50" },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">FO Wallet & Commissions</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Commission History</h2>
      {transactions?.data?.length ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Type</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Description</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((t: any) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.type === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {t.type === "credit" ? "Earned" : "Withdrawn"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{t.description || "Commission"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-500">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {t.type === "credit" ? "+" : "-"}{t.amount?.toLocaleString() || 0} EGP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
          <ArrowDownLeft className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No transactions yet</h3>
          <p className="text-sm mt-1">Commission earnings and withdrawals will appear here</p>
        </div>
      )}
    </div>
  );
}
