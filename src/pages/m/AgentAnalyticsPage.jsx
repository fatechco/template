import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const VIEWS_DATA = [
  { day: "1", views: 45 },
  { day: "5", views: 62 },
  { day: "10", views: 85 },
  { day: "15", views: 120 },
  { day: "20", views: 105 },
  { day: "25", views: 145 },
  { day: "30", views: 178 },
];

const TOP_PROPERTIES = [
  { name: "Apartment Cairo", views: 342 },
  { name: "Villa New Cairo", views: 298 },
  { name: "Office Space", views: 256 },
  { name: "Studio Downtown", views: 189 },
  { name: "Commercial Space", views: 145 },
];

const SOURCE_DATA = [
  { name: "Search", value: 45 },
  { name: "Direct", value: 25 },
  { name: "Featured", value: 20 },
  { name: "Referral", value: 10 },
];

const COLORS = ["#FF6B00", "#0077B6", "#10B981", "#8B5CF6"];

const PROPERTY_PERFORMANCE = [
  { title: "Apartment Cairo", views: 342, contacts: 28, daysListed: 45 },
  { title: "Villa New Cairo", views: 298, contacts: 24, daysListed: 38 },
  { title: "Office Space", views: 256, contacts: 18, daysListed: 52 },
];

export default function AgentAnalyticsPage() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("30d");

  const DATE_RANGES = [
    { id: "7d", label: "7D" },
    { id: "30d", label: "30D" },
    { id: "3m", label: "3M" },
    { id: "6m", label: "6M" },
    { id: "1y", label: "1Y" },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      <MobileTopBar title="Analytics" showBack />

      {/* Date Range Selector */}
      <div className="px-4 pt-4 pb-4 flex gap-2">
        {DATE_RANGES.map(range => (
          <button
            key={range.id}
            onClick={() => setDateRange(range.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              dateRange === range.id
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold">Views</p>
            <p className="text-2xl font-black text-orange-600 mt-2">1.2K</p>
            <p className="text-xs text-green-600 mt-1">+15% from last month</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold">Contacts</p>
            <p className="text-2xl font-black text-blue-600 mt-2">94</p>
            <p className="text-xs text-green-600 mt-1">+8% from last month</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold">Saves</p>
            <p className="text-2xl font-black text-purple-600 mt-2">156</p>
            <p className="text-xs text-green-600 mt-1">+22% from last month</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-semibold">Shares</p>
            <p className="text-2xl font-black text-pink-600 mt-2">42</p>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </div>
        </div>
      </div>

      {/* Property Views Chart */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Property Views — Last 30 Days</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={VIEWS_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#FF6B00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Properties Chart */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Top 5 Properties by Views</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_PROPERTIES} layout="vertical" margin={{ left: 80, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={75} />
              <Bar dataKey="views" fill="#FF6B00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Buyers by Source Chart */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Buyers by Source</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SOURCE_DATA} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} ${value}%`} outerRadius={60} fill="#8884d8" dataKey="value">
                {SOURCE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Performance Table */}
      <div className="px-4 pb-24">
        <p className="text-sm font-bold text-gray-900 mb-3">Property Performance</p>
        <div className="space-y-2">
          {PROPERTY_PERFORMANCE.map((prop, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{prop.title}</p>
                <div className="grid grid-cols-3 gap-2 mt-1 text-xs text-gray-600">
                  <div>
                    <p className="font-bold">{prop.views}</p>
                    <p className="text-gray-400">Views</p>
                  </div>
                  <div>
                    <p className="font-bold">{prop.contacts}</p>
                    <p className="text-gray-400">Contacts</p>
                  </div>
                  <div>
                    <p className="font-bold">{prop.daysListed}d</p>
                    <p className="text-gray-400">Listed</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}