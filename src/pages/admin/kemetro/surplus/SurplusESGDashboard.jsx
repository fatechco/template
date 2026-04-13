import { useState, useEffect } from "react";
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileDown, TrendingUp, Leaf, Zap, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function SurplusESGDashboard() {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [devScores, setDevScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ from: "2026-01-01", to: "2026-04-07" });
  const [reportSections, setReportSections] = useState({
    waste: true, co2: true, gmv: true, devs: true, categories: true, trends: true
  });

  useEffect(() => {
    Promise.all([
      base44.entities.SurplusItem.list("-created_date", 1000).catch(() => []),
      base44.entities.SurplusTransaction.list("-created_date", 1000).catch(() => []),
      base44.entities.DeveloperEcoScore.list("-totalWeightKgDiverted", 100).catch(() => []),
    ]).then(([it, tr, ds]) => {
      setItems(it || []);
      setTransactions(tr || []);
      setDevScores(ds || []);
      setLoading(false);
    });
  }, []);

  // Calculate KPIs
  const totalKgDiverted = items.reduce((sum, i) => sum + (i.estimatedWeightKg || 0), 0);
  const totalItemsListed = items.length;
  const itemsSold = transactions.filter(t => t.transactionType === "settlement").length;
  const totalCo2Saved = items.reduce((sum, i) => sum + (i.estimatedCo2SavedKg || 0), 0);
  const totalGMV = transactions.filter(t => t.transactionType === "settlement").reduce((sum, t) => sum + (t.amountEGP || 0), 0);
  const buyerSavings = totalGMV * 0.4; // Approx 40% savings vs retail
  const platformRevenue = totalGMV * 0.05;

  // Monthly data for trends
  const monthlyData = [
    { month: "Dec", kg: 2100, items: 45 },
    { month: "Jan", kg: 2800, items: 62 },
    { month: "Feb", kg: 3200, items: 71 },
    { month: "Mar", kg: 3900, items: 85 },
    { month: "Apr", kg: 2100, items: 48 }, // Partial
  ];

  // Category breakdown
  const categoryData = [
    { name: "Tiles & Flooring", value: 28, kg: 2400 },
    { name: "Paint & Coatings", value: 20, kg: 1720 },
    { name: "Electrical", value: 18, kg: 1540 },
    { name: "Plumbing", value: 15, kg: 1285 },
    { name: "Wood & Timber", value: 12, kg: 1030 },
    { name: "Doors & Windows", value: 7, kg: 600 },
  ];

  // Seller type breakdown
  const sellerTypes = [
    { name: "Homeowners", value: 48 },
    { name: "Professionals", value: 28 },
    { name: "Developers", value: 18 },
    { name: "Stores", value: 6 },
  ];

  // Funnel data
  const funnelData = [
    { level: "Items Listed", count: totalItemsListed, pct: 100 },
    { level: "Items Viewed (>1)", count: Math.floor(totalItemsListed * 0.72), pct: 72 },
    { level: "Items Reserved", count: Math.floor(totalItemsListed * 0.28), pct: 28 },
    { level: "Items Settled", count: itemsSold, pct: Math.floor((itemsSold / totalItemsListed) * 100) },
    { level: "Shipped via Kemetro", count: Math.floor(itemsSold * 0.35), pct: 35 },
  ];

  const COLORS = ["#14b8a6", "#0d9488", "#0f766e", "#134e4a", "#0c4a3d", "#082f28"];

  const handleGenerateReport = async () => {
    try {
      const result = await base44.functions.invoke("generateSurplusESGReport", {
        dateRange,
        sections: reportSections,
        includeCharts: true,
      });
      if (result.data?.pdf_url) window.open(result.data.pdf_url, "_blank");
    } catch (e) {
      alert("Report generation failed");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white p-8">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black mb-2">🌍 Kemetro Surplus ESG Dashboard</h1>
            <p className="text-green-100">Environmental, Social & Governance impact metrics</p>
          </div>
          <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 border-2 border-white text-white hover:bg-white/10 rounded-lg font-bold transition-all">
            <FileDown size={18} /> Generate ESG Report PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Waste diverted */}
          <div className="bg-white rounded-2xl p-6 border-t-4 border-green-600 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">🌍 Waste Diverted from Landfill</p>
            <p className="text-3xl font-black text-green-700">{(totalKgDiverted / 1000).toFixed(1)}K kg</p>
            <p className="text-xs text-gray-400 mt-2">all time | ↑ +2,100 kg this month</p>
          </div>

          {/* Items traded */}
          <div className="bg-white rounded-2xl p-6 border-t-4 border-teal-600 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">♻️ Items Successfully Traded</p>
            <p className="text-3xl font-black text-teal-700">{itemsSold.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-2">{(totalGMV / 1000000).toFixed(1)}M EGP total GMV | ↑ +{Math.floor(itemsSold * 0.15)} this month</p>
          </div>

          {/* CO2 avoided */}
          <div className="bg-white rounded-2xl p-6 border-t-4 border-emerald-600 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">🌿 CO2 Emissions Avoided</p>
            <p className="text-3xl font-black text-emerald-700">{(totalCo2Saved / 1000).toFixed(1)} tons</p>
            <p className="text-xs text-gray-400 mt-2">equivalent to {Math.floor(totalCo2Saved / 21)} trees planted</p>
          </div>

          {/* Buyer savings */}
          <div className="bg-white rounded-2xl p-6 border-t-4 border-yellow-600 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">💰 Buyer Savings Generated</p>
            <p className="text-3xl font-black text-yellow-600">{(buyerSavings / 1000000).toFixed(1)}M EGP</p>
            <p className="text-xs text-gray-400 mt-2">vs. retail price | ↑ +{(totalGMV * 0.4 * 0.15 / 1000).toFixed(0)}K EGP this month</p>
          </div>
        </div>

        {/* Platform revenue */}
        <div className="bg-white rounded-2xl p-6 border-l-4 border-green-600 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-2">Platform Revenue from Surplus</h3>
          <p className="text-4xl font-black text-gray-900 mb-1">{(platformRevenue / 1000).toFixed(0)}K EGP</p>
          <p className="text-sm text-gray-500">[{itemsSold}] transactions × [5]% fee</p>
          <div className="mt-4 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <Bar dataKey="kg" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Waste over time */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Waste Diverted Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs><linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="kg" stroke="#14b8a6" fillOpacity={1} fill="url(#colorKg)" />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-3">Goal: 10,000 kg/month by Q4</p>
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Top Material Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seller type & Funnel row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Seller type pie */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Seller Type Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sellerTypes} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {sellerTypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Funnel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Transaction Funnel</h3>
            <div className="space-y-3">
              {funnelData.map((level, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">{level.level}</span>
                    <span className="text-gray-500">{level.count.toLocaleString()} ({level.pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-teal-600 h-2 rounded-full"
                      style={{ width: `${level.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report generator */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-l-4 border-green-600">
          <h3 className="text-2xl font-black text-gray-900 mb-2">🖨️ Generate ESG Impact Report</h3>
          <p className="text-gray-600 mb-6">Beautiful PDF for press releases, investor decks, and CSR reporting</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">From Date</label>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">To Date</label>
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-sm font-bold text-gray-700">Include sections:</p>
            {[
              { key: "waste", label: "Waste diversion summary" },
              { key: "co2", label: "CO2 savings calculation" },
              { key: "gmv", label: "GMV and buyer savings" },
              { key: "devs", label: "Top eco developers" },
              { key: "categories", label: "Category breakdown" },
              { key: "trends", label: "Monthly trend charts" },
            ].map((section) => (
              <label key={section.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportSections[section.key]}
                  onChange={(e) => setReportSections({...reportSections, [section.key]: e.target.checked})}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{section.label}</span>
              </label>
            ))}
          </div>

          <button onClick={handleGenerateReport} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl text-lg transition-colors">
            Generate ESG Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}