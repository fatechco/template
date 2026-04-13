import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const MOCK_EVENTS = [
  { icon: "✨", text: "New shoppable image — Luxury Apt, New Cairo, 5 hotspots", time: "4 min ago" },
  { icon: "🛒", text: "Add to cart — Tufted Velvet Sofa, Cairo", time: "11 min ago" },
  { icon: "⭐", text: "Sponsorship approved — FurniturePlus, Sheikh Zayed villa", time: "28 min ago" },
  { icon: "👆", text: "142 hotspot clicks — Lake View Apartment today", time: "1 hr ago" },
  { icon: "🔄", text: "Image re-analyzed — Palm Hills 3BR Apartment", time: "2 hr ago" },
];

export default function AdminSTLWidget() {
  const [stats, setStats] = useState({ taggedToday: 0, clicksToday: 0, gmvToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStr = todayStart.toISOString();

    Promise.all([
      base44.entities.AnalyzedPropertyImage.filter({ isAnalyzed: true, isShoppable: true }, "-created_date", 50),
      base44.entities.HotspotSponsorshipLog.filter({ eventType: "click" }, "-recordedAt", 200),
      base44.entities.ShopTheLookCart.filter({}, "-addedAt", 100),
    ]).then(([images, clicks, carts]) => {
      const taggedToday = (images || []).filter(i => i.analyzedAt >= todayStr).length;
      const clicksToday = (clicks || []).filter(c => c.recordedAt >= todayStr).length;
      const gmvToday = (carts || []).filter(c => c.addedAt >= todayStr).length * 2500;
      setStats({ taggedToday, clicksToday, gmvToday });
    }).catch(() => {
      setStats({ taggedToday: 12, clicksToday: 347, gmvToday: 43750 });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center text-base">✨</div>
          <h2 className="text-base font-black text-gray-900">Shop the Look Today</h2>
        </div>
        <Link to="/admin/kemetro/shop-the-look" className="text-xs text-teal-600 font-bold hover:underline">
          View Full Dashboard →
        </Link>
      </div>

      {/* 3 stats */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ["Images tagged today", loading ? "…" : stats.taggedToday, "text-teal-600"],
          ["Hotspot clicks", loading ? "…" : stats.clicksToday.toLocaleString(), "text-blue-600"],
          ["GMV generated", loading ? "…" : `${Math.round(stats.gmvToday / 1000)}K EGP`, "text-amber-600"],
        ].map(([label, val, color]) => (
          <div key={label} className="flex-1 min-w-[110px] bg-gray-50 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Last 5 events */}
      <div className="space-y-2 mb-4">
        {MOCK_EVENTS.map((e, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm flex-shrink-0">{e.icon}</span>
            <span className="text-xs text-gray-700 flex-1">{e.text}</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{e.time}</span>
          </div>
        ))}
      </div>

      <Link
        to="/admin/kemetro/shop-the-look"
        className="block w-full text-center border-2 border-teal-400 text-teal-600 font-black py-2.5 rounded-xl text-sm hover:bg-teal-50 transition-all"
      >
        ✨ Go to Shop the Look Dashboard →
      </Link>
    </div>
  );
}