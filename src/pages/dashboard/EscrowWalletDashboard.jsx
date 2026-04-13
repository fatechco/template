import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowUpRight, ArrowDownLeft, Plus, Shield, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_CONFIG = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

const TX_TYPE_CONFIG = {
  deposit: { label: "Deposit", icon: "⬇️", color: "text-green-600" },
  escrow_lock: { label: "Locked", icon: "🔒", color: "text-orange-600" },
  milestone_release: { label: "Released", icon: "✅", color: "text-green-600" },
  platform_fee: { label: "Platform Fee", icon: "💼", color: "text-gray-500" },
  refund: { label: "Refund", icon: "↩️", color: "text-blue-600" },
  withdrawal: { label: "Withdrawal", icon: "⬆️", color: "text-red-600" },
};

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

export default function EscrowWalletDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [deals, setDeals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState("wallet");
  const [loading, setLoading] = useState(true);
  const [txFilter, setTxFilter] = useState("all");

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        // Load or create escrow account
        const accounts = await base44.entities.EscrowAccount.filter({ userId: me.id });
        if (accounts.length) {
          setAccount(accounts[0]);
        } else {
          const newAccount = await base44.entities.EscrowAccount.create({
            userId: me.id,
            accountNumber: `ESC-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
            accountType: "both",
            availableBalance: 0,
            lockedBalance: 0,
            pendingBalance: 0,
            totalDeposited: 0,
            currency: "EGP",
            kycStatus: "pending",
            status: "active"
          });
          setAccount(newAccount);
        }
        const [buyerDeals, sellerDeals, txData] = await Promise.all([
          base44.entities.EscrowDeal.filter({ buyerId: me.id }),
          base44.entities.EscrowDeal.filter({ sellerId: me.id }),
          base44.entities.EscrowTransaction.filter({ fromUserId: me.id }, '-created_date', 50)
        ]);
        const allDeals = [...buyerDeals, ...sellerDeals].filter((d, i, arr) => arr.findIndex(x => x.id === d.id) === i);
        setDeals(allDeals.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
        setTransactions(txData);
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  const activeDeals = deals.filter(d => !["completed", "cancelled", "expired"].includes(d.status));
  const completedDeals = deals.filter(d => d.status === "completed");
  const filteredTx = txFilter === "all" ? transactions : transactions.filter(t => t.transactionType === txFilter);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Lock className="w-6 h-6 text-orange-500" /> Kemedar Escrow™
        </h1>
        <Link to="/kemedar/escrow/new" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> New Deal
        </Link>
      </div>

      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute top-8 right-8 w-20 h-20 border-2 border-white rounded-full" />
        </div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/50 text-xs font-bold mb-0.5">🔒 KEMEDAR ESCROW™</p>
            <p className="font-mono text-white/60 text-xs">{account?.accountNumber || "ESC-XXXXXXXX"}</p>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${account?.kycStatus === "approved" ? "bg-green-500/30 text-green-300" : "bg-yellow-500/30 text-yellow-300"}`}>
            {account?.kycStatus === "approved" ? "✅ Verified" : "⚠️ Verify KYC"}
          </span>
        </div>
        <div className="mb-6">
          <p className="text-white/50 text-xs mb-1">Available Balance</p>
          <p className="text-5xl font-black">{fmt(account?.availableBalance || 0)} <span className="text-2xl text-white/60">EGP</span></p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-white/40 text-[10px]">Locked in deals</p>
            <p className="font-black text-orange-300">{fmt(account?.lockedBalance || 0)} EGP</p>
          </div>
          <div>
            <p className="text-white/40 text-[10px]">Pending</p>
            <p className="font-black text-yellow-300">{fmt(account?.pendingBalance || 0)} EGP</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <ArrowDownLeft className="w-4 h-4" />, label: "Deposit", action: () => {} },
            { icon: <ArrowUpRight className="w-4 h-4" />, label: "Withdraw", action: () => {} },
            { icon: <Lock className="w-4 h-4" />, label: "History", action: () => setTab("history") },
            { icon: <Shield className="w-4 h-4" />, label: "Verify", action: () => navigate("/dashboard/escrow/verify") },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} className="bg-white/10 hover:bg-white/20 rounded-xl py-2.5 text-xs font-bold flex flex-col items-center gap-1.5 transition-colors">
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Warning */}
      {account?.kycStatus !== "approved" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-yellow-800 text-sm">Complete KYC Verification</p>
            <p className="text-xs text-yellow-700">Required before making transactions above 10,000 EGP</p>
          </div>
          <Link to="/dashboard/escrow/verify" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
            Verify Now
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {[
          { id: "wallet", label: "💰 Wallet" },
          { id: "active", label: `🔒 Active Deals (${activeDeals.length})` },
          { id: "completed", label: `✅ Completed (${completedDeals.length})` },
          { id: "history", label: "📋 History" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Wallet Stats */}
      {tab === "wallet" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Deposited", value: fmt(account?.totalDeposited || 0), icon: "⬇️", color: "text-green-600" },
            { label: "Total Transacted", value: fmt(account?.totalTransacted || 0), icon: "💹", color: "text-blue-600" },
            { label: "Active Deals", value: account?.activeDeals || activeDeals.length, icon: "🔒", color: "text-orange-600" },
            { label: "Completed Deals", value: account?.completedDeals || completedDeals.length, icon: "✅", color: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Active Deals */}
      {tab === "active" && (
        <div className="space-y-4">
          {activeDeals.length === 0 ? (
            <div className="text-center py-16">
              <Lock className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 font-semibold">No active escrow deals</p>
              <Link to="/kemedar/escrow/new" className="mt-4 inline-block bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
                Start a Deal →
              </Link>
            </div>
          ) : activeDeals.map(deal => {
            const statusCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
            const role = user?.id === deal.buyerId ? "Buyer" : "Seller";
            return (
              <div key={deal.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-xs text-gray-400">{deal.dealNumber}</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role === "Buyer" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                    {role}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-2">
                    <p className="text-[10px] text-gray-400">Total</p>
                    <p className="font-black text-sm">{fmt(deal.agreedPrice)} EGP</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-2">
                    <p className="text-[10px] text-gray-400">Locked</p>
                    <p className="font-black text-sm text-orange-600">{fmt(deal.totalDeposited || 0)}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2">
                    <p className="text-[10px] text-gray-400">Released</p>
                    <p className="font-black text-sm text-green-600">{fmt(deal.totalReleased || 0)}</p>
                  </div>
                </div>
                {deal.isDisputed && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <p className="text-xs font-bold text-red-700">Active Dispute — Funds Frozen</p>
                  </div>
                )}
                <Link to={`/kemedar/escrow/${deal.id}`} className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
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
            <div className="text-center py-16 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto text-gray-200 mb-3" />
              <p>No completed deals yet</p>
            </div>
          ) : completedDeals.map(deal => (
            <div key={deal.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs text-gray-400">{deal.dealNumber}</p>
                <p className="font-black text-gray-900">{fmt(deal.agreedPrice)} EGP</p>
                <p className="text-xs text-gray-400">Completed {deal.dealCompletedAt ? new Date(deal.dealCompletedAt).toLocaleDateString() : ""}</p>
              </div>
              <Link to={`/kemedar/escrow/${deal.id}`} className="text-xs text-orange-600 font-bold hover:underline">View →</Link>
            </div>
          ))}
        </div>
      )}

      {/* Transaction History */}
      {tab === "history" && (
        <div>
          <div className="flex gap-2 flex-wrap mb-4">
            {["all", "deposit", "milestone_release", "platform_fee", "refund", "withdrawal"].map(f => (
              <button key={f} onClick={() => setTxFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${txFilter === f ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                {f === "all" ? "All" : f.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          {filteredTx.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-2xl mb-2">📋</p>
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {filteredTx.map((tx, i) => {
                const txCfg = TX_TYPE_CONFIG[tx.transactionType] || { label: tx.transactionType, icon: "💱", color: "text-gray-600" };
                return (
                  <div key={tx.id} className={`flex items-center gap-4 p-4 ${i < filteredTx.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50`}>
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                      {txCfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900">{txCfg.label}</p>
                      <p className="text-xs text-gray-400 truncate">{tx.transactionNumber}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-black text-sm ${tx.direction === "in" ? "text-green-600" : "text-red-600"}`}>
                        {tx.direction === "in" ? "+" : "-"}{fmt(tx.amount)} EGP
                      </p>
                      <p className="text-[10px] text-gray-400">{tx.processedAt ? new Date(tx.processedAt).toLocaleDateString() : ""}</p>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                      {tx.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}