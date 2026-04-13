import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const fmt = (n) => Number(n).toLocaleString();
const fmtEGP = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M EGP`;
  return `${fmt(n)} EGP`;
};

function TickerRow({ segments, speed, bgColor, paused }) {
  const content = [...segments, ...segments].join("   ·   ");
  return (
    <div
      className="overflow-hidden flex items-center"
      style={{ height: 26, background: bgColor }}
    >
      <div
        className="whitespace-nowrap text-white text-[12px] font-medium tracking-[0.02em] px-6 select-none"
        style={{
          animation: `tickerScroll${speed} ${speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {content}
      </div>
    </div>
  );
}

export default function FooterTicker() {
  const [paused, setPaused] = useState(false);
  const [ecoStats, setEcoStats] = useState({
    weightKg: 0, aiAnalyses: 0, ecoTx: 0,
    kemeKitCalcs: 0, liveAuctions: 0, fracTokens: 0, escrowEGP: 0,
  });
  const [platformStats, setPlatformStats] = useState({
    properties: 0, projects: 0, products: 0, stores: 0,
    tasks: 0, services: 0, professionals: 0, agents: 0,
    developers: 0, franchiseOwners: 0, users: 0, countries: 0,
  });

  const loadEco = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const [soldItems, ecoTxList, kitsTemplates, liveAuctions, extAuctions, fracProps, escrowAuctions, snapToday] =
        await Promise.allSettled([
          base44.entities.SurplusItem.filter({ status: "sold" }, "-created_date", 500),
          base44.entities.SurplusTransaction.filter({ transactionType: "settlement" }, "-created_date", 500),
          base44.entities.KemeKitTemplate.list("-created_date", 200),
          base44.entities.PropertyAuction.filter({ status: "live" }, "-created_date", 50),
          base44.entities.PropertyAuction.filter({ status: "extended" }, "-created_date", 50),
          base44.entities.FracProperty.list("-created_date", 200),
          base44.entities.PropertyAuction.filter({ status: "legal_transfer" }, "-created_date", 200),
          base44.entities.SnapSession.filter({ created_date: { $gte: today } }, "-created_date", 500),
        ]);
      const g = (r) => (r.status === "fulfilled" ? r.value || [] : []);
      setEcoStats({
        weightKg: Math.round(g(soldItems).reduce((s, i) => s + (i.estimatedWeightKg || 0), 0)),
        aiAnalyses: g(snapToday).length,
        ecoTx: g(ecoTxList).length,
        kemeKitCalcs: g(kitsTemplates).reduce((s, t) => s + (t.totalCalculationsRun || 0), 0),
        liveAuctions: g(liveAuctions).length + g(extAuctions).length,
        fracTokens: g(fracProps).reduce((s, p) => s + (p.tokensSold || 0), 0),
        escrowEGP: Math.round(g(escrowAuctions).reduce((s, a) => s + (a.winnerBidEGP || 0), 0)),
      });
    } catch { /* silent */ }
  };

  const loadPlatform = async () => {
    try {
      const [props, projects, products, stores, tasks, services, users, countries] =
        await Promise.allSettled([
          base44.entities.Property.filter({ is_active: true }, "-created_date", 1),
          base44.entities.Project.filter({}, "-created_date", 1),
          base44.entities.KemetroProduct.filter({ isActive: true }, "-created_date", 1),
          base44.entities.KemetroStore.list("-created_date", 1),
          base44.entities.KemeworkTask.list("-created_date", 1),
          base44.entities.KemeworkService.filter({ isActive: true }, "-created_date", 1),
          base44.entities.User.list("-created_date", 1),
          base44.entities.Country.list("-created_date", 1),
        ]);
      const cnt = (r) => (r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0);
      // Use rough estimates from counts (limited to 1 record, so just show real totals from a bigger pull)
      setPlatformStats(prev => ({
        ...prev,
        countries: cnt(countries),
      }));
      // Do a second pass with more records for meaningful counts
      const [p2, pr2, pd2, st2, tk2, sv2, us2] = await Promise.allSettled([
        base44.entities.Property.filter({ is_active: true }, "-created_date", 1000),
        base44.entities.Project.list("-created_date", 500),
        base44.entities.KemetroProduct.filter({ isActive: true }, "-created_date", 1000),
        base44.entities.KemetroStore.list("-created_date", 500),
        base44.entities.KemeworkTask.list("-created_date", 1000),
        base44.entities.KemeworkService.filter({ isActive: true }, "-created_date", 1000),
        base44.entities.User.list("-created_date", 1000),
      ]);
      const g = (r) => (r.status === "fulfilled" ? r.value || [] : []);
      const allUsers = g(us2);
      setPlatformStats({
        properties: g(p2).length,
        projects: g(pr2).length,
        products: g(pd2).length,
        stores: g(st2).length,
        tasks: g(tk2).length,
        services: g(sv2).length,
        professionals: allUsers.filter(u => u.role === "kemework_professional").length,
        agents: allUsers.filter(u => ["agent", "real_estate_agent"].includes(u.role)).length,
        developers: allUsers.filter(u => u.role === "developer").length,
        franchiseOwners: allUsers.filter(u => ["franchise_owner_area", "franchise_owner_country"].includes(u.role)).length,
        users: allUsers.length,
        countries: cnt(countries),
      });
    } catch { /* silent */ }
  };

  useEffect(() => {
    loadEco();
    loadPlatform();
    const t1 = setInterval(loadEco, 60_000);
    const t2 = setInterval(loadPlatform, 300_000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const ecoSegments = [
    `🌍 <b>${fmt(ecoStats.weightKg)}</b> kg waste saved via Surplus`,
    `🧠 ThinkDar™ — <b>${fmt(ecoStats.aiAnalyses)}</b> AI analyses today`,
    `♻️ <b>${fmt(ecoStats.ecoTx)}</b> eco transactions`,
    `📐 <b>${fmt(ecoStats.kemeKitCalcs)}</b> KemeKit calculations run`,
    `🔨 <b>${ecoStats.liveAuctions}</b> live auctions now`,
    `🔷 <b>${fmt(ecoStats.fracTokens)}</b> KemeFrac™ tokens sold`,
    `💰 <b>${fmtEGP(ecoStats.escrowEGP)}</b> in escrow →`,
  ];

  const platformSegments = [
    `🏠 <b>${fmt(platformStats.properties)}</b> Properties Listed`,
    `🏗️ <b>${platformStats.projects}</b> Projects & Compounds`,
    `🛒 <b>${fmt(platformStats.products)}</b> Products Available`,
    `🏪 <b>${platformStats.stores}</b> Verified Stores`,
    `📋 <b>${fmt(platformStats.tasks)}</b> Tasks Posted`,
    `🔧 <b>${fmt(platformStats.services)}</b> Services Listed`,
    `👷 <b>${platformStats.professionals}</b> Verified Professionals`,
    `🤝 <b>${platformStats.agents}</b> Licensed Agents`,
    `🏢 <b>${platformStats.developers}</b> Registered Developers`,
    `🗺️ <b>${platformStats.franchiseOwners}</b> Franchise Owners`,
    `👥 <b>${fmt(platformStats.users)}</b> Registered Users`,
    `🌍 <b>${platformStats.countries}</b> Countries Covered →`,
  ];

  // Render as plain text (HTML entities won't render in text nodes)
  const renderRow1 = ecoSegments.map(s => s.replace(/<b>/g, "").replace(/<\/b>/g, "")).join("   ·   ");
  const renderRow2 = platformSegments.map(s => s.replace(/<b>/g, "").replace(/<\/b>/g, "")).join("   ·   ");

  return (
    <div
      className="border-t border-b w-full"
      style={{ borderColor: "#1E3A5F", background: "#0A1628" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Row 1 — Eco & AI */}
      <div className="overflow-hidden flex items-center" style={{ height: 26, background: "#14532D" }}>
        <span
          className="whitespace-nowrap text-[12px] font-medium tracking-[0.02em] px-6 select-none inline-block"
          style={{
            animation: "ticker35 35s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            color: "#fff",
          }}
        >
          {renderRow1}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{renderRow1}
        </span>
      </div>

      {/* Row 2 — Platform Counters */}
      <div className="overflow-hidden flex items-center" style={{ height: 26, background: "#0C2340" }}>
        <span
          className="whitespace-nowrap text-[12px] font-medium tracking-[0.02em] px-6 select-none inline-block"
          style={{
            animation: "ticker45 45s linear infinite",
            animationPlayState: paused ? "paused" : "running",
            color: "#fff",
          }}
        >
          {renderRow2}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{renderRow2}
        </span>
      </div>

      <style>{`
        @keyframes ticker35 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ticker45 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}