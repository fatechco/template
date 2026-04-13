import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const KYC_COLORS = {
  approved: "bg-green-100 text-green-700",
  pending_review: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  not_submitted: "bg-gray-100 text-gray-500",
  expired: "bg-orange-100 text-orange-700",
};

const MOCK_INVESTORS = [
  { id: "u1", full_name: "Ahmed Hassan", email: "ahmed@example.com", kycStatus: "approved", holdingsCount: 2, totalInvested: 100000, totalYieldReceived: 7920, walletAddress: "ahmed.near", joined: "2026-01-15" },
  { id: "u2", full_name: "Sara Mohamed", email: "sara@example.com", kycStatus: "pending_review", holdingsCount: 1, totalInvested: 25000, totalYieldReceived: 0, walletAddress: null, joined: "2026-02-20" },
  { id: "u3", full_name: "Omar Khalil", email: "omar@example.com", kycStatus: "approved", holdingsCount: 3, totalInvested: 200000, totalYieldReceived: 19500, walletAddress: "omar.near", joined: "2025-12-01" },
];

function InvestorDetailPanel({ investor, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-lg">{investor.full_name}</h3>
            <p className="text-sm text-gray-400">{investor.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "KYC Status", value: investor.kycStatus?.replace("_", " ") },
              { label: "Holdings", value: `${investor.holdingsCount} properties` },
              { label: "Total Invested", value: `${fmt(investor.totalInvested)} EGP` },
              { label: "Yield Received", value: `${fmt(investor.totalYieldReceived)} EGP` },
              { label: "NEAR Wallet", value: investor.walletAddress || "Custodial" },
              { label: "Joined", value: investor.joined },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="font-bold text-gray-900 text-sm">{value}</p>
              </div>
            ))}
          </div>
          <button className="w-full border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 hover:border-[#00C896]">
            ⬇ Download Investor Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KemeFracInvestors() {
  const [investors, setInvestors] = useState(MOCK_INVESTORS);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = investors.filter(inv =>
    !search || inv.full_name?.toLowerCase().includes(search.toLowerCase()) || inv.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">👥 Investors</h1>
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or email..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00C896]" />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "KYC Status", "Holdings", "Total Invested", "Yield Received", "NEAR Wallet", "Joined"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => (
                <tr key={inv.id} onClick={() => setSelected(inv)}
                  className={`border-t border-gray-50 cursor-pointer hover:bg-gray-50 ${i % 2 ? "bg-gray-50/40" : ""}`}>
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900">{inv.full_name}</p>
                    <p className="text-xs text-gray-400">{inv.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${KYC_COLORS[inv.kycStatus] || "bg-gray-100"}`}>
                      {inv.kycStatus?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">{inv.holdingsCount}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">{fmt(inv.totalInvested)} EGP</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#F59E0B" }}>{fmt(inv.totalYieldReceived)} EGP</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{inv.walletAddress || <span className="text-gray-300">Custodial</span>}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{inv.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <InvestorDetailPanel investor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}