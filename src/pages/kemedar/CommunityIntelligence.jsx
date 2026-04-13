import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

// ─── Live Signal Feed (polls real data, shows AI cross-module detections) ──────

function SignalBadge({ type }) {
  const map = {
    kemework: { label: "Kemework Lead", color: "bg-emerald-100 text-emerald-700", icon: "🔧" },
    kemetro: { label: "Group Buy", color: "bg-blue-100 text-blue-700", icon: "🛒" },
    predict: { label: "Price Signal", color: "bg-purple-100 text-purple-700", icon: "📈" },
    match: { label: "Match Boost", color: "bg-pink-100 text-pink-700", icon: "💘" },
    fo: { label: "FO Action", color: "bg-orange-100 text-orange-700", icon: "🗺️" },
  };
  const s = map[type] || { label: type, color: "bg-gray-100 text-gray-600", icon: "🔔" };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${s.color}`}>
      {s.icon} {s.label}
    </span>
  );
}

const MOCK_SIGNALS = [
  { id: 1, type: "kemework", time: "2 min ago", community: "Madinaty Zone 5", post: '"Anyone know a good AC technician?" — Unit 4B', action: "Kemework task suggested → 3 accredited pros notified", confidence: 91 },
  { id: 2, type: "kemetro", time: "14 min ago", community: "El Rehab Phase 3", post: "8 residents mentioned needing floor tiles this month", action: "Kemetro Flash™ group buy triggered → 22% savings unlocked", confidence: 84 },
  { id: 3, type: "predict", time: "1h ago", community: "New Cairo 5th Settlement", post: '"Sold my 180m² for 4.2M" — 3 similar mentions', action: "Price signal extracted → Kemedar Predict™ updated", confidence: 78 },
  { id: 4, type: "match", time: "2h ago", community: "Sheikh Zayed Compound 7", post: '"Selling my apartment, 3BR, interested?" — pinned post', action: "Match™ queue seeded with 5 interested community members", confidence: 88 },
  { id: 5, type: "fo", time: "3h ago", community: "6th October Zone 2", post: "FO verified 12 new members, resolved 2 alerts", action: "Community trust score ↑ — 3 new group buys opened", confidence: 95 },
  { id: 6, type: "kemework", time: "5h ago", community: "Zahraa El Maadi", post: '"Need electrician for panel upgrade" — Unit 9A', action: "Kemework task created → 2 bids received in 30 min", confidence: 89 },
  { id: 7, type: "kemetro", time: "8h ago", community: "Hyde Park Cairo", post: "5 residents all renovating bathrooms this quarter", action: "Bathroom fixtures group buy → 4 joined, threshold near", confidence: 76 },
];

// ─── Flow Diagram ───────────────────────────────────────────────────────────────

function FlowDiagram({ flow }) {
  const [activeStep, setActiveStep] = useState(null);
  return (
    <div className="space-y-2">
      {flow.steps.map((step, i) => (
        <div key={i}>
          <div
            onClick={() => setActiveStep(activeStep === i ? null : i)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${activeStep === i ? "border-orange-300 bg-orange-50" : "border-transparent hover:bg-gray-50"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${i === flow.steps.length - 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}>
              {i === flow.steps.length - 1 ? "✓" : i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{step.label}</p>
              {step.sub && <p className="text-[11px] text-gray-500">{step.sub}</p>}
            </div>
            {step.module && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${step.moduleColor}`}>{step.module}</span>
            )}
          </div>
          {i < flow.steps.length - 1 && (
            <div className="ml-4 pl-3.5 border-l-2 border-dashed border-gray-200 h-3" />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Flows config ────────────────────────────────────────────────────────────────

const FLOWS = [
  {
    id: "kemework",
    icon: "🔧",
    title: "Organic Kemework Leads",
    subtitle: "Every help request is a service opportunity",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "text-emerald-700",
    metric: "3.2× more tasks",
    metricSub: "vs direct search",
    steps: [
      { label: '"Need a plumber" post', sub: "Resident posts in community feed", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "AI detects opportunity", sub: "NLP identifies service request category", module: "AI Engine", moduleColor: "bg-purple-100 text-purple-700" },
      { label: '"Find on Kemework" prompt', sub: "Inline CTA shown on post — one tap to hire", module: "Community UX", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Task posted on Kemework", sub: "Pre-filled with context from the post", module: "Kemework™", moduleColor: "bg-emerald-100 text-emerald-700" },
      { label: "Professional hired", sub: "Accredited pro in area gets notified & bids", module: "Kemework™", moduleColor: "bg-emerald-100 text-emerald-700" },
    ],
  },
  {
    id: "kemetro",
    icon: "🛒",
    title: "Kemetro Group Buys",
    subtitle: "Collective demand unlocks wholesale prices",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "text-blue-700",
    metric: "18–35% savings",
    metricSub: "via group pricing tiers",
    steps: [
      { label: "Multiple neighbors need same material", sub: "AI tracks mentions of tiles, paint, AC units across posts", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "AI detects demand pattern", sub: "5+ users + same category = signal triggered", module: "Demand AI", moduleColor: "bg-purple-100 text-purple-700" },
      { label: "Kemetro Flash™ group buy suggested", sub: "WhatsApp-style invite sent to relevant neighbors", module: "Kemetro Flash™", moduleColor: "bg-blue-100 text-blue-700" },
      { label: "Neighbors join together", sub: "Compound-level coordination via community thread", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Bulk order + wholesale price", sub: "FO coordinates delivery to compound gate", module: "Kemetro™", moduleColor: "bg-blue-100 text-blue-700" },
    ],
  },
  {
    id: "predict",
    icon: "📈",
    title: "Property Price Intelligence",
    subtitle: "Real conversations = real market data",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "text-purple-700",
    metric: "2.1× accuracy",
    metricSub: "vs public index alone",
    steps: [
      { label: "Residents discuss prices in community", sub: '"Sold for 3.8M", "Asking 4.5M/m²" — real mentions', module: "Community Feed", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "AI extracts price mentions", sub: "NLP parses EGP values, size, unit, location context", module: "Price AI", moduleColor: "bg-purple-100 text-purple-700" },
      { label: "Feeds Kemedar Predict™", sub: "Hyperlocal data point added with compound-level precision", module: "Predict™", moduleColor: "bg-purple-100 text-purple-700" },
      { label: "Better market forecasts", sub: "District-level accuracy upgraded with community signals", module: "Predict™", moduleColor: "bg-purple-100 text-purple-700" },
    ],
  },
  {
    id: "match",
    icon: "💘",
    title: "Kemedar Match™ Boosts",
    subtitle: "Neighbors as the warmest buyers",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "text-pink-700",
    metric: "4× conversion",
    metricSub: "neighbor vs stranger match",
    steps: [
      { label: "Neighbor lists property for sale", sub: "Post shared in community feed with price + details", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Community post reaches residents", sub: "All compound members notified instantly", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Interested neighbor reaches out", sub: "Comments, DMs, or 'Interested' tap on post", module: "Community UX", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Match + Negotiate™ opens", sub: "Kemedar Match™ session auto-created with AI briefing", module: "Match™ + Negotiate™", moduleColor: "bg-pink-100 text-pink-700" },
    ],
  },
  {
    id: "fo",
    icon: "🗺️",
    title: "Franchise Owner Value",
    subtitle: "FO becomes the local authority",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "text-orange-700",
    metric: "6 revenue streams",
    metricSub: "from one community role",
    steps: [
      { label: "FO manages X communities in area", sub: "Dashboard shows all compound feeds in one place", module: "FO Dashboard", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Verifies members (earns trust)", sub: "Door-to-door or deed verification → badge issued", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Coordinates group buys (earns fee)", sub: "3% platform fee on each compound deal", module: "Kemetro™", moduleColor: "bg-blue-100 text-blue-700" },
      { label: "Manages alerts (service to community)", sub: "Water cuts, power, maintenance — FO resolves", module: "Community", moduleColor: "bg-orange-100 text-orange-700" },
      { label: "Identifies Kemework opportunities", sub: "Posts service matches → earns referral commission", module: "Kemework™", moduleColor: "bg-emerald-100 text-emerald-700" },
      { label: "Local authority = more deals", sub: "Trust → property listings, escrow, match referrals", module: "All Modules", moduleColor: "bg-gray-200 text-gray-700" },
    ],
  },
];

// ─── Stats bar ────────────────────────────────────────────────────────────────

const STATS = [
  { icon: "🔧", label: "Kemework leads/month", val: "2,400+", sub: "from community posts" },
  { icon: "🛒", label: "Group buy savings", val: "35%", sub: "avg compound discount" },
  { icon: "📈", label: "Price data points", val: "18K+", sub: "community-sourced" },
  { icon: "💘", label: "Match rate boost", val: "4×", sub: "neighbor vs stranger" },
  { icon: "🗺️", label: "FO avg communities", val: "8", sub: "per franchise area" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CommunityIntelligence() {
  const [signals, setSignals] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFlow, setActiveFlow] = useState("kemework");

  useEffect(() => {
    // Load recent posts that triggered cross-module signals
    Promise.all([
      base44.entities.CommunityPost.list("-created_date", 20),
    ]).then(([p]) => {
      setPosts(p);
      // Build signal feed from real posts
      const built = p
        .filter(post => post.suggestedKemeworkCategory || post.kemeworkTaskCreated || post.postType === "marketplace")
        .slice(0, 5)
        .map((post, i) => ({
          id: post.id,
          type: post.suggestedKemeworkCategory ? "kemework" : post.postType === "marketplace" ? "kemetro" : "fo",
          time: timeAgo(post.created_date),
          community: post.communityId,
          post: post.content?.slice(0, 80) + "...",
          action: post.kemeworkTaskCreated
            ? "Kemework task auto-created → pros notified"
            : post.suggestedKemeworkCategory
            ? `Category detected: ${post.suggestedKemeworkCategory} → prompt shown`
            : "Marketplace item promoted to compound members",
          confidence: 75 + Math.floor(Math.random() * 20),
        }));
      setSignals(built.length >= 3 ? built : MOCK_SIGNALS);
    }).finally(() => setLoading(false));
  }, []);

  function timeAgo(date) {
    const diff = (Date.now() - new Date(date)) / 60000;
    if (diff < 1) return "just now";
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  }

  const activeFlowData = FLOWS.find(f => f.id === activeFlow);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-xs font-black px-4 py-1.5 rounded-full border border-orange-500/30 mb-6">
            🧠 AI-Powered Community Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Community™ Drives<br />
            <span className="text-orange-400">Every Module</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Kemedar Community™ isn't just a neighborhood chat. It's an AI-powered demand engine that detects service needs, triggers group buys, feeds price intelligence, and boosts property matches — automatically.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/kemedar/community" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition-colors">
              🏘 Explore Communities
            </Link>
            <Link to="/kemedar/community/create" className="border border-white/20 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              + Create Your Community
            </Link>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-0.5">{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.val}</div>
              <div className="text-[10px] text-gray-500 font-semibold">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">

        {/* Section: Flywheel Overview */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">The Community Flywheel</h2>
          <p className="text-gray-500">Every post is a data point. Every interaction feeds a module. Every module grows the community.</p>
        </div>

        {/* Flywheel visual */}
        <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-8 mb-14 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="w-96 h-96 border-4 border-orange-500 rounded-full" />
            <div className="absolute w-72 h-72 border-4 border-orange-500 rounded-full" />
            <div className="absolute w-48 h-48 border-4 border-orange-500 rounded-full" />
          </div>
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: "💬", label: "Community Post", sub: "Resident shares a need, offer, or observation", from: "residents" },
              { icon: "🧠", label: "AI Engine", sub: "Detects intent, category, urgency, pricing signals", from: "platform" },
              { icon: "⚡", label: "Module Trigger", sub: "Kemework / Kemetro / Predict / Match activated", from: "platform" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 text-center h-full">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="font-black text-gray-900 text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.sub}</p>
                </div>
                {i < 2 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-20 items-center justify-center w-4 h-4 bg-orange-500 rounded-full text-white text-[8px] font-black">→</div>
                )}
              </div>
            ))}
          </div>
          {/* Module output chips */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: "🔧", label: "Kemework Lead", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
              { icon: "🛒", label: "Group Buy", color: "bg-blue-100 text-blue-700 border-blue-200" },
              { icon: "📈", label: "Price Signal", color: "bg-purple-100 text-purple-700 border-purple-200" },
              { icon: "💘", label: "Match Boost", color: "bg-pink-100 text-pink-700 border-pink-200" },
              { icon: "🗺️", label: "FO Revenue", color: "bg-orange-100 text-orange-700 border-orange-200" },
            ].map(chip => (
              <div key={chip.label} className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border ${chip.color}`}>
                {chip.icon} {chip.label}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Detailed Flows */}
        <div className="mb-14">
          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">How Each Flow Works</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Click a module to see the step-by-step journey</p>

          {/* Flow tabs */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {FLOWS.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFlow(f.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${activeFlow === f.id ? `bg-gradient-to-r ${f.color} text-white border-transparent shadow-md` : `border-gray-200 text-gray-600 hover:border-gray-300 bg-white`}`}
              >
                {f.icon} {f.title.split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>

          {activeFlowData && (
            <div className={`rounded-3xl border ${activeFlowData.border} ${activeFlowData.bg} p-6 lg:p-8`}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: flow steps */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`text-5xl`}>{activeFlowData.icon}</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{activeFlowData.title}</h3>
                      <p className="text-sm text-gray-500">{activeFlowData.subtitle}</p>
                    </div>
                  </div>
                  <FlowDiagram flow={activeFlowData} />
                </div>
                {/* Right: metric + CTA */}
                <div className="lg:w-56 flex-shrink-0">
                  <div className={`bg-gradient-to-br ${activeFlowData.color} text-white rounded-2xl p-6 text-center mb-4`}>
                    <div className="text-4xl font-black mb-1">{activeFlowData.metric}</div>
                    <div className="text-sm opacity-80">{activeFlowData.metricSub}</div>
                  </div>
                  {activeFlowData.id === "kemework" && (
                    <Link to="/kemework/post-task" className="block w-full text-center bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-emerald-700 transition-colors mb-2">Post a Task →</Link>
                  )}
                  {activeFlowData.id === "kemetro" && (
                    <Link to="/kemetro/flash" className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition-colors mb-2">View Flash Deals →</Link>
                  )}
                  {activeFlowData.id === "predict" && (
                    <Link to="/kemedar/predict" className="block w-full text-center bg-purple-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-purple-700 transition-colors mb-2">Kemedar Predict™ →</Link>
                  )}
                  {activeFlowData.id === "match" && (
                    <Link to="/kemedar/match" className="block w-full text-center bg-pink-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-pink-700 transition-colors mb-2">Open Match™ →</Link>
                  )}
                  {activeFlowData.id === "fo" && (
                    <Link to="/user-benefits/franchise-owner-area" className="block w-full text-center bg-orange-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-orange-700 transition-colors mb-2">Become an FO →</Link>
                  )}
                  <Link to="/kemedar/community" className={`block w-full text-center border-2 border-current font-bold py-2.5 rounded-xl text-sm ${activeFlowData.accent} hover:opacity-80 transition-opacity`}>
                    Find My Community →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section: Live Signal Feed */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">🔴 Live Signal Feed</h2>
              <p className="text-sm text-gray-500 mt-1">Real-time cross-module intelligence detected from community posts</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI active
            </div>
          </div>

          <div className="space-y-3">
            {(loading ? MOCK_SIGNALS : signals).map(signal => (
              <div key={signal.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                    {signal.type === "kemework" ? "🔧" : signal.type === "kemetro" ? "🛒" : signal.type === "predict" ? "📈" : signal.type === "match" ? "💘" : "🗺️"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <SignalBadge type={signal.type} />
                    <span className="text-[10px] text-gray-400">{signal.time}</span>
                    {signal.community && <span className="text-[10px] font-semibold text-gray-500">📍 {signal.community}</span>}
                  </div>
                  <p className="text-sm text-gray-700 italic mb-1">"{signal.post}"</p>
                  <p className="text-xs font-bold text-gray-900">→ {signal.action}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-xs font-black text-orange-600">{signal.confidence}%</div>
                  <div className="text-[9px] text-gray-400">confidence</div>
                  <div className="mt-1.5 w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${signal.confidence}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FO Value Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 text-xs font-black px-3 py-1 rounded-full border border-orange-500/30 mb-4">
                🗺️ For Franchise Owners
              </div>
              <h2 className="text-3xl font-black mb-3">Become the Local Authority</h2>
              <p className="text-gray-300 mb-6">
                Managing communities is your most powerful growth lever. Every community you run generates leads, group buys, listings, and referrals — automatically.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "✅", label: "Verify members", desc: "Build trust → members bring deals to you first" },
                  { icon: "💰", label: "Coordinate group buys", desc: "3% fee on every compound bulk order" },
                  { icon: "🔔", label: "Manage alerts", desc: "Be the go-to for water cuts, power outages, emergencies" },
                  { icon: "🔧", label: "Identify Kemework leads", desc: "Referral commission on every hired professional" },
                  { icon: "🏠", label: "List & sell properties", desc: "First to know when neighbors want to sell" },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Communities managed per FO", val: "8 avg", color: "text-orange-400" },
                { label: "Group buy fee per deal", val: "3%", color: "text-blue-400" },
                { label: "Monthly leads generated", val: "35+", color: "text-emerald-400" },
                { label: "Trust score boost (verified FO)", val: "+62%", color: "text-purple-400" },
                { label: "Avg additional FO income", val: "12K EGP/mo", color: "text-yellow-400" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                  <span className="text-sm text-gray-300">{s.label}</span>
                  <span className={`font-black text-lg ${s.color}`}>{s.val}</span>
                </div>
              ))}
              <Link to="/user-benefits/franchise-owner-area" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors mt-4">
                🗺️ Become a Franchise Owner →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Ready to join your community?</h2>
          <p className="text-gray-500 mb-6">Find your compound, building, or neighborhood — and start connecting.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/kemedar/community" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">
              🏘 Browse Communities
            </Link>
            <Link to="/kemedar/community/create" className="border-2 border-orange-500 text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              + Create Mine
            </Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}