import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Eye, MousePointerClick, ShoppingCart, DollarSign, Megaphone } from "lucide-react";

const CATEGORY_COLORS = ["#14B8A6", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280", "#10B981", "#F97316"];

function KPICard({ icon, label, value, sub, color }) {
  return (
    <div className={`${color} rounded-2xl p-5`}>
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-2xl font-black leading-tight">{value}</p>
      <p className="text-sm font-bold mt-1">{label}</p>
      {sub && <p className="text-xs opacity-70 mt-0.5">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, count, percent, color, isFirst }) {
  const width = isFirst ? 100 : Math.max(10, percent);
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-52 text-xs text-gray-600 text-right flex-shrink-0">{label}</div>
      <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
        <div className="h-full rounded-lg transition-all" style={{ width: `${width}%`, background: color }} />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="text-xs font-bold text-white">{count.toLocaleString()}</span>
          {!isFirst && <span className="text-xs font-bold text-white">{percent.toFixed(1)}%</span>}
        </div>
      </div>
    </div>
  );
}

const FUNNEL_COLORS = ["#3B82F6", "#6366F1", "#8B5CF6", "#A855F7", "#D946EF"];

export default function STLAnalytics() {
  const [stats, setStats] = useState({
    shoppableImages: 0, totalHotspots: 0,
    clickRate: 0, cartRate: 0,
    gmv: 0, sponsorRevenue: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [topImages, setTopImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [images, hotspots, logs] = await Promise.all([
          base44.entities.AnalyzedPropertyImage.filter({ isAnalyzed: true, isShoppable: true }, "-totalHotspotClicks", 100),
          base44.entities.ImageHotspot.filter({ isActive: true }, "-clickCount", 200),
          base44.entities.HotspotSponsorshipLog.list("-recordedAt", 500),
        ]);

        const totalHotspots = hotspots.reduce((s, h) => s + (h.clickCount || 0), 0);
        const totalCarts = hotspots.reduce((s, h) => s + (h.addToCartCount || 0), 0);
        const totalViews = images.reduce((s, i) => s + (i.totalViews || 0), 0);

        const clickRate = totalViews > 0 ? ((totalHotspots / totalViews) * 100) : 0;
        const cartRate = totalHotspots > 0 ? ((totalCarts / totalHotspots) * 100) : 0;
        const gmv = totalCarts * 2500;
        const sponsorRevenue = (logs || []).reduce((s, l) => s + (l.costEGP || 0), 0);

        // Category breakdown
        const catMap = {};
        hotspots.forEach(h => {
          const cat = h.kemetroCategorySlug || "other";
          catMap[cat] = (catMap[cat] || 0) + (h.clickCount || 0);
        });
        const totalClicks = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
        const catData = Object.entries(catMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)
          .map(([name, clicks]) => ({ name, clicks, pct: ((clicks / totalClicks) * 100).toFixed(1) }));

        setStats({
          shoppableImages: images.length,
          totalHotspots: hotspots.length,
          clickRate: clickRate.toFixed(1),
          cartRate: cartRate.toFixed(1),
          gmv,
          sponsorRevenue,
        });
        setCategoryData(catData);
        setTopImages(images.slice(0, 10));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const funnelData = [
    { label: "Property views", count: 1240000, percent: 100 },
    { label: "Gallery opens", count: 89200, percent: 7.2 },
    { label: '"Shop this room" clicks', count: 14300, percent: 16.0 },
    { label: "Hotspot dot clicks", count: 6100, percent: 42.7 },
    { label: "Add to cart", count: 980, percent: 16.1 },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">✨ Shop the Look — Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Performance overview for the AI shoppable room feature</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/kemetro/shop-the-look/images" className="px-4 py-2 bg-teal-500 text-white font-bold text-sm rounded-xl hover:bg-teal-600 transition-colors">Image Library →</Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard icon="✨" label="Total Shoppable Images" value={loading ? "…" : stats.shoppableImages.toLocaleString()} sub={`${stats.totalHotspots.toLocaleString()} hotspots tagged`} color="bg-teal-50 text-teal-800" />
        <KPICard icon="👆" label="Hotspot Click Rate" value={loading ? "…" : `${stats.clickRate}%`} sub="of property viewers clicked a hotspot" color="bg-cyan-50 text-cyan-800" />
        <KPICard icon="🛒" label="Add-to-Cart Conversion" value={loading ? "…" : `${stats.cartRate}%`} sub="of hotspot clicks led to cart add" color="bg-blue-50 text-blue-800" />
        <KPICard icon="💰" label="Estimated GMV" value={loading ? "…" : `${Math.round(stats.gmv / 1000)}K EGP`} sub="Kemetro revenue from Shop the Look CTAs" color="bg-amber-50 text-amber-800" />
        <KPICard icon="📢" label="Sponsorship Revenue" value={loading ? "…" : `${Math.round(stats.sponsorRevenue).toLocaleString()} EGP`} sub="from seller-sponsored pins this month" color="bg-orange-50 text-orange-800" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Most Shopped Item Categories</h3>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          ) : (
            <div className="space-y-2">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-32 flex-shrink-0 capitalize">{cat.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full rounded-full flex items-center pl-2" style={{ width: `${cat.pct}%`, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}>
                      <span className="text-[10px] text-white font-bold">{cat.pct}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{cat.clicks}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Funnel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 text-sm mb-4">Conversion Funnel — Shop the Look</h3>
          <div className="space-y-1">
            {funnelData.map((item, i) => (
              <FunnelBar key={item.label} label={item.label} count={item.count} percent={item.percent} color={FUNNEL_COLORS[i]} isFirst={i === 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Top images table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Top Performing Images</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Image", "Property", "Room Style", "Hotspots", "Views", "Clicks", "Add to Carts", "Est. GMV", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">Loading…</td></tr>
              ) : topImages.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No data yet</td></tr>
              ) : topImages.map(img => (
                <tr key={img.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img src={img.imageUrl} alt="" className="w-14 h-10 object-cover rounded-lg" />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 max-w-[140px] truncate">{img.propertyId?.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">{img.roomStyle || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-gray-900">{img.hotspotCount || 0}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{(img.totalViews || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{(img.totalHotspotClicks || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-700">{(img.totalAddToCarts || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-orange-600">{((img.totalAddToCarts || 0) * 2500).toLocaleString()} EGP</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/kemetro/shop-the-look/images`} className="text-xs text-teal-600 font-bold hover:underline">View →</Link>
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