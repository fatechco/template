import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SuperFooter from "@/components/layout/SuperFooter";
import { base44 } from "@/api/base44Client";

// ─── DATA ───────────────────────────────────────────────────────────────────

const API_CAPABILITIES = [
  {
    icon: "📈", color: "#6366F1", apiName: "Valuation API",
    endpoint: "POST /api/thinkdar/valuation",
    title: "Instant Property Valuation",
    desc: "Get an AI-estimated market value for any Egyptian property in under 2 seconds. Returns estimated price, confidence score, comparable sales, and price per sqm.",
    useCases: "Banks · Mortgage companies · Developers · Insurance firms",
    badge: "Most Popular"
  },
  {
    icon: "🔮", color: "#F59E0B", apiName: "Forecast API",
    endpoint: "POST /api/thinkdar/forecast",
    title: "Price Forecast Engine",
    desc: "Predict property price trajectories for any district over 6, 12, 24 and 36 months. Powered by infrastructure signals, development pipeline, and macroeconomic indicators.",
    useCases: "Investment firms · Fund managers · Developer land acquisition teams"
  },
  {
    icon: "📊", color: "#06B6D4", apiName: "Market Signals API",
    endpoint: "GET /api/thinkdar/signals/:areaId",
    title: "Area Intelligence Report",
    desc: "Get a complete market intelligence report for any city or district. Includes supply/demand ratio, average days on market, price trends, and investment grade rating.",
    useCases: "Real estate consultants · Corporate relocation firms"
  },
  {
    icon: "🏘️", color: "#6366F1", apiName: "Match API",
    endpoint: "POST /api/thinkdar/match",
    title: "AI Property Matching",
    desc: "Feed us a buyer profile — budget, location preference, lifestyle needs — and ThinkDar™ returns the top matching properties ranked by AI compatibility score.",
    useCases: "CRM platforms · Portals · WhatsApp bots · Mobile apps"
  },
  {
    icon: "🗺️", color: "#F59E0B", apiName: "Life Score API",
    endpoint: "GET /api/thinkdar/lifescore/:lat/:lng",
    title: "Neighborhood Scoring",
    desc: "7-dimension lifestyle score for any GPS coordinates. Walkability, safety, noise, schools, greenery, connectivity, and convenience — all in one call.",
    useCases: "Property portals · Relocation apps · Urban planning firms"
  },
  {
    icon: "🤝", color: "#06B6D4", apiName: "Negotiate API",
    endpoint: "POST /api/thinkdar/negotiate",
    title: "Negotiation Intelligence",
    desc: "Analyze a property and return an AI-generated negotiation strategy. Recommended opening offer, expected counteroffer range, and walk-away price — all data-driven.",
    useCases: "Buyer's agents · Investment advisors · Corporate acquisition teams"
  },
  {
    icon: "👁️", color: "#6366F1", apiName: "Vision API",
    endpoint: "POST /api/thinkdar/vision/analyze",
    title: "Property Photo Analysis",
    desc: "Submit property photos. Get back quality scores, finishing grade detection, room labeling, issue flags, and virtual staging suggestions — automatically.",
    useCases: "Listing portals · Property photography services · QA automation"
  },
  {
    icon: "🛋️", color: "#F59E0B", apiName: "Furniture Detection API",
    endpoint: "POST /api/thinkdar/vision/detect",
    title: "Interior Item Detection",
    desc: "Identify furniture, fixtures, and decor items in any property photo. Returns item labels, coordinates, and e-commerce search keywords for each detected item.",
    useCases: "Interior design platforms · Furniture e-commerce · Home staging apps"
  },
  {
    icon: "📄", color: "#06B6D4", apiName: "Document Verify API",
    endpoint: "POST /api/thinkdar/verify/document",
    title: "Property Document Analysis",
    desc: "Submit a title deed, utility bill, or national ID photo. Get an AI authenticity score, detected issues, and fraud probability — in under 5 seconds.",
    useCases: "Banks · Notaries · PropTech platforms · Legal firms"
  },
  {
    icon: "🤖", color: "#6366F1", apiName: "Advisor API",
    endpoint: "POST /api/thinkdar/advisor/profile",
    title: "Buyer Advisory Engine",
    desc: "Submit a buyer's preferences, budget, and lifestyle requirements. Receive a complete property advisory report with top matches, area analysis, and market timing.",
    useCases: "Real estate CRMs · Financial advisors · Bank mortgage portals"
  },
  {
    icon: "⭐", color: "#F59E0B", apiName: "Score API",
    endpoint: "GET /api/thinkdar/score/:userId",
    title: "Real Estate Trust Score",
    desc: "Query a Kemedar user's real estate trust score — financial readiness, transaction history, verification status, and engagement score. Permission-based with user consent.",
    useCases: "Mortgage lenders · Developer sales teams · Escrow services"
  },
  {
    icon: "🌍", color: "#06B6D4", apiName: "Expat Intel API",
    endpoint: "POST /api/thinkdar/expat/compare",
    title: "Cross-Market Comparison",
    desc: "Compare real estate investment across Egypt, UAE, KSA, and Qatar. Returns price/sqm, rental yield, capital growth, legal ease, and currency risk — live data.",
    useCases: "Gulf investment advisors · Wealth management firms · Expat platforms"
  },
];

const USE_CASES = [
  { icon: "🏦", title: "Banks & Mortgage Companies", desc: "Automate property valuations for mortgage approval. Reduce manual appraisal time from days to seconds. Feed ThinkDar™ a property and get a certified AI valuation instantly." },
  { icon: "🏗️", title: "Real Estate Developers", desc: "Analyze which land plots are pre-gentrification. Price new launches optimally against market data. Forecast unit absorption rates before breaking ground." },
  { icon: "💼", title: "Investment Funds & Family Offices", desc: "Build automated deal screening pipelines. Get AI investment grades on every property in your target market. Cross-compare yields across Egyptian governorates." },
  { icon: "🏢", title: "Real Estate Agencies", desc: "Power your CRM with AI buyer matching. Auto-suggest properties to clients based on their profile. Generate professional AI market reports in seconds." },
  { icon: "📱", title: "PropTech Startups", desc: "Don't build your own AI from scratch. Plug ThinkDar™ into your app and get 20 AI models instantly. Focus on your product. We handle the intelligence." },
  { icon: "🏛️", title: "Government & Urban Planning", desc: "Access anonymized aggregate data on area development, price trends, and housing demand signals to inform urban policy and zoning decisions." },
];

const PRICING = [
  {
    name: "Starter", price: "Free", sub: "For testing and prototyping",
    features: ["100 API calls/month", "Valuation API only", "Sandbox environment only", "Email support"],
    cta: "Start Free", style: "outlined"
  },
  {
    name: "Growth", price: "$299", period: "/month", sub: "For growing PropTech companies",
    features: ["10,000 API calls/month", "All 12 API endpoints", "Production environment", "99.9% SLA", "Priority email support"],
    cta: "Get Started", style: "filled", badge: "Most Popular"
  },
  {
    name: "Business", price: "$999", period: "/month", sub: "For established platforms",
    features: ["100,000 API calls/month", "All endpoints + webhooks", "Dedicated account manager", "Custom model fine-tuning", "Phone + email support", "White-label option"],
    cta: "Contact Sales", style: "outlined"
  },
  {
    name: "Enterprise", price: "Custom", sub: "For banks, funds, and large developers",
    features: ["Unlimited API calls", "On-premise deployment option", "Custom training on your data", "Full data licensing agreement", "SLA with financial penalties", "Dedicated AI engineer"],
    cta: "Request Enterprise Demo", style: "dark"
  },
];

const STEPS = [
  { num: "01", color: "#6366F1", icon: "🔑", title: "Request API Access", body: "Fill out our enterprise form. Our team reviews your use case within 48 hours and issues your API key with appropriate tier." },
  { num: "02", color: "#F59E0B", icon: "📖", title: "Read the Documentation", body: "Full API docs with code examples in Python, JavaScript, PHP, and cURL. Postman collection included. Sandbox environment for testing." },
  { num: "03", color: "#06B6D4", icon: "🔧", title: "Integrate in Days", body: "REST API with JSON responses. Most integrations are live within 2–5 business days. Dedicated technical support included." },
  { num: "04", color: "#6366F1", icon: "🚀", title: "Scale with Confidence", body: "Usage-based pricing. No long-term contracts. Rate limits scale with your plan. SLA guarantees on response time and uptime." },
];

const TRAINING_DATA = [
  "10+ million property listings across MENA",
  "5 years of historical price movements",
  "Infrastructure and development signals",
  "Rental yield and ROI data per district",
  "Buyer behavior and search patterns",
  "Legal and regulatory database",
  "Construction cost indices (via Kemetro)",
  "Professional labor rates (via Kemework)",
  "Franchise Owner ground intelligence",
  "Seasonal and economic market patterns",
];

const APIs_LIST = [
  "Valuation API", "Forecast API", "Market Signals API",
  "Match API", "Life Score API", "Vision API",
  "Document Verify API", "Advisor API", "Negotiate API", "All APIs (Enterprise)"
];

const CODE_SAMPLE = `// ThinkDar™ Valuation API — Sample Request

const response = await fetch(
  'https://api.thinkdar.ai/v1/valuation',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      property_type: 'apartment',
      area_sqm: 185,
      bedrooms: 3,
      floor: 7,
      city: 'new_cairo',
      district: 'fifth_settlement',
      finishing: 'high_luxe',
      year_built: 2022
    })
  }
);

// Response
{
  "estimated_value_egp": 4250000,
  "confidence_score": 87,
  "price_per_sqm": 22972,
  "value_range": {
    "low": 3900000,
    "mid": 4250000,
    "high": 4600000
  },
  "comparable_sales": 12,
  "investment_grade": "strong_buy",
  "powered_by": "ThinkDar™ v2.1"
}`;

// ─── FORM ────────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  companyName: "", contactName: "", workEmail: "", phone: "",
  companyType: "", country: "", apisRequested: [], expectedMonthlyCalls: "", useCase: ""
};

function APIRequestForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleApi = (api) => {
    setForm(prev => ({
      ...prev,
      apisRequested: prev.apisRequested.includes(api)
        ? prev.apisRequested.filter(a => a !== api)
        : [...prev.apisRequested, api]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ThinkDarAPIRequest.create(form);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-black text-white mb-2">Request Submitted!</h3>
        <p className="text-gray-300 mb-6">Our AI team will review your use case and get back to you within 48 hours.</p>
        <button onClick={() => { setForm(INITIAL_FORM); setSubmitted(false); }}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {[["companyName", "Company Name", "text"], ["contactName", "Your Name", "text"],
          ["workEmail", "Work Email", "email"], ["phone", "Phone", "tel"]].map(([key, label, type]) => (
          <div key={key}>
            <label className="block text-xs font-bold text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
            <input required type={type} value={form[key]}
              onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Company Type <span className="text-red-500">*</span></label>
          <select required value={form.companyType} onChange={e => setForm(p => ({ ...p, companyType: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
            <option value="">Select type...</option>
            {[["agency", "Real Estate Agency"], ["developer", "Developer"], ["bank", "Bank"],
              ["mortgage", "Mortgage Company"], ["investment_fund", "Investment Fund"],
              ["proptech", "PropTech Startup"], ["government", "Government"], ["other", "Other"]
            ].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Country</label>
          <input type="text" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
            placeholder="e.g. Egypt, UAE, KSA..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 mb-2">APIs Interested In</label>
        <div className="grid grid-cols-2 gap-2">
          {APIs_LIST.map(api => (
            <label key={api} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={form.apisRequested.includes(api)}
                onChange={() => toggleApi(api)}
                className="w-4 h-4 rounded accent-indigo-600" />
              <span className="text-xs text-gray-700 group-hover:text-indigo-600 transition-colors">{api}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 mb-1">Expected Monthly API Calls</label>
        <select value={form.expectedMonthlyCalls} onChange={e => setForm(p => ({ ...p, expectedMonthlyCalls: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
          <option value="">Select volume...</option>
          {[["under_1k", "Under 1,000"], ["1k_10k", "1K–10K"], ["10k_100k", "10K–100K"], ["100k_plus", "100K+"]].map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-700 mb-1">Describe Your Use Case</label>
        <textarea rows={4} value={form.useCase} onChange={e => setForm(p => ({ ...p, useCase: e.target.value }))}
          placeholder="Tell us how you plan to use ThinkDar™ in your product or business..."
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-xl text-white font-black text-sm transition-all flex items-center justify-center gap-2"
        style={{ background: "#6366F1" }}
        onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"}
        onMouseLeave={e => e.currentTarget.style.background = "#6366F1"}>
        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "🚀 Submit API Access Request"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">
        Your information is confidential. Kemedar will never share your data with third parties.
      </p>
    </form>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function ThinkDar() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-4 left-4 z-50">
        <button onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </button>
      </div>

      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden py-24 sm:py-32" style={{ background: "linear-gradient(135deg, #0F0E1A 0%, #1E1B4B 60%, #0F0E1A 100%)" }}>
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "#6366F1" }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#F59E0B" }} />

        <div className="relative max-w-[900px] mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-8 border"
            style={{ background: "rgba(99,102,241,0.2)", borderColor: "#6366F1", color: "#6366F1" }}>
            🧠 Now Available for Enterprises
          </div>

          {/* Main heading */}
          <h1 className="font-black leading-tight mb-6">
            <span className="text-white" style={{ fontSize: "clamp(48px,8vw,80px)", display: "block" }}>ThinkDar™</span>
            <span className="text-gray-300" style={{ fontSize: "clamp(24px,4vw,40px)", display: "block" }}>The First AI Model Built</span>
            <span style={{ fontSize: "clamp(24px,4vw,40px)", display: "block", color: "#6366F1" }}>Exclusively for Real Estate</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            ThinkDar™ is Kemedar's proprietary AI engine trained on millions of Egyptian and MENA real estate data points. Now available via API for real estate companies, developers, banks, and investment firms.
          </p>

          {/* Powered by row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-400">
            <span>Powered by: <span className="text-white font-bold">Kemedar®</span></span>
            <span className="text-gray-600">·</span>
            <span>Trained on: <span className="font-bold" style={{ color: "#F59E0B" }}>Anthropic Claude</span></span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-300">10M+ properties · 50+ cities · 5+ years of market data</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#request-access"
              className="px-8 py-4 rounded-xl font-black text-white text-sm transition-all"
              style={{ background: "#6366F1" }}
              onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"}
              onMouseLeave={e => e.currentTarget.style.background = "#6366F1"}>
              🚀 Request API Access
            </a>
            <a href="#api-docs"
              className="px-8 py-4 rounded-xl font-black text-white text-sm border border-white/20 hover:bg-white/10 transition-all">
              📄 View API Documentation
            </a>
            <Link to="/contact"
              className="px-8 py-4 rounded-xl font-black text-sm hover:bg-white/5 transition-all"
              style={{ color: "#9CA3AF" }}>
              💬 Talk to Our AI Team
            </Link>
          </div>
        </div>

        {/* Ticker strip */}
        <div className="mt-16 overflow-hidden border-t border-b border-white/10 py-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex gap-12 whitespace-nowrap animate-[ticker_20s_linear_infinite] text-gray-400 text-sm font-medium px-4">
            {["🧠 20 AI Models", "📊 Real-Time Market Data", "🏠 Property Valuation API", "📈 Price Forecast API", "👁️ Computer Vision API", "🤝 Matching Engine API", "🧠 20 AI Models", "📊 Real-Time Market Data", "🏠 Property Valuation API", "📈 Price Forecast API", "👁️ Computer Vision API", "🤝 Matching Engine API"].map((t, i) => (
              <span key={i} className="flex-shrink-0">{t} ·</span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — WHAT IS THINKDAR */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">The Intelligence Layer Behind Kemedar</h2>
            <p className="text-gray-500 max-w-lg mx-auto">ThinkDar™ is not a chatbot. It is a purpose-built real estate AI engine.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left — training data card */}
            <div className="rounded-2xl p-8" style={{ background: "#0F0E1A" }}>
              <div className="text-5xl mb-4 text-center">🧠🏢</div>
              <p className="font-black text-white mb-4 text-lg">ThinkDar™ is trained on:</p>
              <ul className="space-y-2.5">
                {TRAINING_DATA.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#9CA3AF" }}>
                    <span style={{ color: "#F59E0B" }} className="flex-shrink-0 mt-0.5">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — feature cards */}
            <div className="flex flex-col gap-4">
              {[
                { border: "#6366F1", icon: "🧠", title: "Built for Real Estate Only", desc: "Unlike general AI models, ThinkDar™ was trained exclusively on real estate data. It understands Egyptian market dynamics, compound pricing, seasonal patterns, and Arabic real estate terminology natively." },
                { border: "#F59E0B", icon: "📊", title: "Live Market Intelligence", desc: "ThinkDar™ does not use static training data. It continuously updates from Kemedar's live platform — new listings, price changes, area trends — giving you real-time accuracy." },
                { border: "#06B6D4", icon: "🔗", title: "API-First Architecture", desc: "Every ThinkDar™ capability is available via a clean REST API. Integrate property valuations, forecasts, and matching into your own systems in days, not months." },
              ].map((c, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm" style={{ borderLeft: `4px solid ${c.border}` }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="font-black text-gray-900 text-sm mb-1">{c.title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — API CAPABILITIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">What ThinkDar™ Can Do For Your Business</h2>
            <p className="text-gray-500">20 AI capabilities. One API key.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {API_CAPABILITIES.map((cap, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative">
                {cap.badge && (
                  <span className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: "#6366F1" }}>
                    {cap.badge}
                  </span>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl" style={{ background: `${cap.color}20` }}>
                    {cap.icon}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{cap.title}</p>
                    <code className="text-[10px] font-mono" style={{ color: cap.color }}>{cap.endpoint}</code>
                  </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{cap.desc}</p>
                <p className="text-xs font-semibold" style={{ color: cap.color }}>{cap.useCases}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section className="py-20" style={{ background: "#1E1B4B" }}>
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-3xl font-black text-white text-center mb-16">Simple Integration. Powerful Results.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-black mb-3" style={{ color: step.color }}>{step.num}</p>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-black text-white text-base mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — PRICING */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">ThinkDar™ API Pricing</h2>
            <p className="text-gray-500">Pay for what you use. Scale when you need.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map((tier, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border-2 ${tier.badge ? "border-indigo-500" : "border-gray-100"} ${tier.style === "dark" ? "bg-gray-900 text-white" : "bg-white"}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full text-[10px] font-black text-white whitespace-nowrap" style={{ background: "#6366F1" }}>
                    {tier.badge}
                  </span>
                )}
                <h3 className={`font-black text-base mb-1 ${tier.style === "dark" ? "text-white" : "text-gray-900"}`}>{tier.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-black" style={{ color: "#6366F1" }}>{tier.price}</span>
                  {tier.period && <span className={`text-sm mb-1 ${tier.style === "dark" ? "text-gray-400" : "text-gray-400"}`}>{tier.period}</span>}
                </div>
                <p className={`text-xs mb-4 ${tier.style === "dark" ? "text-gray-400" : "text-gray-500"}`}>{tier.sub}</p>
                <ul className="space-y-2 mb-5">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-1.5 text-xs ${tier.style === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                      <span style={{ color: "#F59E0B" }} className="flex-shrink-0">✦</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#request-access"
                  className={`block text-center py-2.5 rounded-xl font-bold text-sm transition-all ${
                    tier.style === "filled" ? "text-white" : tier.style === "dark" ? "border border-gray-600 text-gray-300 hover:bg-white/10" : "border border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
                  }`}
                  style={tier.style === "filled" ? { background: "#6366F1" } : {}}>
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — USE CASES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Who Uses ThinkDar™ API?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {USE_CASES.map((uc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl block mb-3">{uc.icon}</span>
                <h3 className="font-black text-gray-900 text-sm mb-2">{uc.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CODE PREVIEW */}
      <section id="api-docs" className="py-20 bg-white">
        <div className="max-w-[900px] mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-3">Clean API. Clear Documentation.</h2>
          <p className="text-gray-500 text-center mb-10">Start calling ThinkDar™ in minutes, not months.</p>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#1E1B4B" }}>
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-gray-400 text-xs ml-2 font-mono">thinkdar-api-example.js</span>
            </div>
            <pre className="p-6 text-sm overflow-x-auto" style={{ background: "#0F0E1A", color: "#9CA3AF", fontFamily: "monospace", lineHeight: 1.8 }}>
              {CODE_SAMPLE.split('\n').map((line, i) => {
                const isComment = line.trim().startsWith('//');
                const isKey = line.includes('"') && line.includes(':');
                return (
                  <span key={i} style={{ display: "block", color: isComment ? "#6366F1" : isKey ? "#9CA3AF" : "#E5E7EB" }}>
                    {line}
                  </span>
                );
              })}
            </pre>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="#request-access" className="px-6 py-3 rounded-xl font-black text-white text-sm transition-all" style={{ background: "#6366F1" }}
              onMouseEnter={e => e.currentTarget.style.background = "#4F46E5"}
              onMouseLeave={e => e.currentTarget.style.background = "#6366F1"}>
              View Full Documentation →
            </a>
            <button className="px-6 py-3 rounded-xl font-black text-gray-700 text-sm border-2 border-gray-200 hover:border-indigo-400 hover:text-indigo-600 transition-all">
              Download Postman Collection →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 — TRUST SIGNALS */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-[1000px] mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-6 font-medium">ThinkDar™ is built on:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: "Claude AI by Anthropic", color: "#F59E0B" },
              { label: "NEAR Protocol", color: "#06B6D4" },
              { label: "Kemedar® · 10M+ Properties", color: "#6366F1" },
              { label: "ISO 27001 Data Security", color: "#10B981" },
              { label: "99.9% Uptime SLA", color: "#8B5CF6" },
            ].map((badge, i) => (
              <div key={i} className="px-4 py-2 rounded-xl border text-xs font-bold" style={{ borderColor: badge.color, color: badge.color, background: `${badge.color}10` }}>
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — REQUEST FORM */}
      <section id="request-access" className="py-20" style={{ background: "#1E1B4B" }}>
        <div className="max-w-[700px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-3">Request ThinkDar™ API Access</h2>
            <p className="text-gray-400">Tell us about your use case. We'll get back within 48 hours.</p>
          </div>
          <APIRequestForm />
        </div>
      </section>

      <SuperFooter />

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}