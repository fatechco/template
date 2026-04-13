import { useState, useEffect } from "react";
import { Pause, Play, StopCircle, Check, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TABS = ["Active", "Pending Approval", "Ended"];

export default function STLSponsorships() {
  const [activeTab, setActiveTab] = useState("Active");
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);

  const loadSponsorships = async () => {
    setLoading(true);
    try {
      let statusFilter = {};
      if (activeTab === "Active") statusFilter = { sponsorshipStatus: "active" };
      else if (activeTab === "Pending Approval") statusFilter = { sponsorshipStatus: "pending" };
      else if (activeTab === "Ended") statusFilter = { sponsorshipStatus: "ended" };

      const hotspots = await base44.entities.ImageHotspot.filter(
        { isSponsored: true, ...statusFilter }, "-created_date", 50
      );

      const enriched = await Promise.all((hotspots || []).map(async h => {
        const [imgs, logs] = await Promise.all([
          base44.entities.AnalyzedPropertyImage.filter({ id: h.imageId }).catch(() => []),
          base44.entities.HotspotSponsorshipLog.filter({ hotspotId: h.id }).catch(() => []),
        ]);
        const img = imgs?.[0];
        const property = img ? await base44.entities.Property.filter({ id: img.propertyId }).then(r => r?.[0]).catch(() => null) : null;
        const seller = h.sponsoredBySellerId ? await base44.entities.User.filter({ id: h.sponsoredBySellerId }).then(r => r?.[0]).catch(() => null) : null;
        const clicks = (logs || []).filter(l => l.eventType === "click").length;
        const spent = (logs || []).reduce((s, l) => s + (l.costEGP || 0), 0);
        return { ...h, _property: property, _imageUrl: img?.imageUrl, _seller: seller, clicks, spent };
      }));

      setSponsorships(enriched);

      // Revenue stats
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const allLogs = await base44.entities.HotspotSponsorshipLog.list("-recordedAt", 1000).catch(() => []);
      const thisMonth = (allLogs || []).filter(l => l.recordedAt >= monthStart).reduce((s, l) => s + (l.costEGP || 0), 0);
      const lastMonth = (allLogs || []).filter(l => l.recordedAt >= lastMonthStart && l.recordedAt < monthStart).reduce((s, l) => s + (l.costEGP || 0), 0);
      setMonthRevenue(thisMonth);
      setLastMonthRevenue(lastMonth);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadSponsorships(); }, [activeTab]);

  const handleApprove = async (id) => {
    await base44.entities.ImageHotspot.update(id, { sponsorshipStatus: "active" });
    loadSponsorships();
  };

  const handleToggle = async (h) => {
    const newStatus = h.sponsorshipStatus === "active" ? "paused" : "active";
    await base44.entities.ImageHotspot.update(h.id, { sponsorshipStatus: newStatus });
    loadSponsorships();
  };

  const handleEnd = async (id) => {
    await base44.entities.ImageHotspot.update(id, { isSponsored: false, sponsorshipStatus: "ended" });
    loadSponsorships();
  };

  const trendPct = lastMonthRevenue > 0 ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0) : 0;
  const trendUp = monthRevenue >= lastMonthRevenue;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">✨ Shop the Look — Sponsorships</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage seller-sponsored hotspot campaigns</p>
      </div>

      {/* Revenue summary */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">Total Sponsorship Revenue This Month</p>
          <p className="text-white text-3xl font-black">{monthRevenue.toLocaleString()} EGP</p>
        </div>
        <div className={`text-white font-bold text-sm px-4 py-2 rounded-xl ${trendUp ? "bg-white/20" : "bg-red-400/30"}`}>
          {trendUp ? "↑" : "↓"} {Math.abs(trendPct)}% vs last month
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Seller", "Product", "Property", "Item Tagged", "Daily Budget", "Spent (EGP)", "Clicks", "Start Date", "End Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400">Loading…</td></tr>
              )}
              {!loading && sponsorships.length === 0 && (
                <tr><td colSpan={10} className="text-center py-12 text-gray-400">
                  <p className="text-3xl mb-2">📌</p>
                  <p className="font-bold">No {activeTab.toLowerCase()} sponsorships</p>
                </td></tr>
              )}
              {!loading && sponsorships.map(h => (
                <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-gray-900">{h._seller?.full_name || h._seller?.email?.split("@")[0] || "Unknown"}</p>
                    <p className="text-[10px] text-gray-400">{h._seller?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-teal-700 font-bold">{h.sponsoredProductId ? "✓ Linked" : "—"}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[150px]">
                    <div className="flex items-center gap-2">
                      {h._imageUrl && <img src={h._imageUrl} alt="" className="w-9 h-9 object-cover rounded-lg flex-shrink-0" />}
                      <span className="text-xs text-gray-700 line-clamp-2">{h._property?.title?.slice(0, 35) || "Property"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-gray-900">{h.itemLabel}</span>
                    <br /><span className="text-[10px] text-gray-400">{h.kemetroCategorySlug}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-700">{(h.sponsorshipDailyBudgetEGP || 50).toLocaleString()} EGP</td>
                  <td className="px-4 py-3 text-xs font-bold text-orange-600">{(h.spent || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-700">{(h.clicks || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{h.sponsorshipStartDate || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{h.sponsorshipEndDate || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {activeTab === "Pending Approval" && (
                        <button onClick={() => handleApprove(h.id)} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                          <Check size={12} /> Approve
                        </button>
                      )}
                      {activeTab !== "Ended" && activeTab !== "Pending Approval" && (
                        <>
                          <button onClick={() => handleToggle(h)} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600" title={h.sponsorshipStatus === "active" ? "Pause" : "Resume"}>
                            {h.sponsorshipStatus === "active" ? <Pause size={13} /> : <Play size={13} />}
                          </button>
                          <button onClick={() => handleEnd(h.id)} className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500" title="End Campaign">
                            <StopCircle size={13} />
                          </button>
                        </>
                      )}
                      {h._property && (
                        <a href={`/property/${h._property.id}`} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600" title="View Property">
                          <ExternalLink size={13} />
                        </a>
                      )}
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