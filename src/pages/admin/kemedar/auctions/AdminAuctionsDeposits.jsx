import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function AdminAuctionsDeposits() {
  const [registrations, setRegistrations] = useState([]);
  const [tab, setTab] = useState("held");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await base44.entities.AuctionRegistration.list("-created_date", 1000);
    setRegistrations(data);
    setLoading(false);
  };

  const statusMap = {
    held: "held",
    pending_refund: "pending_refund",
    refunded: "refunded",
    forfeited: "forfeited"
  };

  const filtered = registrations.filter(r => r.depositStatus === statusMap[tab]);

  const totalHeld = registrations.filter(r => r.depositStatus === "held").reduce((s, r) => s + (r.depositAmountEGP || 0), 0);
  const sellerHeld = registrations.filter(r => r.depositStatus === "held" && r.registrationStatus === "active").reduce((s, r) => s + (r.depositAmountEGP || 0), 0);
  const buyerHeld = registrations.filter(r => r.depositStatus === "held" && r.registrationStatus !== "active").reduce((s, r) => s + (r.depositAmountEGP || 0), 0);
  const pendingRefunds = registrations.filter(r => r.depositStatus === "pending_refund").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">💳 Deposits Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: "held", label: "Held" },
          { id: "pending_refund", label: "Pending Refund" },
          { id: "refunded", label: "Refunded" },
          { id: "forfeited", label: "Forfeited" }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {tab === "held" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-600 font-bold mb-1">TOTAL HELD IN ESCROW</p>
            <p className="text-2xl font-black text-blue-700">{fmt(totalHeld)} EGP</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs text-green-600 font-bold mb-1">SELLER DEPOSITS</p>
            <p className="text-2xl font-black text-green-700">{fmt(sellerHeld)} EGP</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs text-purple-600 font-bold mb-1">BUYER DEPOSITS</p>
            <p className="text-2xl font-black text-purple-700">{fmt(buyerHeld)} EGP</p>
          </div>
        </div>
      )}

      {/* Pending Refunds Alert */}
      {tab === "pending_refund" && pendingRefunds > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="font-bold text-orange-700 mb-2">{pendingRefunds} refunds pending processing</p>
          <button className="px-6 py-2.5 rounded-lg bg-orange-600 text-white font-bold text-sm hover:bg-orange-700">
            ⚡ Process All Pending Refunds
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {tab === "forfeited"
                  ? ["Auction", "User", "Amount", "Date", "Seller Share", "Platform Share"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>)
                  : ["Auction", "Bidder", "Deposit Amount", "Status", "Registered", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>)
                }
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No deposits in this status</td></tr>
              ) : (
                filtered.map(r => {
                  if (tab === "forfeited") {
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-gray-900">{r.auctionId?.substring(0, 20)}</td>
                        <td className="px-4 py-3 text-gray-600">{r.bidderUserId?.substring(0, 20)}</td>
                        <td className="px-4 py-3 font-bold text-red-600">{fmt(r.depositAmountEGP)} EGP</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.depositRefundedAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 font-bold text-orange-600">{fmt(r.depositAmountEGP * 0.5)} EGP (50%)</td>
                        <td className="px-4 py-3 font-bold text-blue-600">{fmt(r.depositAmountEGP * 0.5)} EGP (50%)</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gray-900">{r.auctionId?.substring(0, 20)}</td>
                      <td className="px-4 py-3 text-gray-600">{r.bidderUserId?.substring(0, 20)}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{fmt(r.depositAmountEGP)} EGP</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.depositStatus === "refunded" ? "bg-green-100 text-green-700" : r.depositStatus === "pending_refund" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                          {r.depositStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(r.registeredAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {tab === "pending_refund" && (
                          <button className="px-2 py-1 text-xs bg-green-100 text-green-700 font-bold rounded hover:bg-green-200">
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}