import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const API_CAPABILITIES = [
  { icon: "📈", title: "Valuation API", desc: "AI-estimated market value in under 2 seconds. Returns price, confidence score, and comparables." },
  { icon: "🔮", title: "Forecast API", desc: "Predict property price trajectories over 6–36 months using infrastructure and macro signals." },
  { icon: "📊", title: "Market Signals API", desc: "Full intelligence report per district — supply/demand, trends, and investment grade." },
  { icon: "🏘️", title: "Match API", desc: "Feed a buyer profile and get AI-ranked property matches with compatibility scores." },
  { icon: "🗺️", title: "Life Score API", desc: "7-dimension lifestyle score for any GPS coordinates — walkability, safety, schools, and more." },
  { icon: "🤝", title: "Negotiate API", desc: "AI negotiation strategy — opening offer, counteroffer range, and walk-away price." },
  { icon: "👁️", title: "Vision API", desc: "Submit property photos. Get quality scores, finishing grade, and virtual staging suggestions." },
  { icon: "📄", title: "Document Verify API", desc: "AI authenticity score for title deeds, IDs, and utility bills in under 5 seconds." },
];

const USE_CASES = [
  { icon: "🏦", title: "Banks & Mortgage", desc: "Automate property valuations for mortgage approvals in seconds." },
  { icon: "🏗️", title: "Developers", desc: "Analyze land plots, price launches, and forecast absorption rates." },
  { icon: "💼", title: "Investment Funds", desc: "Build automated deal screening with AI investment grades." },
  { icon: "📱", title: "PropTech Startups", desc: "Plug ThinkDar™ into your app and get 20 AI models instantly." },
];

const TRAINING = [
  "10M+ property listings across MENA",
  "5 years of historical price movements",
  "Infrastructure and development signals",
  "Rental yield and ROI data per district",
  "Construction cost indices (via Kemetro)",
  "Professional labor rates (via Kemework)",
];

const INITIAL_FORM = {
  companyName: "", contactName: "", workEmail: "", phone: "",
  companyType: "", useCase: ""
};

export default function ThinkDarMobile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ThinkDarAPIRequest.create(form);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="relative overflow-hidden px-5 pt-14 pb-10 text-white"
        style={{ background: "linear-gradient(135deg, #0F0E1A 0%, #1E1B4B 60%, #0F0E1A 100%)" }}>
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="text-center mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black border mb-4"
            style={{ background: "rgba(99,102,241,0.2)", borderColor: "#6366F1", color: "#A5B4FC" }}>
            🧠 Enterprise AI · Available Now
          </div>
          <div className="text-5xl mb-3">🧠</div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "#A5B4FC" }}>ThinkDar™</h1>
          <p className="text-gray-300 text-sm mb-1 leading-relaxed">
            The First AI Model Built Exclusively for Real Estate
          </p>
          <p className="text-xs italic mb-6" style={{ color: "#6366F1" }}>
            Trained on 10M+ MENA properties · 50+ cities · 5 years of data
          </p>
          <button onClick={() => setShowForm(true)}
            className="inline-block font-black px-8 py-3.5 rounded-2xl text-base text-white mb-3"
            style={{ background: "#6366F1" }}>
            🚀 Request API Access
          </button>
          <p className="text-xs text-gray-500">Powered by Anthropic Claude · NEAR Protocol</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">

        {/* What Is ThinkDar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">What Is ThinkDar™?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            ThinkDar™ is Kemedar's proprietary AI engine trained on millions of Egyptian and MENA real estate data points — now available via API for real estate companies, banks, and PropTech startups.
          </p>
          <div className="space-y-2">
            {TRAINING.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span style={{ color: "#F59E0B" }} className="flex-shrink-0">✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* API Capabilities */}
        <div>
          <h2 className="font-black text-gray-900 text-base mb-3">API Capabilities</h2>
          <div className="grid grid-cols-1 gap-3">
            {API_CAPABILITIES.map((cap, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{cap.icon}</span>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{cap.title}</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{cap.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="rounded-2xl p-5" style={{ background: "#1E1B4B" }}>
          <h2 className="font-black text-white text-base mb-3">Who Uses ThinkDar™?</h2>
          <div className="grid grid-cols-2 gap-3">
            {USE_CASES.map((uc, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xl mb-1">{uc.icon}</p>
                <p className="font-black text-white text-xs mb-1">{uc.title}</p>
                <p className="text-gray-400 text-[10px] leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Sample */}
        <div className="rounded-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center gap-1.5 px-4 py-2" style={{ background: "#1E1B4B" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-gray-400 text-[10px] ml-2 font-mono">thinkdar-api.js</span>
          </div>
          <pre className="p-4 text-[10px] overflow-x-auto leading-relaxed" style={{ background: "#0F0E1A", color: "#9CA3AF", fontFamily: "monospace" }}>
{`// Valuation API Request
const res = await fetch(
  'https://api.thinkdar.ai/v1/valuation',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_KEY'
    },
    body: JSON.stringify({
      area_sqm: 185,
      city: 'new_cairo',
      finishing: 'high_luxe'
    })
  }
);
// → { estimated_value_egp: 4250000,
//     confidence_score: 87,
//     investment_grade: "strong_buy" }`}
          </pre>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2">
          {["Claude AI", "NEAR Protocol", "10M+ Properties", "99.9% SLA"].map((b, i) => (
            <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full border"
              style={{ borderColor: "#6366F1", color: "#6366F1", background: "#6366F110" }}>
              {b}
            </span>
          ))}
        </div>

        {/* CTA */}
        <button onClick={() => setShowForm(true)}
          className="w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "#6366F1" }}>
          🚀 Request API Access
        </button>
      </div>

      {/* Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-gray-900 text-base">Request API Access</p>
              <button onClick={() => { setShowForm(false); setSubmitted(false); }}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">✕</button>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-black text-gray-900 text-lg mb-2">Request Submitted!</p>
                <p className="text-gray-500 text-sm">Our AI team will review and respond within 48 hours.</p>
                <button onClick={() => { setShowForm(false); setSubmitted(false); }}
                  className="mt-5 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                  style={{ background: "#6366F1" }}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  ["companyName", "Company Name"],
                  ["contactName", "Your Name"],
                  ["workEmail", "Work Email"],
                  ["phone", "Phone"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{label} *</label>
                    <input required value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company Type *</label>
                  <select required value={form.companyType}
                    onChange={e => setForm(p => ({ ...p, companyType: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white">
                    <option value="">Select type...</option>
                    {[["agency","Real Estate Agency"],["developer","Developer"],["bank","Bank"],["mortgage","Mortgage Company"],["investment_fund","Investment Fund"],["proptech","PropTech Startup"],["government","Government"],["other","Other"]].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Use Case</label>
                  <textarea rows={3} value={form.useCase}
                    onChange={e => setForm(p => ({ ...p, useCase: e.target.value }))}
                    placeholder="How do you plan to use ThinkDar™?"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: "#6366F1" }}>
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "🚀 Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}