import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const MOCK_ORDERS_FEED = [
  "Ahmed M. ordered 80 m² — New Cairo",
  "Sara K. ordered 50 m² — 6th October",
  "Company ABC ordered 200 m² — New Cairo",
  "Omar F. ordered 30 m² — Maadi",
  "Nour T. ordered 90 m² — Sheikh Zayed",
];

const MOCK_CHART = [
  { time: "00:00", orders: 2 }, { time: "04:00", orders: 1 }, { time: "08:00", orders: 8 },
  { time: "12:00", orders: 15 }, { time: "16:00", orders: 12 }, { time: "20:00", orders: 9 },
];

const MOCK_CITY_CHART = [
  { city: "New Cairo", orders: 18 }, { city: "6th Oct", orders: 11 }, { city: "Maadi", orders: 8 },
  { city: "Sheikh Zayed", orders: 6 }, { city: "Heliopolis", orders: 4 },
];

const MOCK_ACTIVE = {
  id: "fd1", productName: "60×60 Porcelain Floor Tiles — Matte Grey",
  totalOrders: 47, totalRevenue: 348960, totalUnitsSold: 880,
  stockRemaining: 320, totalStockAvailable: 1000,
  dealEndsAt: new Date(Date.now() + 11 * 3600000).toISOString(),
  dealPrice: 185, discountPercent: 35, status: "active",
};

const MOCK_HISTORY = [
  { productName: "Wall Tiles 30×60", duration: "48h", totalOrders: 89, totalRevenue: 534000, discountPercent: 42, status: "completed" },
  { productName: "Paint 18L White", duration: "24h", totalOrders: 34, totalRevenue: 142800, discountPercent: 35, status: "completed" },
  { productName: "Tile Adhesive 25kg", duration: "72h", totalOrders: 134, totalRevenue: 127300, discountPercent: 42, status: "completed" },
];

export default function KemetroFlashSellerDashboard() {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [feedIdx, setFeedIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user) return;
      base44.entities.FlashDeal.filter({ sellerId: user.id })
        .then(data => {
          setDeals(data);
          setActiveDeal(data.find(d => d.status === "active") || MOCK_ACTIVE);
          setLoading(false);
        }).catch(() => { setActiveDeal(MOCK_ACTIVE); setLoading(false); });
    });
    const t = setInterval(() => setFeedIdx(i => (i + 1) % MOCK_ORDERS_FEED.length), 2500);
    return () => clearInterval(t);
  }, []);

  const stockPct = activeDeal ? ((activeDeal.stockRemaining || 0) / (activeDeal.totalStockAvailable || 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/kemetro/seller" className="text-gray-400 hover:text-orange-500">‹</Link>
          <h1 className="text-xl font-black text-gray-900">⚡ Flash™ Dashboard</h1>
        </div>
        <Link to="/kemetro/seller/flash/create" className="bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors">+ Create Flash Deal</Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Active deal */}
        {activeDeal && (
          <div className="bg-white rounded-2xl border-2 border-red-300 shadow-lg overflow-hidden" style={{ boxShadow: "0 0 20px rgba(239,68,68,0.15)" }}>
            <div className="bg-red-600 px-5 py-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white font-black text-sm">⚡ LIVE NOW</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-gray-900">{activeDeal.productName}</h2>
                  <p className="text-sm text-orange-600 font-bold">Ends in {Math.round((new Date(activeDeal.dealEndsAt) - Date.now()) / 3600000)}h</p>
                </div>
                <span className="bg-red-100 text-red-600 font-black text-xs px-2 py-1 rounded-full">-{activeDeal.discountPercent}%</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Orders", val: activeDeal.totalOrders },
                  { label: "Revenue", val: fmt(activeDeal.totalRevenue) + " EGP" },
                  { label: "Units Sold", val: fmt(activeDeal.totalUnitsSold) },
                  { label: "Viewers Now", val: Math.round(Math.random() * 15 + 3) },
                ].map(s => (
                  <div key={s.label} className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="font-black text-red-700 text-lg">{s.val}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Live feed */}
              <div className="bg-gray-900 rounded-xl px-4 py-2 mb-3 overflow-hidden">
                <p key={feedIdx} className="text-green-400 text-xs font-semibold">{MOCK_ORDERS_FEED[feedIdx]}</p>
              </div>

              {/* Stock bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Stock sold: {100 - Math.round(stockPct)}%</span>
                  <span>{fmt(activeDeal.stockRemaining)} remaining</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full animate-pulse" style={{ width: `${100 - stockPct}%` }} />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm hover:bg-gray-50">⏸ Pause</button>
                <button className="flex-1 border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-sm hover:bg-gray-50">✏️ Edit</button>
                <button className="flex-1 bg-orange-50 text-orange-600 border border-orange-200 font-bold py-2 rounded-xl text-sm hover:bg-orange-100">🔔 Boost</button>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-black text-gray-900 mb-3">Orders Over Time</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={MOCK_CHART}>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-black text-gray-900 mb-3">Orders by City</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={MOCK_CITY_CHART} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="city" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="orders" radius={4}>
                  {MOCK_CITY_CHART.map((_, i) => <Cell key={i} fill={["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"][i % 5]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-black text-gray-900">Completed Flash Deals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {["Deal", "Duration", "Orders", "Revenue", "Discount", "Status"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}
              </tr></thead>
              <tbody>
                {MOCK_HISTORY.map((d, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{d.productName}</td>
                    <td className="px-4 py-3 text-gray-500">{d.duration}</td>
                    <td className="px-4 py-3 font-bold">{d.totalOrders}</td>
                    <td className="px-4 py-3 font-black text-green-600">{fmt(d.totalRevenue)} EGP</td>
                    <td className="px-4 py-3"><span className="bg-red-100 text-red-600 font-black text-xs px-1.5 py-0.5 rounded-full">-{d.discountPercent}%</span></td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}