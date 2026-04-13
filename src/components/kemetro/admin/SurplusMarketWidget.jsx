import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function SurplusMarketWidget() {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.SurplusItem.list("-created_date", 100).catch(() => []),
      base44.entities.SurplusTransaction.list("-created_date", 50).catch(() => []),
    ]).then(([it, tr]) => {
      setItems(it || []);
      setTransactions(tr || []);
    });
  }, []);

  const today = new Date().toDateString();
  const todayItems = items.filter(i => new Date(i.created_date).toDateString() === today);
  const todaySold = transactions.filter(t => t.transactionType === "settlement" && new Date(t.created_date).toDateString() === today);
  const totalKgDiverted = items.reduce((sum, i) => sum + (i.estimatedWeightKg || 0), 0);

  // Build live event feed
  const events = [];
  items.slice(0, 2).forEach(i => events.push({
    icon: "♻️",
    text: `Item listed — ${i.title?.slice(0, 30)}, ${i.cityId || "Egypt"}`,
    time: new Date(i.created_date).toLocaleTimeString(),
  }));
  transactions.slice(0, 3).forEach(t => {
    if (t.transactionType === "reservation") events.push({ icon: "🛒", text: `Reserved — ${t.amountEGP?.toLocaleString()} EGP`, time: new Date(t.created_date).toLocaleTimeString() });
    if (t.transactionType === "settlement") events.push({ icon: "✅", text: `Settled — ${t.sellerNetEGP?.toLocaleString()} EGP to seller`, time: new Date(t.created_date).toLocaleTimeString() });
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-lg">🌿</div>
          <h2 className="text-base font-black text-gray-900">Surplus Market Today</h2>
        </div>
        <Link to="/admin/kemetro/surplus" className="text-xs text-green-600 font-bold hover:underline">View Full Dashboard →</Link>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-green-700">{todayItems.length}</p>
          <p className="text-xs text-gray-500">New listings</p>
        </div>
        <div className="flex-1 bg-teal-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-teal-700">{todaySold.length}</p>
          <p className="text-xs text-gray-500">Items sold</p>
        </div>
        <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-emerald-700">{(totalKgDiverted / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500">kg diverted</p>
        </div>
      </div>

      {/* Events feed */}
      <div className="space-y-2 mb-5">
        {events.slice(0, 5).map((ev, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm flex-shrink-0">{ev.icon}</span>
            <span className="text-xs text-gray-700 flex-1">{ev.text}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{ev.time}</span>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-gray-400 py-2 text-center">No activity yet today</p>
        )}
      </div>

      <Link to="/admin/kemetro/surplus" className="block w-full text-center border-2 border-green-500 text-green-700 font-black py-2.5 rounded-xl text-sm hover:bg-green-50 transition-all">
        🌿 Go to Surplus ESG Dashboard →
      </Link>
    </div>
  );
}