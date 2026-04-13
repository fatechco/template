import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "0";

const MOCK_OFFERINGS = [
  { id: "f1", offeringTitle: "New Cairo Apt — Series A", status: "live", tokenPriceEGP: 1000, totalTokenSupply: 1000, tokensSold: 420, expectedAnnualYieldPercent: 9.5 },
  { id: "f2", offeringTitle: "Sheikh Zayed Villa", status: "under_review", tokenPriceEGP: 5000, totalTokenSupply: 500, tokensSold: 0, expectedAnnualYieldPercent: 0 },
  { id: "f3", offeringTitle: "North Coast Chalet", status: "approved", tokenPriceEGP: 800, totalTokenSupply: 2000, tokensSold: 2000, expectedAnnualYieldPercent: 11.2 },
  { id: "f4", offeringTitle: "Maadi Office Space", status: "live", tokenPriceEGP: 3000, totalTokenSupply: 300, tokensSold: 120, expectedAnnualYieldPercent: 8 },
];

const MOCK_KYC = [
  { id: "k1", fullName: "Ahmed Hassan", kycStatus: "pending_review", created_date: new Date().toISOString() },
  { id: "k2", fullName: "Sara Mohamed", kycStatus: "pending_review", created_date: new Date().toISOString() },
];

const MOCK_SALES_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  tokens: Math.floor(Math.random() * 80 + 10),
}));

const MOCK_ACTIVITY = [
  { icon: "🔷", text: "New fractional offering submitted — New Cairo Apartment", time: "2 min ago" },
  { icon: "✅", text: "Offering tokenized — KMF-NC-001 deployed on NEAR testnet", time: "1h ago" },
  { icon: "💰", text: "Yield distributed — 47,500 EGP to 19 investors", time: "3h ago" },
  { icon: "👤", text: "KYC approved — Sara Mohamed", time: "5h ago" },
  { icon: "🛒", text: "Token purchase — 25 tokens of KMF-NC-001 by Ahmed H.", time: "6h ago" },
  { icon: "🔷", text: "New fractional offering submitted — Sheikh Zayed Villa", time: "8h ago" },
  { icon: "🛒", text: "Token purchase — 10 tokens of KMF-SZ-002", time: "10h ago" },
  { icon: "👤", text: "KYC application received — Omar Khalil", time: "12h ago" },
];

const DONUT_COLORS = { live: "#00C896", under_review: "#F59E0B", sold_out: "#3B82F6", rejected: "#EF4444", approved: "#8B5CF6" };

export default function KemeFracAdminDashboard() {
  const [offerings, setOfferings] = useState(MOCK_OFFERINGS);
  const [kycs, setKycs] = useState(MOCK_KYC);

  useEffect(() => {
    base44.entities.FracProperty.filter({}, "-created_date", 100).then(d => { if (d?.length) setOfferings(d); }).catch(() => {});
    base44.entities.FracKYC.filter({ kycStatus: "pending_review" }).then(d => { if (d?.length) setKycs(d); }).catch(() => {});
  }, []);

  const live = offerings.filter(o => o.status === "live");
  const underReview = offerings.filter(o => o.status === "under_review");
  const approved = offerings.filter(o => o.status === "approved");
  const totalInvested = offerings.reduce((s, o) => s + ((o.tokensSold || 0) * (o.tokenPriceEGP || 0)), 0);
  const avgYield = offerings.filter(o => o.expectedAnnualYieldPercent > 0).reduce((s, o, _, a) => s + o.expectedAnnualYieldPercent / a.length, 0);

  const donutData = Object.entries(
    offerings.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const kpis = [
    { icon: "🔷", label: "Live Offerings", value: live.length, sub: `↑ +${underReview.length} pending`, color: "#00C896" },
    { icon: "👥", label: "Total Investors", value: 47, sub: "47 unique wallets", color: "white" },
    { icon: "💰", label: "Total Invested", value: `${fmt(totalInvested)} EGP`, sub: `≈ $${(totalInvested / 50000).toFixed(1)}M USD`, color: "#00C896" },
    { icon: "📊", label: "Avg Annual Yield", value: `${avgYield.toFixed(1)}%`, sub: "across all offerings", color: "#F59E0B" },
    { icon: "💳", label: "Platform Fees", value: `${fmt(totalInvested * 0.025)} EGP`, sub: "this month", color: "#00C896" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🔷 KemeFrac™ Dashboard</h1>
          <p className="text-sm text-gray-400">Fractional property investment operations</p>
        </div>
        <Link to="/admin/kemedar/kemefrac/tokenize"
          className="px-4 py-2 rounded-xl font-black text-sm"
          style={{ background: "#0A1628", color: "#00C896" }}>
          🔷 Tokenize Offerings
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl p-4 border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{k.icon}</span>
              <p className="text-xs text-gray-400 font-bold">{k.label}</p>
            </div>
            <p className="text-xl font-black text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-black text-gray-800 mb-4">Token Sales Over Time (30d)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_SALES_DATA}>
              <XAxis dataKey="day" tick={false} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="tokens" stroke="#00C896" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <p className="font-black text-gray-800 mb-4">Offering Status Distribution</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {donutData.map((entry, i) => <Cell key={i} fill={DONUT_COLORS[entry.name] || "#ccc"} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: DONUT_COLORS[d.name] || "#ccc" }} />
                  <span className="capitalize text-gray-600">{d.name.replace("_", " ")}</span>
                  <span className="font-black text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="space-y-3">
        {underReview.length > 0 && (
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA" }}>
            <p className="font-bold text-orange-800">⏳ {underReview.length} offerings awaiting review</p>
            <Link to="/admin/kemedar/kemefrac/offerings?status=under_review"
              className="text-xs font-black px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200">
              Review Now →
            </Link>
          </div>
        )}
        {approved.length > 0 && (
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#F0FDF9", border: "1.5px solid #6EE7B7" }}>
            <p className="font-bold text-teal-800">🔷 {approved.length} offerings ready to tokenize on NEAR</p>
            <Link to="/admin/kemedar/kemefrac/tokenize"
              className="text-xs font-black px-3 py-1.5 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-200">
              Tokenize Now →
            </Link>
          </div>
        )}
        {kycs.length > 0 && (
          <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}>
            <p className="font-bold text-blue-800">👤 {kycs.length} KYC applications to review</p>
            <Link to="/admin/kemedar/kemefrac/kyc"
              className="text-xs font-black px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200">
              Review KYC →
            </Link>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="font-black text-gray-800 mb-4">Recent Activity</p>
        <div className="space-y-3">
          {MOCK_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
              <p className="flex-1 text-gray-700">{a.text}</p>
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}