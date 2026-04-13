import { Link } from "react-router-dom";

const SCORE_SOURCES = [
  { icon: "🪪", label: "Identity Verification", detail: "National ID, phone, email, address" },
  { icon: "🤝", label: "Transaction Events", detail: "Deals closed, escrow completions" },
  { icon: "📸", label: "Listing Quality (Vision™)", detail: "AI photo scoring, completeness" },
  { icon: "⚡", label: "Response Time Tracking", detail: "Sub-1hr responses, no-shows" },
  { icon: "🏘", label: "Community Activity", detail: "Reviews, recommendations, alerts" },
  { icon: "🔒", label: "Escrow Outcomes", detail: "KYC tier, deal completions" },
  { icon: "⚖️", label: "Dispute Resolutions", detail: "Won/lost, initiated vs received" },
  { icon: "⭐", label: "Review Ratings", detail: "5-star aggregated per service" },
  { icon: "📄", label: "Document Verification", detail: "Deeds, bank statements, pre-approval" },
  { icon: "📊", label: "Platform Behavior", detail: "Logins, viewings, offer follow-through" },
];

const ROLES = [
  {
    role: "Buyer / Agent / Developer",
    icon: "🏠",
    color: "bg-blue-50 border-blue-200",
    accent: "bg-blue-500",
    dims: [
      { name: "Financial Readiness", max: 300, icon: "💰" },
      { name: "Platform Behavior", max: 250, icon: "🤝" },
      { name: "Verification Level", max: 250, icon: "✅" },
      { name: "Community Standing", max: 200, icon: "🏘" },
    ]
  },
  {
    role: "Seller",
    icon: "🏡",
    color: "bg-orange-50 border-orange-200",
    accent: "bg-orange-500",
    dims: [
      { name: "Listing Quality", max: 300, icon: "📸" },
      { name: "Transaction History", max: 300, icon: "🤝" },
      { name: "Response Behavior", max: 200, icon: "⚡" },
      { name: "Seller Verification", max: 200, icon: "🏡" },
    ]
  },
  {
    role: "Professional",
    icon: "👷",
    color: "bg-teal-50 border-teal-200",
    accent: "bg-teal-500",
    dims: [
      { name: "Job Completion", max: 350, icon: "🔨" },
      { name: "Client Ratings", max: 300, icon: "⭐" },
      { name: "Pro Verification", max: 200, icon: "✅" },
      { name: "Pro Behavior", max: 150, icon: "🎯" },
    ]
  },
];

const GRADES = [
  { name: "Platinum", icon: "💎", range: "850–1000", color: "bg-yellow-900 text-yellow-100", pct: "Top 5%" },
  { name: "Gold",     icon: "🥇", range: "700–849",  color: "bg-yellow-500 text-white",       pct: "Top 20%" },
  { name: "Silver",   icon: "🥈", range: "550–699",  color: "bg-gray-400 text-white",          pct: "Top 40%" },
  { name: "Bronze",   icon: "🥉", range: "400–549",  color: "bg-orange-700 text-white",        pct: "Top 65%" },
  { name: "Starter",  icon: "⭐", range: "200–399",  color: "bg-gray-500 text-white",          pct: "Top 85%" },
  { name: "Restricted", icon: "⚠️", range: "0–199", color: "bg-red-600 text-white",           pct: "Needs action" },
];

const BADGES = [
  { icon: "✅", name: "Verified Identity",    category: "Verification" },
  { icon: "🏠", name: "Property Owner",       category: "Verification" },
  { icon: "🔒", name: "KYC Complete",         category: "Verification" },
  { icon: "📱", name: "Contact Verified",     category: "Verification" },
  { icon: "🤝", name: "First Deal",           category: "Transaction" },
  { icon: "🎯", name: "Deal Maker (5x)",      category: "Transaction" },
  { icon: "🏆", name: "Power Trader (20x)",   category: "Transaction" },
  { icon: "⚡", name: "Speed Dealer",         category: "Transaction" },
  { icon: "💎", name: "Zero Disputes",        category: "Transaction" },
  { icon: "⚡", name: "Lightning Responder",  category: "Community" },
  { icon: "📅", name: "Always Shows Up",      category: "Community" },
  { icon: "🏘", name: "Community Leader",     category: "Community" },
  { icon: "📸", name: "Photo Pro",            category: "Quality" },
  { icon: "🎓", name: "Kemedar Accredited",   category: "Quality" },
  { icon: "🗓️", name: "1 Year Member",        category: "Loyalty" },
  { icon: "🌟", name: "Founding Member",      category: "Special" },
  { icon: "🌍", name: "Expat Investor",       category: "Special" },
  { icon: "🏗️", name: "Finish Champion",      category: "Special" },
];

const PRIVILEGES = [
  { grade: "Platinum", icon: "💎", items: ["Search priority boost", "Reduced fees (1%)", "Priority FO assignment", "Direct admin support", "Early feature access", "Platinum badge on profile"] },
  { grade: "Gold",     icon: "🥇", items: ["Enhanced search visibility", "Priority support queue", "Trusted buyer/seller status", "Gold badge on profile"] },
  { grade: "Silver",   icon: "🥈", items: ["Verified Member badge", "Full escrow access", "All standard features"] },
  { grade: "Bronze",   icon: "🥉", items: ["Basic platform features", "Initiate negotiations", "Escrow with verification"] },
];

const INTEGRATIONS = [
  { module: "Property Listings", icon: "🏠", signal: "Seller score → listing rank boost" },
  { module: "Negotiate™", icon: "🤝", signal: "Score shown as trust signal" },
  { module: "Match™", icon: "💘", signal: "Filter: min score for buyer match" },
  { module: "Escrow™", icon: "🔒", signal: "High score → fast-track verification" },
  { module: "Kemework", icon: "🔧", signal: "Pro score → top ranking in search" },
  { module: "Kemetro", icon: "🛒", signal: "Seller score → store visibility tier" },
  { module: "Advisor™", icon: "🤖", signal: "Financial Readiness dim → budget assessment" },
  { module: "Flash Deals™", icon: "⚡", signal: "Min 400 score required to participate" },
];

const RECALC = [
  { trigger: "⚡ After every event", detail: "Score recalculated instantly via addScoreEvent function", badge: "Instant" },
  { trigger: "🌙 Daily decay run", detail: "Old negative events (6mo+) halved, expired after 12mo", badge: "Nightly" },
  { trigger: "📅 Weekly full recalc", detail: "All user scores rebuilt from event log ground-up", badge: "Sunday 2am" },
  { trigger: "📆 Annual expiry check", detail: "Documents flagged as expired, score docked if not renewed", badge: "Yearly" },
];

const BADGE_CATEGORY_COLORS = {
  Verification: "bg-green-100 text-green-700",
  Transaction: "bg-blue-100 text-blue-700",
  Community: "bg-purple-100 text-purple-700",
  Quality: "bg-orange-100 text-orange-700",
  Loyalty: "bg-gray-100 text-gray-700",
  Special: "bg-yellow-100 text-yellow-700",
};

function Arrow() {
  return (
    <div className="flex flex-col items-center py-2">
      <div className="w-0.5 h-8 bg-gray-300" />
      <div className="text-gray-400 text-xl -mt-1">▼</div>
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-black text-gray-900">{children}</h2>
      {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ScoreArchitecture() {
  return (
    <div className="max-w-5xl mx-auto space-y-2 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">System Architecture</p>
        <h1 className="text-3xl font-black mb-2">🎯 Kemedar Score™ Engine</h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          A full-stack reputation and credit-scoring layer across the Kemedar ecosystem — 0–1000 per user, recalculated in real-time after every event.
        </p>
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          {["10 Input Sources", "3 Role Engines", "6 Grades", "21 Badges", "8 Platform Integrations", "4 Recalc Cycles"].map(s => (
            <span key={s} className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>

      {/* ── LAYER 1: INPUTS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Raw data sources feeding the scoring engine">① SCORE SOURCES (Inputs)</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SCORE_SOURCES.map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-xs font-bold text-gray-900 leading-tight">{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <Arrow />

      {/* ── LAYER 2: ENGINE ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Different dimensions are weighted per user role — max 1000 pts each">② SCORING ENGINE (Per Role)</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ROLES.map(r => (
            <div key={r.role} className={`border rounded-2xl p-4 ${r.color}`}>
              <p className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                <span>{r.icon}</span>{r.role}
              </p>
              <div className="space-y-2">
                {r.dims.map(d => (
                  <div key={d.name} className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-700">{d.icon} {d.name}</span>
                    <span className="text-xs font-black text-gray-900">/{d.max}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <span className={`text-xs font-black text-white px-3 py-1 rounded-full ${r.accent}`}>= /1000 total</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700 font-semibold">
          💡 Overall Score = <code className="bg-orange-100 px-1 rounded">max(buyerScore, sellerScore, professionalScore)</code> — capped at 1000. Negative events decay after 6 months, fully expire after 12 months.
        </div>
      </div>

      <Arrow />

      {/* ── LAYER 3: GRADES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Grade assigned after each recalculation">③ GRADE ASSIGNED</SectionTitle>
        <div className="flex flex-wrap gap-3">
          {GRADES.map(g => (
            <div key={g.name} className="flex-1 min-w-[140px] text-center">
              <div className={`rounded-2xl p-4 ${g.color}`}>
                <p className="text-3xl mb-1">{g.icon}</p>
                <p className="font-black text-base">{g.name}</p>
                <p className="text-xs opacity-80 mt-0.5">{g.range} pts</p>
                <p className="text-[10px] opacity-60 mt-0.5">{g.pct}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Arrow />

      {/* ── LAYER 4: BADGES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Auto-awarded after every score event — 21 badges across 6 categories">④ BADGES AWARDED</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {BADGES.map(b => (
            <div key={b.name} className="flex flex-col items-center gap-1 bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
              <span className="text-2xl">{b.icon}</span>
              <p className="text-[11px] font-bold text-gray-800 leading-tight">{b.name}</p>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${BADGE_CATEGORY_COLORS[b.category]}`}>{b.category}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">Badges are auto-checked after every ScoreEvent. Manual awards available to admin.</p>
      </div>

      <Arrow />

      {/* ── LAYER 5: PRIVILEGES ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Each grade unlocks progressively better platform access">⑤ PRIVILEGES UNLOCKED</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRIVILEGES.map(p => (
            <div key={p.grade} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2">
                <span>{p.icon}</span>
                <span className="font-black text-sm">{p.grade}</span>
              </div>
              <div className="p-3 space-y-1">
                {p.items.map(item => (
                  <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                    <span className="text-green-500">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Arrow />

      {/* ── LAYER 6: INTEGRATIONS ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Score feeds into platform modules as a trust signal and gating mechanism">⑥ PLATFORM INTEGRATIONS</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTEGRATIONS.map(i => (
            <div key={i.module} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <span className="text-2xl flex-shrink-0">{i.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900">{i.module}</p>
                <p className="text-xs text-gray-500 truncate">{i.signal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Arrow />

      {/* ── LAYER 7: RECALCULATION ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionTitle sub="Score stays fresh via multiple recalculation cycles">⑦ CONTINUOUS RECALCULATION</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {RECALC.map(r => (
            <div key={r.trigger} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-black text-gray-900 text-sm">{r.trigger}</p>
                <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">{r.badge}</span>
              </div>
              <p className="text-xs text-gray-500">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Functions reference */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white">
        <p className="font-black text-sm mb-4">🔧 Backend Functions</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { fn: "calculateKemedarScore", desc: "Full engine — recalculates all dimensions from events" },
            { fn: "addScoreEvent", desc: "Log event + trigger instant recalc" },
            { fn: "getMyKemedarScore", desc: "User-facing: score + events + badges + next grade" },
            { fn: "getSharedScore", desc: "Public certificate lookup via share token" },
          ].map(f => (
            <div key={f.fn} className="bg-white/10 rounded-xl px-4 py-3">
              <p className="font-mono text-xs text-orange-400 font-bold">{f.fn}</p>
              <p className="text-xs text-gray-400 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <Link to="/admin/kemedar/score" className="text-xs bg-orange-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-orange-400">
            → Admin Score Dashboard
          </Link>
          <Link to="/dashboard/score" className="text-xs border border-white/20 text-white font-bold px-4 py-2 rounded-xl hover:bg-white/10">
            → User Score Page
          </Link>
        </div>
      </div>
    </div>
  );
}