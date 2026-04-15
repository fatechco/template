"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace with real API call: apiClient.get("/api/v1/wallet")
    const timer = setTimeout(() => {
      setBalance(0);
      setTransactions([]);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        <div className="animate-pulse space-y-4">
          <div className="bg-white border rounded-xl p-6 h-32" />
          <div className="bg-white border rounded-xl p-4 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-6">
        <p className="text-blue-100 text-sm mb-1">Available Balance</p>
        <p className="text-3xl font-bold mb-4">{formatPrice(balance)}</p>
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition">
          <Plus className="w-4 h-4" /> Top Up
        </button>
      </div>

      {/* Transaction History */}
      <h2 className="text-lg font-bold mb-3">Transaction History</h2>
      {transactions.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Wallet className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-4 border-b last:border-0 hover:bg-slate-50">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-sm font-semibold ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                {tx.type === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
