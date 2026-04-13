import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Plus, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STATUS_CONFIG = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};
const fmt = n => n ? Number(n).toLocaleString() : "0";

export default function EscrowWalletMobile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [deals, setDeals] = useState([]);
  const [tab, setTab] = useState("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);
      if (!me) { setLoading(false); return; }
      const accounts = await base44.entities.EscrowAccount.filter({ userId: me.id }).catch(() => []);
      if (accounts.length) {
        setAccount(accounts[0]);
      } else {
        const newAcc = await base44.entities.EscrowAccount.create({
          userId: me.id, accountNumber: `ESC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
          accountType: "both", availableBalance: 0, lockedBalance: 0, pendingBalance: 0,
          totalDeposited: 0, currency: "EGP", kycStatus: "pending", status: "active",
        });
        setAccount(newAcc);
      }
      const [buyerDeals, sellerDeals] = await Promise.all([
        base44.entities.EscrowDeal.filter({ buyerId: me.id }).catch(() => []),
        base44.entities.EscrowDeal.filter({ sellerId: me.id }).catch(() => []),
      ]);
      const allDeals = [...buyerDeals, ...sellerDeals].filter((d, i, arr) => arr.findIndex(x => x.id === d.id) === i);
      setDeals(allDeals.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setLoading(false);
    };
    init();
  }, []);

  const activeDeals = deals.filter(d => !["completed", "cancelled"].includes(d.status));
  const completedDeals = deals.filter(d => d.status === "completed");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm flex-1 flex items-center gap-1.5">
          <Lock size={13} className="text-orange-500" /> Kemedar Escrow™ Wallet
        </p>
        <Link to="/m/kemedar/escrow/new" className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
          <Plus size={18} className="text-white" />
        </Link>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white/50 text-[10px] font-bold">🔒 KEMEDAR ESCROW™</p>
              <p className="font-mono text-white/60 text-xs">{account?.accountNumber || "ESC-XXXXXXXX"}</p>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${account?.kycStatus === "approved" ? "bg-green-500/30 text-green-300" : "bg-yellow-500/30 text-yellow-300"}`}>
              {account?.kycStatus === "approved" ? "✅ Verified" : "⚠️ Verify KYC"}
            </span>
          </div>
          <div className="mb-4">
            <p className="text-white/50 text-xs mb-0.5">Available Balance</p>
            <p className="text-4xl font-black">{fmt(account?.availableBalance || 0)} <span className="text-xl text-white/60">EGP</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/40 text-[10px]">Locked in deals</p>
              <p className="font-black text-orange-300">{fmt(account?.lockedBalance || 0)} EGP</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/40 text-[10px]">Pending</p>
              <p className="font-black text-yellow-300">{fmt(account?.pendingBalance || 0)} EGP</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "⬇️", label: "Deposit" },
              { icon: "⬆️", label: "Withdraw" },
              { icon: "📋", label: "History", action: () => setTab("history") },
              { icon: "🛡️", label: "Verify" },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} className="bg-white/10 hover:bg-white/20 rounded-xl py-2 text-xs font-bold flex flex-col items-center gap-1">
                <span>{btn.icon}</span>{btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* KYC warning */}
        {account?.kycStatus !== "approved" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-yellow-800 text-sm">Complete KYC Verification</p>
              <p className="text-xs text-yellow-700">Required for transactions above 10,000 EGP</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "active", label: `🔒 Active (${activeDeals.length})` },
            { id: "completed", label: `✅ Completed (${completedDeals.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition-colors ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Deals */}
        {tab === "active" && (
          <div className="space-y-3">
            {activeDeals.length === 0 ? (
              <div className="text-center py-12">
                <Lock size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-500 font-semibold text-sm mb-4">No active escrow deals</p>
                <Link to="/m/kemedar/escrow/new" className="inline-block bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                  Start a Deal →
                </Link>
              </div>
            ) : activeDeals.map(deal => {
              const statusCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
              const role = user?.id === deal.buyerId ? "Buyer" : "Seller";
              return (
                <div key={deal.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-gray-400">{deal.dealNumber}</p>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role === "Buyer" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{role}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    {[
                      { label: "Total", val: fmt(deal.agreedPrice), color: "text-gray-900" },
                      { label: "Locked", val: fmt(deal.totalDeposited || 0), color: "text-orange-600" },
                      { label: "Released", val: fmt(deal.totalReleased || 0), color: "text-green-600" },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-2">
                        <p className="text-[10px] text-gray-400">{s.label}</p>
                        <p className={`font-black text-xs ${s.color}`}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                  <Link to={`/m/kemedar/escrow/${deal.id}`}
                    className="block w-full text-center bg-orange-500 text-white font-bold py-2.5 rounded-xl text-sm">
                    View Deal Room →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Deals */}
        {tab === "completed" && (
          <div className="space-y-3">
            {completedDeals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm">No completed deals yet</p>
              </div>
            ) : completedDeals.map(deal => (
              <div key={deal.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-gray-400">{deal.dealNumber}</p>
                  <p className="font-black text-gray-900 text-sm">{fmt(deal.agreedPrice)} EGP</p>
                  <p className="text-xs text-gray-400">Completed {deal.dealCompletedAt ? new Date(deal.dealCompletedAt).toLocaleDateString() : ""}</p>
                </div>
                <Link to={`/m/kemedar/escrow/${deal.id}`} className="text-xs text-orange-600 font-bold flex-shrink-0">View →</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}