import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { X } from "lucide-react";

const STATS = [
  { label: "Total Matches", val: "42,819", color: "text-gray-900" },
  { label: "High Matches (90%+)", val: "8,124", color: "text-orange-600" },
  { label: "User Conversions", val: "934", color: "text-green-600" },
  { label: "Avg Match Score", val: "78%", color: "text-blue-600" },
];

const TOP_PROPERTIES = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: ["Modern Apartment New Cairo", "Villa Sheikh Zayed 5th", "Studio Maadi Metro", "Duplex 5th Settlement", "Penthouse Heliopolis", "Twin House 6th October", "Chalet North Coast", "Office Smart Village", "Garden Apartment Zamalek", "Apartment New Capital"][i],
  city: ["New Cairo", "Sheikh Zayed", "Maadi", "New Cairo", "Heliopolis", "6th October", "North Coast", "Smart Village", "Zamalek", "New Capital"][i],
  price: ["2.5M", "8.2M", "750K", "3.1M", "12M", "5.8M", "1.8M", "1.5M", "4.2M", "2.2M"][i],
  matches: [247, 198, 176, 154, 132, 118, 104, 89, 78, 65][i],
  avgScore: [88, 85, 91, 82, 79, 87, 83, 76, 80, 84][i],
  views: [124, 89, 98, 67, 45, 72, 53, 34, 44, 31][i],
  contacts: [28, 18, 22, 14, 9, 17, 11, 6, 9, 7][i],
  image: "photo-1560448204-e02f11c3d0e2",
}));

const DAILY_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  all: Math.floor(1200 + Math.random() * 600),
  high: Math.floor(200 + Math.random() * 150),
  converted: Math.floor(20 + Math.random() * 40),
}));

const FUNNEL_DATA = [
  { label: "Matched", val: 42819, pct: 100 },
  { label: "Viewed", val: 12846, pct: 30 },
  { label: "Saved", val: 5138, pct: 12 },
  { label: "Contacted", val: 934, pct: 2.2 },
  { label: "Dismissed", val: 3848, pct: 9 },
  { label: "No action", val: 25821, pct: 60 },
];

const MOCK_MATCHES = Array.from({ length: 15 }, (_, i) => ({
  profileId: `ADV-${1000 + i}`,
  propTitle: ["Modern Apartment New Cairo", "Villa Sheikh Zayed", "Studio Maadi"][i % 3],
  score: 72 + (i % 20),
  featureScore: 75 + (i % 15),
  locationScore: 80 + (i % 10),
  budgetScore: 70 + (i % 20),
  wishlistScore: 65 + (i % 25),
  userAction: [null, "viewed", "saved", "contacted", "dismissed"][i % 5],
  notified: i % 3 !== 0,
  date: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
}));

const ACTION_BADGE = {
  null: "text-gray-400",
  viewed: "bg-blue-100 text-blue-700",
  saved: "bg-red-100 text-red-700",
  contacted: "bg-green-100 text-green-700",
  dismissed: "bg-gray-100 text-gray-500",
};
const ACTION_LABEL = { null: "Not viewed", viewed: "Viewed", saved: "Saved ❤️", contacted: "Contacted ✅", dismissed: "Dismissed ✗" };

function PropertyPanel({ property, onClose }) {
  const SCORES = Array.from({ length: 8 }, (_, i) => ({ range: `${60 + i * 5}–${65 + i * 5}%`, count: Math.floor(5 + Math.random() * 40) }));
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-[520px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      <div className="bg-gray-800 p-5 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-black text-lg">{property.title}</h2>
            <p className="text-gray-300 text-xs mt-1">📍 {property.city} · 💰 {property.price} EGP</p>
            <p className="text-gray-200 text-sm mt-2">This property matched <strong>{property.matches}</strong> profiles</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-orange-400">{property.avgScore}%</p>
            <p className="text-gray-400 text-[10px]">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-white">{property.views}</p>
            <p className="text-gray-400 text-[10px]">Advisor Views</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-green-400">{property.contacts}</p>
            <p className="text-gray-400 text-[10px]">Contacts</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div>
          <p className="text-xs font-black text-gray-700 mb-3">Score Distribution</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={SCORES}>
              <Bar dataKey="count" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              <XAxis dataKey="range" tick={{ fontSize: 9 }} />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 mb-3">Why This Property Scores Well</p>
          <div className="space-y-3">
            {[["Feature Match", 84, ["Has elevator (matched 198 profiles)", "Balcony view (matched 156)", "New building (matched 234)"]],
              ["Budget Match", 88, ["Priced within budget for 82% of matched profiles"]],
              ["Location Match", 91, ["Located in top-3 for 76% of matched profiles"]]
            ].map(([cat, score, items]) => (
              <div key={cat} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-gray-700">{cat}:</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-orange-600">{score}% avg</span>
                </div>
                {items.map((item, j) => <p key={j} className="text-[11px] text-green-700">✅ {item}</p>)}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 mb-3">Matched Profiles (top 5)</p>
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0">U{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">Profile #{1000 + i}</p>
                </div>
                <span className="text-xs font-black text-orange-600">{85 + i}%</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${[null, "viewed", "saved", "contacted", "dismissed"][i] ? ACTION_BADGE[[null, "viewed", "saved", "contacted", "dismissed"][i]] : "text-gray-400"}`}>
                  {ACTION_LABEL[[null, "viewed", "saved", "contacted", "dismissed"][i]]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdvisorMatches() {
  const [selectedProp, setSelectedProp] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Advisor Match Reports</h1>
        <p className="text-gray-500 text-sm">Property-to-profile matching performance and outcomes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Top Properties */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">Properties Generating Most Matches</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {["Rank", "Property", "City", "Price", "Matches", "Avg Score", "Views", "Contacts", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TOP_PROPERTIES.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProp(p)}>
                  <td className="px-3 py-3 font-black text-gray-400">#{p.id}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={`https://images.unsplash.com/${p.image}?w=50&q=60`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-gray-800 max-w-[140px] truncate">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-500">{p.city}</td>
                  <td className="px-3 py-3 font-bold text-gray-700">{p.price} EGP</td>
                  <td className="px-3 py-3"><span className="bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full">{p.matches}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.avgScore}%` }} />
                      </div>
                      <span className="font-bold text-gray-600">{p.avgScore}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{p.views}</td>
                  <td className="px-3 py-3 text-green-600 font-bold">{p.contacts}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      <button className="text-[10px] border border-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50">📊 Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">Daily Matches Generated (30 days)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={DAILY_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="all" stroke="#3B82F6" dot={false} name="All matches" strokeWidth={2} />
            <Line type="monotone" dataKey="high" stroke="#FF6B00" dot={false} name="90%+ matches" strokeWidth={2} />
            <Line type="monotone" dataKey="converted" stroke="#10B981" dot={false} name="Converted" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Behavior Funnel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">What Users Do With Matches</h2>
        <div className="space-y-2">
          {FUNNEL_DATA.map(f => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="w-20 text-xs font-semibold text-gray-600 flex-shrink-0">{f.label}</div>
              <div className="w-16 text-xs font-bold text-gray-800 text-right flex-shrink-0">{f.val.toLocaleString()}</div>
              <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                <div className="h-full bg-orange-500 rounded-lg" style={{ width: `${f.pct}%` }} />
              </div>
              <div className="w-10 text-xs font-bold text-gray-500 flex-shrink-0">{f.pct}%</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-700">
          💡 Properties with match score above 85% have <strong>3.4× higher contact rates</strong> than sub-80% matches
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-black text-gray-900 mb-4">All Matches</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                {["Profile", "Property", "Score", "Score Breakdown", "User Action", "Notified", "Date", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-bold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_MATCHES.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-3 font-mono text-blue-600 font-bold">{m.profileId}</td>
                  <td className="px-3 py-3 font-semibold text-gray-800 max-w-[140px] truncate">{m.propTitle}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${m.score}%` }} />
                      </div>
                      <span className="font-black text-orange-600">{m.score}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1.5 text-[10px]">
                      {[["F", m.featureScore], ["L", m.locationScore], ["B", m.budgetScore], ["W", m.wishlistScore]].map(([k, v]) => (
                        <div key={k} className="flex items-center gap-0.5">
                          <span className="text-gray-400">{k}:</span>
                          <span className="font-bold text-gray-700">{v}%</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${m.userAction ? ACTION_BADGE[m.userAction] : "text-gray-400"}`}>
                      {ACTION_LABEL[m.userAction]}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {m.notified ? <span className="text-green-600 font-bold">✅ Sent</span> : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-3 py-3 text-gray-400">{m.date}</td>
                  <td className="px-3 py-3">
                    <button className="text-[10px] border border-orange-200 text-orange-600 px-2 py-1 rounded-lg hover:bg-orange-50">🔔 Notify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProp && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedProp(null)} />
          <PropertyPanel property={selectedProp} onClose={() => setSelectedProp(null)} />
        </>
      )}
    </div>
  );
}