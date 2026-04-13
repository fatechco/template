import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const KPI = ({ icon, label, value, sub, color = "text-gray-900", trend }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xl">{icon}</span>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
    <p className={`text-2xl font-black ${color} mb-1`}>{value}</p>
    {sub && <p className="text-xs text-gray-400">{sub}</p>}
    {trend && <p className="text-xs text-green-600 font-semibold mt-1">↑ {trend}</p>}
  </div>
);

const FUNNEL = [
  { label: "KemeKit page views", value: 1240000, pct: 100 },
  { label: "Calculator used", value: 62000, pct: 5 },
  { label: "BOQ calculated once", value: 38000, pct: 61 },
  { label: "Dimensions adjusted 2+", value: 14000, pct: 37 },
  { label: "Added to cart", value: 4200, pct: 30 },
  { label: "Purchased", value: 840, pct: 20 },
  { label: "Installation requested", value: 210, pct: 25 },
];

const ROOM_DATA = [
  { name: "Bathrooms", pct: 38 },
  { name: "Kitchens", pct: 27 },
  { name: "Living Rooms", pct: 18 },
  { name: "Bedrooms", pct: 12 },
  { name: "Outdoor", pct: 5 },
];

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

const MOCK_DESIGNERS = [
  { name: "Rana Khaled", kits: 8, calcs: 4200, carts: 380, gmv: 1240000, commission: 37200 },
  { name: "Ahmed Tarek", kits: 5, calcs: 2900, carts: 210, gmv: 870000, commission: 26100 },
  { name: "Nour Salem", kits: 3, calcs: 1800, carts: 120, gmv: 540000, commission: 16200 },
  { name: "Kareem Fady", kits: 6, calcs: 1400, carts: 90, gmv: 310000, commission: 9300 },
  { name: "Dina Mostafa", kits: 2, calcs: 900, carts: 55, gmv: 190000, commission: 5700 },
];

function genDays(n) {
  return Array.from({ length: n }, (_, i) => ({
    day: `${i + 1}`,
    calcs: Math.floor(100 + Math.random() * 800),
  }));
}

export default function KemeKitsAnalytics() {
  const [lineData] = useState(genDays(30));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">🎨 KemeKits Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Full module performance overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPI icon="🎨" label="Active KemeKits" value="124" trend="+7 this month" />
        <KPI icon="📐" label="Calculations Run" value="62,400" sub="High-intent engagement" trend="+340 today" />
        <KPI icon="🛒" label="Cart Conversion" value="6.8%" color="text-blue-600" sub="calculations → cart" />
        <KPI icon="💰" label="Total GMV" value="3,150,000 EGP" color="text-yellow-600" sub="via KemeKits" />
        <KPI icon="👷" label="Kemework Cross-Sell" value="24.8%" color="text-teal-600" sub="bought installation" />
        <KPI icon="💎" label="Commissions Paid" value="94,500 EGP" color="text-purple-600" sub="to designers" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Calculations Run Over Time (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="calcs" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Top Room Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ROOM_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} unit="%" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {ROOM_DATA.map((_, i) => (
                  <Cell key={i} fill={["#14b8a6", "#3b82f6", "#8b5cf6", "#f97316", "#22c55e"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-4">Conversion Funnel</h3>
        <div className="space-y-2">
          {FUNNEL.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-52 flex-shrink-0">Level {i + 1}: {f.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                  style={{
                    width: `${(f.pct / 100) * 100}%`,
                    minWidth: 40,
                    background: `hsl(${210 - i * 20}, 70%, 55%)`,
                  }}
                >
                  <span className="text-white text-[10px] font-bold whitespace-nowrap">{f.pct}%</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-700 w-24 text-right flex-shrink-0">
                {f.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Designers Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">🏆 Top KemeKit Creators</h3>
          <Link to="/admin/kemetro/kemekits/designers" className="text-xs text-blue-600 font-bold hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {["Rank", "Designer", "Kits", "Calculations", "Carts", "GMV", "Commission", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_DESIGNERS.map((d, i) => (
                <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${i < 3 ? "bg-yellow-50/30" : ""}`}>
                  <td className="px-4 py-3 text-lg">{RANK_MEDALS[i] || `#${i + 1}`}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{d.name}</td>
                  <td className="px-4 py-3">{d.kits}</td>
                  <td className="px-4 py-3">{d.calcs.toLocaleString()}</td>
                  <td className="px-4 py-3">{d.carts}</td>
                  <td className="px-4 py-3 font-semibold text-yellow-600">{d.gmv.toLocaleString()} EGP</td>
                  <td className="px-4 py-3 font-semibold text-purple-600">{d.commission.toLocaleString()} EGP</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-semibold">Profile</button>
                      <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded font-semibold">Feature</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}