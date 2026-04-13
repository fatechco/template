import { useState, useEffect } from "react";
import { Search, Loader2, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

export default function AdminEscrowAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.EscrowAccount.list('-created_date', 200)
      .then(setAccounts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredAccounts = accounts.filter(a => {
    if (search && !(a.accountNumber || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Shield className="w-6 h-6 text-blue-500" /> Escrow Accounts (KYC)</h1>
          <p className="text-gray-500 text-sm">{accounts.length} total accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Escrow Value", value: fmt(accounts.reduce((s, a) => s + (a.availableBalance || 0) + (a.lockedBalance || 0), 0)), icon: "💰" },
          { label: "Active Accounts", value: accounts.filter(a => a.status === "active").length, icon: "✅" },
          { label: "Verified (Enhanced)", value: accounts.filter(a => a.verificationLevel === "enhanced").length, icon: "🔐" },
          { label: "KYC Approved", value: accounts.filter(a => a.kycStatus === "approved").length, icon: "📋" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl mb-2">{kpi.icon}</p>
            <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search account number..."
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Account #", "Type", "Available", "Locked", "Status", "KYC", "Verification", "Deals"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAccounts.slice(0, 50).map(acc => (
                <tr key={acc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{acc.accountNumber}</td>
                  <td className="px-4 py-3 text-xs capitalize text-gray-700">{acc.accountType}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{fmt(acc.availableBalance)} EGP</td>
                  <td className="px-4 py-3 font-bold text-orange-600">{fmt(acc.lockedBalance)} EGP</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs capitalize">{acc.kycStatus}</td>
                  <td className="px-4 py-3 text-xs capitalize">{acc.verificationLevel}</td>
                  <td className="px-4 py-3 font-bold text-blue-600 text-xs">{acc.completedDeals}</td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No accounts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}