// @ts-nocheck
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import SurplusMarketWidget from "@/components/kemetro/admin/SurplusMarketWidget";

const STATS = [
  { label: "Total GMV", value: "$2.5M", change: "+12.5%" },
  { label: "Total Orders", value: "8,234", change: "+8.2%" },
  { label: "Active Sellers", value: "342", change: "+5.1%" },
  { label: "Avg Commission", value: "8.5%", change: "–0.2%" },
];

const SALES_DATA = [
  { date: "Day 1", gmv: 25000, orders: 120 },
  { date: "Day 5", gmv: 32000, orders: 145 },
  { date: "Day 10", gmv: 28000, orders: 130 },
  { date: "Day 15", gmv: 45000, orders: 210 },
  { date: "Day 20", gmv: 38000, orders: 180 },
  { date: "Day 25", gmv: 52000, orders: 240 },
  { date: "Day 30", gmv: 68000, orders: 320 },
];

const TOP_SELLERS = [
  { name: "BuildRight Materials", gmv: 125000, orders: 340 },
  { name: "Steel Direct", gmv: 98000, orders: 280 },
  { name: "Tile Experts", gmv: 87000, orders: 250 },
  { name: "Paint Hub", gmv: 65000, orders: 180 },
  { name: "Electric Supply", gmv: 52000, orders: 145 },
];

export default function KemetroAdminOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Kemetro Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform performance & analytics overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            <p className={`text-xs mt-2 font-bold ${stat.change.startsWith("+") ? "text-green-600" : "text-gray-600"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Surplus & Salvage KPI Banner */}
      <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🌿</div>
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-0.5">Surplus & Salvage</p>
          <p className="text-2xl font-black text-green-700">2,140 kg waste diverted</p>
          <p className="text-xs text-green-500 mt-0.5">48,200 EGP GMV this month</p>
        </div>
        <p className="text-sm font-bold text-green-600">↑ +7 items listed today</p>
        <Link href="/admin/kemetro/surplus" className="ml-auto text-xs text-green-700 border border-green-300 font-bold px-4 py-2 rounded-xl hover:bg-green-100 transition-colors whitespace-nowrap">
          View ESG Dashboard →
        </Link>
      </div>

      {/* Shop the Look KPI Banner */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✨</div>
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs font-bold text-teal-500 uppercase tracking-wide mb-0.5">Shop the Look</p>
          <p className="text-2xl font-black text-teal-700">42,500 EGP GMV</p>
          <p className="text-xs text-teal-500 mt-0.5">from property gallery shoppers</p>
        </div>
        <p className="text-sm font-bold text-teal-600">↑ +24% vs last month</p>
        <Link href="/admin/kemetro/shop-the-look" className="ml-auto text-xs text-teal-700 border border-teal-300 font-bold px-4 py-2 rounded-xl hover:bg-teal-100 transition-colors whitespace-nowrap">
          View Dashboard →
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* GMV Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">GMV Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="gmv" stroke="#0077B6" strokeWidth={2} dot={{ fill: "#0077B6" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Orders Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={SALES_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#FF6B00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KemeKits KPI Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎨</div>
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-0.5">KemeKits™</p>
          <p className="text-2xl font-black text-blue-700">124 active kits</p>
          <p className="text-xs text-blue-500 mt-0.5">3,150,000 EGP total GMV</p>
        </div>
        <p className="text-sm font-bold text-blue-600">↑ +340 calculations today</p>
        <Link href="/admin/kemetro/kemekits" className="ml-auto text-xs text-blue-700 border border-blue-300 font-bold px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors whitespace-nowrap">
          View KemeKits Dashboard →
        </Link>
      </div>

      {/* KemeKits Today Widget */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-base">🎨</div>
            <h2 className="text-base font-black text-gray-900">KemeKits Today</h2>
          </div>
          <Link href="/admin/kemetro/kemekits" className="text-xs text-blue-600 font-bold hover:underline">View Full Dashboard →</Link>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {[["Calculations", "340", "text-blue-600"], ["Carts Added", "28", "text-orange-600"], ["GMV", "84,200 EGP", "text-green-600"]].map(([label, val, color]) => (
            <div key={label} className="flex-1 min-w-[100px] bg-gray-50 rounded-xl p-3 text-center">
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          {[
            ["🎨", "New kit pending — Modern Matte Black Bathroom, Rana Khaled"],
            ["📐", "Calculation run — Bathroom, New Cairo"],
            ["🛒", "Cart added — 14 items, 18,400 EGP"],
            ["💰", "Commission paid — Ahmed Tarek, 552 EGP"],
            ["👷", "Install requested — Modern Bathroom Kit, Cairo"],
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm flex-shrink-0">{icon}</span>
              <span className="text-xs text-gray-700 flex-1">{text}</span>
            </div>
          ))}
        </div>
        <Link href="/admin/kemetro/kemekits" className="block w-full text-center border-2 border-blue-400 text-blue-600 font-black py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-all">
          🎨 Go to KemeKits Dashboard →
        </Link>
      </div>

      {/* Surplus Market Today Widget */}
      <SurplusMarketWidget />

      {/* Top Sellers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Top Sellers by GMV</h3>
        <div className="space-y-3">
          {TOP_SELLERS.map((seller, idx) => (
            <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
              <div>
                <p className="font-semibold text-gray-900">{seller.name}</p>
                <p className="text-xs text-gray-500">{seller.orders} orders</p>
              </div>
              <p className="text-lg font-black text-[#0077B6]">${seller.gmv.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}