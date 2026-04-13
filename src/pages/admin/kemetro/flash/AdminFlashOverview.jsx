import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

const TABS = [
  { label: "📊 Overview", to: "/admin/kemetro/flash" },
  { label: "⚡ Flash Deals", to: "/admin/kemetro/flash/deals" },
  { label: "🏘 Compound Deals", to: "/admin/kemetro/flash/compounds" },
  { label: "📡 Demand Signals", to: "/admin/kemetro/flash/signals" },
  { label: "⚙️ Settings", to: "/admin/kemetro/flash/settings" },
];

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  draft: "bg-gray-100 text-gray-600",
  expired: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-600",
  sold_out: "bg-yellow-100 text-yellow-700",
  forming: "bg-teal-100 text-teal-700",
  ordered: "bg-purple-100 text-purple-700",
  detected: "bg-orange-100 text-orange-700",
  notified: "bg-blue-100 text-blue-700",
  deal_created: "bg-green-100 text-green-700",
};

export default function AdminFlashOverview() {
  const { pathname } = useLocation();
  const [flashDeals, setFlashDeals] = useState([]);
  const [compoundDeals, setCompoundDeals] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.FlashDeal.list("-created_date", 100),
      base44.entities.CompoundDeal.list("-created_date", 100),
      base44.entities.DemandSignal.list("-created_date", 100),
    ]).then(([fd, cd, ds]) => { setFlashDeals(fd); setCompoundDeals(cd); setSignals(ds); setLoading(false); });
  }, []);

  const activeFlash = flashDeals.filter(d => d.status === "active").length;
  const activeCompound = compoundDeals.filter(d => ["forming", "threshold_reached"].includes(d.status)).length;
  const totalRevenue = flashDeals.reduce((s, d) => s + (d.totalRevenue || 0), 0);
  const avgDiscount = flashDeals.length > 0 ? Math.round(flashDeals.reduce((s, d) => s + (d.discountPercent || 0), 0) / flashDeals.length) : 0;
  const completedToday = flashDeals.filter(d => d.status === "completed" && new Date(d.updated_date) > new Date(Date.now() - 24 * 3600000)).length;

  const categoryData = {};
  flashDeals.forEach(d => { categoryData[d.category] = (categoryData[d.category] || 0) + 1; });
  const chartData = Object.entries(categoryData).map(([name, count]) => ({ name, count }));

  const activeTab = TABS.find(t => t.to === pathname)?.to || "/admin/kemetro/flash";

  const handleApprove = async (deal) => {
    setActionLoading(deal.id);
    await base44.entities.FlashDeal.update(deal.id, { isAdminApproved: true, status: "active" });
    setFlashDeals(prev => prev.map(d => d.id === deal.id ? { ...d, isAdminApproved: true, status: "active" } : d));
    setActionLoading(null);
  };

  const handleDetectOpportunities = async () => {
    setActionLoading("detect");
    await base44.functions.invoke("detectGroupBuyOpportunities", {}).catch(() => {});
    const updated = await base44.entities.DemandSignal.list("-created_date", 100);
    setSignals(updated);
    setActionLoading(null);
  };

  const handleGenerateOffer = async (signal) => {
    setActionLoading(signal.id);
    await base44.functions.invoke("generateGroupBuyOffer", { signalId: signal.id }).catch(() => {});
    const updated = await base44.entities.DemandSignal.list("-created_date", 100);
    setSignals(updated);
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">⚡ Kemetro Flash™ Admin</h1>
        <Link to="/kemetro/seller/flash/create" className="bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition-colors">+ Create Flash Deal</Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <Link key={t.to} to={t.to} className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>{t.label}</Link>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "/admin/kemetro/flash" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Live Flash Deals", val: loading ? "—" : activeFlash, color: "text-red-600", bg: "bg-red-50" },
              { label: "Active Group Buys", val: loading ? "—" : activeCompound, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Total Revenue", val: loading ? "—" : fmt(totalRevenue) + " EGP", color: "text-green-600", bg: "bg-green-50" },
              { label: "Avg Discount", val: loading ? "—" : avgDiscount + "%", color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Completed Today", val: loading ? "—" : completedToday, color: "text-blue-600", bg: "bg-blue-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <p className={`text-3xl font-black ${k.color}`}>{k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-3">Deals by Category</p>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={4}>
                      {chartData.map((_, i) => <Cell key={i} fill={["#ef4444","#f97316","#eab308","#22c55e","#3b82f6"][i%5]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-gray-400 text-center py-10">No data yet</p>}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100"><p className="font-black text-gray-900">Recent Flash Deals</p></div>
              {flashDeals.slice(0, 6).map(d => (
                <div key={d.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{d.productName}</p>
                    <p className="text-xs text-gray-400">{d.sellerName} · -{d.discountPercent}%</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[d.status] || "bg-gray-100"}`}>{d.status}</span>
                  {!d.isAdminApproved && d.status === "active" && (
                    <button onClick={() => handleApprove(d)} disabled={actionLoading === d.id} className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-lg hover:bg-green-600 disabled:opacity-60">
                      {actionLoading === d.id ? "..." : "✅ Approve"}
                    </button>
                  )}
                </div>
              ))}
              {flashDeals.length === 0 && !loading && <p className="px-5 py-8 text-center text-gray-400">No flash deals yet</p>}
            </div>
          </div>
        </>
      )}

      {/* FLASH DEALS TABLE */}
      {activeTab === "/admin/kemetro/flash/deals" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between">
            <p className="font-black text-gray-900">Flash Deals ({flashDeals.length})</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {["Product", "Seller", "Discount", "Sold", "Revenue", "Ends", "Approved", "Status", ""].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}
              </tr></thead>
              <tbody>
                {flashDeals.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No flash deals yet</td></tr>
                ) : flashDeals.map(d => (
                  <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900 max-w-xs truncate">{d.productName}</td>
                    <td className="px-4 py-3 text-gray-600">{d.sellerName || "—"}</td>
                    <td className="px-4 py-3"><span className="bg-red-100 text-red-700 font-black text-xs px-1.5 py-0.5 rounded-full">-{d.discountPercent}%</span></td>
                    <td className="px-4 py-3">{fmt(d.totalUnitsSold)}</td>
                    <td className="px-4 py-3 font-bold text-green-600">{fmt(d.totalRevenue)} EGP</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{d.dealEndsAt ? new Date(d.dealEndsAt).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-xs">{d.isAdminApproved ? <span className="text-green-600">✅</span> : <span className="text-red-500">⏳</span>}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[d.status] || "bg-gray-100"}`}>{d.status}</span></td>
                    <td className="px-4 py-3">
                      {!d.isAdminApproved && (
                        <button onClick={() => handleApprove(d)} disabled={actionLoading === d.id} className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-lg hover:bg-green-600 disabled:opacity-60">
                          {actionLoading === d.id ? "..." : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPOUND DEALS */}
      {activeTab === "/admin/kemetro/flash/compounds" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100"><p className="font-black text-gray-900">Compound Deals ({compoundDeals.length})</p></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {["Product", "Compound", "City", "Participants", "Total Qty", "Status", "Closing"].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}
              </tr></thead>
              <tbody>
                {compoundDeals.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No compound deals yet</td></tr>
                ) : compoundDeals.map(d => (
                  <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold truncate max-w-xs">{d.productName}</td>
                    <td className="px-4 py-3 text-teal-600 font-bold">{d.compoundName}</td>
                    <td className="px-4 py-3 text-gray-500">{d.cityName || "—"}</td>
                    <td className="px-4 py-3 font-bold">{d.currentParticipants}</td>
                    <td className="px-4 py-3">{fmt(d.currentTotalQty)} {d.unit}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[d.status] || "bg-gray-100"}`}>{d.status}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{d.dealClosingAt ? new Date(d.dealClosingAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEMAND SIGNALS */}
      {activeTab === "/admin/kemetro/flash/signals" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-black text-gray-900">Demand Signals ({signals.length})</p>
            <button onClick={handleDetectOpportunities} disabled={actionLoading === "detect"} className="bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-teal-600 disabled:opacity-60 flex items-center gap-2">
              {actionLoading === "detect" ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "🤖"}
              Detect Opportunities
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  {["Type", "Category", "Location", "Buyers", "Strength", "Value", "Status", ""].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-bold text-gray-500">{h}</th>)}
                </tr></thead>
                <tbody>
                  {signals.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No demand signals detected yet. Click "Detect Opportunities" to scan.</td></tr>
                  ) : signals.map(s => (
                    <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-bold text-orange-600">{s.signalType?.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">{s.productCategory}</td>
                      <td className="px-4 py-3 text-gray-500">{s.cityName || s.locationCityId || "—"}</td>
                      <td className="px-4 py-3 font-bold">{s.estimatedBuyerCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${s.signalStrength}%` }} />
                          </div>
                          <span className="text-xs">{s.signalStrength}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-green-600 font-bold">{fmt(s.potentialGroupBuyValue)} EGP</td>
                      <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[s.status] || "bg-gray-100"}`}>{s.status}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleGenerateOffer(s)} disabled={actionLoading === s.id} className="text-xs bg-teal-500 text-white font-bold px-2 py-1 rounded-lg hover:bg-teal-600 disabled:opacity-60">
                          {actionLoading === s.id ? "..." : "🤖 Create Offer"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "/admin/kemetro/flash/settings" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="font-black text-gray-900">⚙️ Flash™ Settings</h3>
          <div>
            <p className="font-bold text-gray-700 mb-3">Flash Deals</p>
            {[
              { label: "Max discount without approval", val: "40%", type: "number" },
              { label: "Min deal duration (hours)", val: "12", type: "number" },
              { label: "Platform fee (flash deals %)", val: "3", type: "number" },
              { label: "Require approval for deals > (EGP)", val: "500,000", type: "number" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">{s.label}</span>
                <input defaultValue={s.val} className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-28 text-right focus:outline-none focus:border-orange-400" />
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-3">Compound Deals</p>
            {[
              { label: "Min participants to activate", val: "3" },
              { label: "Max deal duration (days)", val: "30" },
              { label: "FO commission (%)", val: "2" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-700">{s.label}</span>
                <input defaultValue={s.val} className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-28 text-right focus:outline-none focus:border-orange-400" />
              </div>
            ))}
            {[
              { label: "Auto-create deals from demand signals", enabled: true },
              { label: "Notify users on new nearby deals", enabled: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{s.label}</span>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer ${s.enabled ? "bg-orange-500" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 ${s.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}