import { useState, useEffect } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { base44 } from "@/api/base44Client";

const DEFAULT_PACKAGES = [
  {
    id: "starter", name: "Due Diligence Package", nameAr: "حزمة العناية الواجبة",
    badge: null, badgeColor: "",
    services: ["Title deed verification", "Ownership history check", "Encumbrance/mortgage check", "No-objection certificate", "Written legal report"],
    priceEGP: 8500, estimatedDays: 7, remote: true,
    desc: "Essential checks before making any offer. Know exactly what you're buying."
  },
  {
    id: "complete", name: "Complete Remote Buyer Package", nameAr: "حزمة المشتري عن بعد الكاملة",
    badge: "RECOMMENDED", badgeColor: "bg-orange-500",
    services: ["Title deed verification", "Ownership history check", "Encumbrance/mortgage check", "Digital Power of Attorney (notarized + apostilled)", "Sale contract review by lawyer", "Negotiation legal guidance", "Registration coordination", "Tax clearance certificate", "Keys handover coordination", "Full documentation archive"],
    priceEGP: 25000, estimatedDays: 42, remote: true,
    desc: "Everything you need to buy remotely from start to finish. Most popular with expats."
  },
  {
    id: "management", name: "Property Registration Package", nameAr: "حزمة تسجيل الملكية",
    badge: "ADD-ON", badgeColor: "bg-blue-500",
    services: ["Utility registration transfer", "Building management registration", "Lease agreement template", "Tenant contract (if renting)", "Annual legal compliance"],
    priceEGP: 6000, estimatedDays: 14, remote: true,
    desc: "Post-purchase setup. Get everything registered and ready to rent."
  },
];

const POA_COUNTRIES = [
  { flag: "🇦🇪", name: "UAE", available: true },
  { flag: "🇬🇧", name: "UK", available: true },
  { flag: "🇺🇸", name: "USA", available: true },
  { flag: "🇸🇦", name: "KSA", available: false },
  { flag: "🇨🇦", name: "Canada", available: true },
  { flag: "🇩🇪", name: "Germany", available: false },
];

export default function ExpatLegal() {
  const [packages, setPackages] = useState(DEFAULT_PACKAGES);
  const [poaExpanded, setPoaExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="max-w-5xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>Kemedar Expat™</span><span>/</span><span>Legal Services</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">⚖️ Legal Services for Expat Buyers</h1>
          <p className="text-gray-500 mt-1">Complete legal support — fully remote, no travel needed</p>
        </div>

        {/* Packages */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {packages.map(pkg => (
            <div key={pkg.id} className={`bg-white rounded-2xl border-2 ${pkg.badge === "RECOMMENDED" ? "border-orange-400" : "border-gray-100"} shadow-sm overflow-hidden flex flex-col`}>
              {pkg.badge && (
                <div className={`${pkg.badgeColor} text-white text-center text-xs font-black py-1.5 tracking-widest`}>{pkg.badge}</div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-gray-900 text-lg mb-1">{pkg.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{pkg.desc}</p>

                <div className="space-y-2 flex-1 mb-5">
                  {pkg.services.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{s}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-2xl font-black text-gray-900">{new Intl.NumberFormat("en").format(pkg.priceEGP)} EGP</p>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">✅ Remote</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{pkg.estimatedDays < 30 ? `${pkg.estimatedDays} business days` : `${Math.round(pkg.estimatedDays / 7)} weeks`}</p>
                  <button className={`w-full font-black py-3 rounded-xl text-sm transition-colors ${pkg.badge === "RECOMMENDED" ? "bg-orange-500 hover:bg-orange-400 text-white" : "border-2 border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    Order This Package
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* POA Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <button onClick={() => setPoaExpanded(!poaExpanded)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50">
            <div>
              <h2 className="font-black text-gray-900 text-lg">What is Power of Attorney (توكيل رسمي)?</h2>
              <p className="text-sm text-gray-500">Learn how to sign remotely without visiting Egypt</p>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${poaExpanded ? "rotate-180" : ""}`} />
          </button>

          {poaExpanded && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed mt-4 mb-6">
                In Egyptian property transactions, a Power of Attorney (توكيل رسمي) authorizes a trusted person (your FO or lawyer) to sign documents and complete the transaction on your behalf. It is 100% legal, common, and specifically designed for expat property buyers.
              </p>

              <div className="space-y-4 mb-6">
                {[
                  { step: 1, title: "Sign POA at Egyptian Embassy", desc: "Visit your local Egyptian Embassy (1 visit, ~1 hour) OR use online notarization where available." },
                  { step: 2, title: "Apostille & Authentication", desc: "POA is apostilled and authenticated for use in Egypt." },
                  { step: 3, title: "FO/Lawyer Receives POA", desc: "Your representative uses the POA to complete your purchase." },
                  { step: 4, title: "Original Documents by Courier", desc: "All original documents sent to you after completion." },
                ].map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-bold text-gray-700 text-sm mb-2">Online notarization available in:</p>
                <div className="flex flex-wrap gap-2">
                  {POA_COUNTRIES.map(c => (
                    <span key={c.name} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold border ${c.available ? "border-green-300 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-400"}`}>
                      {c.flag} {c.name} {c.available ? "✅" : "Embassy only"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}