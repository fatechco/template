import { useState } from "react";
import { Eye, User, Phone, Heart, MessageCircle, Home, TrendingUp, BarChart2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const RANGES = ["Last 7 days", "Last 30 days", "3 Months", "6 Months", "1 Year"];

const VIEWS_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  views: Math.floor(Math.random() * 80 + 20),
}));

const TOP_PROPERTIES = [
  { name: "Modern Apt New Cairo", views: 234 },
  { name: "Villa Sheikh Zayed", views: 189 },
  { name: "Studio Maadi", views: 145 },
  { name: "Office Downtown", views: 98 },
  { name: "Land 6th October", views: 72 },
  { name: "Penthouse Zamalek", views: 65 },
];

const SOURCE_DATA = [
  { name: "Direct Search", value: 45, color: "#0077B6" },
  { name: "Featured Listings", value: 30, color: "#FF6B00" },
  { name: "Buy Request Match", value: 15, color: "#10b981" },
  { name: "Social Share", value: 10, color: "#8b5cf6" },
];

const MONTHLY_DATA = [
  { month: "Oct", added: 3, sold: 1 },
  { month: "Nov", added: 5, sold: 2 },
  { month: "Dec", added: 2, sold: 3 },
  { month: "Jan", added: 6, sold: 2 },
  { month: "Feb", added: 4, sold: 4 },
  { month: "Mar", added: 7, sold: 3 },
];

const PROP_TABLE = [
  { title: "Modern Apartment New Cairo", views: 234, saves: 18, contacts: 7, date: "2025-01-15", status: "Active", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=60&q=70" },
  { title: "Villa Sheikh Zayed", views: 189, saves: 12, contacts: 4, date: "2025-02-10", status: "Active", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=60&q=70" },
  { title: "Studio in Maadi", views: 145, saves: 8, contacts: 3, date: "2025-03-01", status: "Active", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=60&q=70" },
  { title: "Office Space Downtown", views: 98, saves: 5, contacts: 2, date: "2025-01-20", status: "Pending", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&q=70" },
];

const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700" };

const KPI = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

export default function PerformanceStats() {
  const [range, setRange] = useState("Last 30 days");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900">Performance Stats</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${range === r ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Total Properties Listed" value="34" icon={Home} color="bg-blue-500" />
        <KPI label="Active Listings" value="28" icon={TrendingUp} color="bg-green-500" />
        <KPI label="Total Views" value="4,821" icon={Eye} color="bg-orange-500" />
        <KPI label="Profile Views" value="892" icon={User} color="bg-purple-500" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Buyer Contacts" value="143" icon={MessageCircle} color="bg-teal-500" />
        <KPI label="WhatsApp Clicks" value="89" icon={MessageCircle} color="bg-emerald-500" />
        <KPI label="Phone Reveals" value="54" icon={Phone} color="bg-red-500" />
        <KPI label="Saved by Buyers" value="217" icon={Heart} color="bg-pink-500" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Line: Views per day */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Views Per Day (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={VIEWS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#FF6B00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Views per property */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Views by Property (Top 6)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_PROPERTIES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={130} />
              <Tooltip />
              <Bar dataKey="views" fill="#0077B6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: Buyer source */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Buyers by Source</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={SOURCE_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {SOURCE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar: Listings added vs sold */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-4">Monthly Listings: Added vs Sold</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="added" fill="#0077B6" radius={[4, 4, 0, 0]} name="Added" />
              <Bar dataKey="sold" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Property Performance Cards */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Property Performance</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {PROP_TABLE.map((p, i) => (
            <div key={i} className="p-4 flex gap-3 items-start">
              <img src={p.image} alt="" className="w-16 h-14 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{p.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-base font-black text-blue-700">{p.views}</p>
                    <p className="text-[10px] text-blue-500 font-semibold">Views</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-base font-black text-pink-600">{p.saves}</p>
                    <p className="text-[10px] text-pink-400 font-semibold">Saves</p>
                  </div>
                  <div className="bg-green-50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-base font-black text-green-600">{p.contacts}</p>
                    <p className="text-[10px] text-green-500 font-semibold">Contacts</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Listed: {p.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}