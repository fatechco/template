import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, ChevronDown } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const PACKAGES = [
  {
    id: "starter", name: "Due Diligence Package", badge: null,
    services: ["Title deed verification", "Ownership history check", "Encumbrance/mortgage check", "No-objection certificate", "Written legal report"],
    priceEGP: 8500, days: 7,
    desc: "Essential checks before making any offer."
  },
  {
    id: "complete", name: "Complete Remote Buyer", badge: "RECOMMENDED",
    services: ["Title deed verification", "Ownership history check", "Digital Power of Attorney", "Sale contract review", "Negotiation legal guidance", "Registration coordination", "Tax clearance certificate", "Keys handover coordination", "Full documentation archive"],
    priceEGP: 25000, days: 42,
    desc: "Everything you need to buy remotely. Most popular with expats."
  },
  {
    id: "registration", name: "Property Registration Pack", badge: "ADD-ON",
    services: ["Utility registration transfer", "Building management setup", "Lease agreement template", "Annual legal compliance"],
    priceEGP: 6000, days: 14,
    desc: "Post-purchase setup. Get ready to rent."
  },
];

const POA_STEPS = [
  { step: 1, title: "Sign POA at Egyptian Embassy", desc: "Visit your local Egyptian Embassy (1 visit, ~1 hour) or use online notarization." },
  { step: 2, title: "Apostille & Authentication", desc: "POA is apostilled and authenticated for use in Egypt." },
  { step: 3, title: "FO/Lawyer Receives POA", desc: "Your representative uses the POA to complete your purchase." },
  { step: 4, title: "Documents by Courier", desc: "All originals sent to you after completion." },
];

export default function ExpatLegalMobile() {
  const navigate = useNavigate();
  const [poaExpanded, setPoaExpanded] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const fmt = n => new Intl.NumberFormat("en").format(n);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div>
          <p className="font-black text-gray-900 text-sm">⚖️ Legal Services</p>
          <p className="text-xs text-gray-400">Kemedar Expat™ · Remote legal support</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        <p className="text-gray-500 text-sm">Complete legal support — fully remote, no travel needed.</p>

        {/* Packages */}
        {PACKAGES.map(pkg => (
          <div key={pkg.id} className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${pkg.badge === "RECOMMENDED" ? "border-orange-400" : "border-gray-100"}`}>
            {pkg.badge && (
              <div className={`text-white text-center text-xs font-black py-1.5 tracking-widest ${pkg.badge === "RECOMMENDED" ? "bg-orange-500" : "bg-blue-500"}`}>
                {pkg.badge}
              </div>
            )}
            <div className="p-4">
              <h3 className="font-black text-gray-900 text-base mb-1">{pkg.name}</h3>
              <p className="text-xs text-gray-500 mb-3">{pkg.desc}</p>
              <div className="space-y-1.5 mb-4">
                {pkg.services.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{s}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="font-black text-gray-900 text-lg">{fmt(pkg.priceEGP)} EGP</p>
                  <p className="text-xs text-gray-400">{pkg.days < 30 ? `${pkg.days} business days` : `${Math.round(pkg.days / 7)} weeks`} · ✅ Remote</p>
                </div>
                <button
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`font-black py-2.5 px-4 rounded-xl text-sm transition-colors ${pkg.badge === "RECOMMENDED" ? "bg-orange-500 text-white" : "border-2 border-gray-200 text-gray-700"}`}>
                  Order
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* POA Explainer */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => setPoaExpanded(!poaExpanded)} className="w-full flex items-center justify-between p-4">
            <div className="text-left">
              <p className="font-black text-gray-900 text-sm">What is Power of Attorney (توكيل رسمي)?</p>
              <p className="text-xs text-gray-400">Sign remotely without visiting Egypt</p>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${poaExpanded ? "rotate-180" : ""}`} />
          </button>
          {poaExpanded && (
            <div className="px-4 pb-5 border-t border-gray-100">
              <p className="text-xs text-gray-600 leading-relaxed my-4">
                A Power of Attorney (توكيل رسمي) authorizes a trusted person — your FO or lawyer — to sign documents on your behalf. It is 100% legal, common, and specifically designed for expat property buyers.
              </p>
              <div className="space-y-3">
                {POA_STEPS.map(s => (
                  <div key={s.step} className="flex gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{s.title}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-slate-800 rounded-2xl p-5 text-white text-center">
          <p className="font-black mb-1">Need legal guidance?</p>
          <p className="text-blue-200 text-xs mb-4">Our legal team is available for free 15-min consultations</p>
          <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer"
            className="inline-block bg-green-500 text-white font-black px-6 py-2.5 rounded-xl text-sm">
            💬 WhatsApp Legal Team
          </a>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}