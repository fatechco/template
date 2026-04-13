import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LEVELS = [
  { level: 1, icon: "📋", title: "Self Declaration", desc: "Seller declares property details and confirms ownership. Free, instant." },
  { level: 2, icon: "📄", title: "Document Upload", desc: "Title deed, ownership proof, and identity documents uploaded and verified." },
  { level: 3, icon: "📍", title: "GPS & Location Pin", desc: "Property coordinates confirmed via GPS. Location matches land registry." },
  { level: 4, icon: "🏠", title: "FO On-Site Visit", desc: "Verified Franchise Owner visits the property, inspects, and records a walkthrough video." },
  { level: 5, icon: "🔗", title: "Blockchain Certificate", desc: "Immutable certificate issued. Scannable QR code placed on the property." },
];

const BENEFITS = [
  { icon: "📈", title: "Higher Ranking", desc: "Verified properties rank higher in search results and get the Verify Pro badge." },
  { icon: "💰", title: "Faster Sales", desc: "Buyers trust verified listings — average sale time is 40% faster." },
  { icon: "🏦", title: "Bank Ready", desc: "Export your certificate for mortgage applications and loan requests." },
  { icon: "🌍", title: "Expat Ready", desc: "International buyers can invest remotely with confidence in verified listings." },
];

const WHY_BRILLIANT = [
  "Creates a trust layer that no other Egyptian platform has — buyer confidence explodes.",
  "Blockchain certificate is tamper-proof and permanent — the ultimate property credential.",
  "FO on-site visit adds a human layer that AI alone cannot replicate.",
  "Once certified, sellers rarely leave the platform — stickiness at its best.",
];

export default function VerifyProLandingMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white px-5 pt-14 pb-10 relative">
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <span className="inline-block bg-blue-100/20 border border-blue-400/30 text-blue-300 text-xs font-black px-3 py-1.5 rounded-full mb-4">
            🛡️ Trust · Phase 1 — Live
          </span>
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-3xl font-black mb-3 leading-tight text-blue-200">Kemedar Verify Pro™</h1>
          <p className="text-sm text-gray-300 mb-2 leading-relaxed">
            5-Level Property Verification. From self-declaration to blockchain certificate — the strongest trust signal in Egyptian real estate.
          </p>
          <p className="text-xs text-gray-400 italic mb-6">
            Verified properties sell faster, rank higher, and attract international buyers.
          </p>
          <Link to="/m/kemedar/verify-pro/my-properties"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-black px-8 py-3.5 rounded-2xl text-base">
            🛡️ Verify My Property
          </Link>
          <p className="mt-4 text-xs text-gray-500">Level 1 is free · Upgrade at your own pace</p>
        </div>
      </div>

      {/* 5 Levels */}
      <div className="px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-2">5 Levels of Trust</h2>
        <p className="text-center text-gray-500 text-sm mb-5">Each level unlocks new benefits and higher visibility</p>
        <div className="space-y-3">
          {LEVELS.map((l) => (
            <div key={l.level} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center flex-shrink-0 text-sm">
                {l.level}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{l.icon}</span>
                  <h3 className="font-black text-gray-900 text-sm">{l.title}</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 px-4 py-8">
        <h2 className="text-xl font-black text-gray-900 text-center mb-5">Why Get Verified?</h2>
        <div className="space-y-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl flex-shrink-0">{b.icon}</div>
              <div>
                <p className="font-black text-gray-900 text-sm mb-1">{b.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blockchain Certificate Preview */}
      <div className="px-4 py-8">
        <div className="bg-gradient-to-br from-[#0d1b3e] to-slate-800 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-xl">🔗</div>
            <div>
              <p className="font-black text-sm">Blockchain Certificate</p>
              <p className="text-blue-300 text-xs">Level 5 — Permanent & Tamper-Proof</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-200 text-[10px]">Certificate ID</span>
              <span className="font-mono text-xs text-white">KVP-A1B2-C3D4-E5F6</span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-blue-200 text-[10px]">Status</span>
              <span className="text-green-400 font-bold text-xs">✅ VERIFIED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200 text-[10px]">Chain</span>
              <span className="text-xs text-white">NEAR Protocol</span>
            </div>
          </div>
          <h2 className="text-sm font-black mb-3">💡 Why This Changes Everything</h2>
          <ul className="space-y-2">
            {WHY_BRILLIANT.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Public verify lookup */}
      <div className="bg-gray-50 px-4 py-8 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">Verify a Certificate</h2>
        <p className="text-gray-500 text-sm mb-5">Scan a property QR code or enter a certificate ID to verify authenticity</p>
        <Link to="/m/kemedar/verify-pro/scan"
          className="inline-block bg-blue-500 text-white font-black px-8 py-3.5 rounded-2xl text-sm mr-3">
          📷 Scan QR Code
        </Link>
        <Link to="/m/kemedar/verify-pro/my-properties"
          className="inline-block border-2 border-gray-200 text-gray-700 font-black px-6 py-3.5 rounded-2xl text-sm">
          🛡️ My Properties
        </Link>
      </div>

      <MobileBottomNav />
    </div>
  );
}