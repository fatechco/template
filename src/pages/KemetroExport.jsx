import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const HOW_STEPS = [
  { icon: "🔧", title: "Enable Export", desc: "Activate the export module from your seller dashboard in one click. No extra registration required." },
  { icon: "📦", title: "List for Export", desc: "Mark your products as available for international shipping and set export-specific pricing if needed." },
  { icon: "🌍", title: "Receive Global Orders", desc: "International buyers discover your products and place orders. Kemetro handles currency conversion and payment processing." },
];

const COUNTRIES = [
  { flag: "🇸🇦", name: "Saudi Arabia" }, { flag: "🇦🇪", name: "UAE" }, { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇰🇼", name: "Kuwait" }, { flag: "🇧🇭", name: "Bahrain" }, { flag: "🇯🇴", name: "Jordan" },
  { flag: "🇱🇧", name: "Lebanon" }, { flag: "🇮🇶", name: "Iraq" }, { flag: "🇸🇩", name: "Sudan" },
  { flag: "🇱🇾", name: "Libya" }, { flag: "🇹🇳", name: "Tunisia" }, { flag: "🇲🇦", name: "Morocco" },
  { flag: "🇩🇿", name: "Algeria" }, { flag: "🇳🇬", name: "Nigeria" }, { flag: "🇬🇭", name: "Ghana" },
  { flag: "🇰🇪", name: "Kenya" }, { flag: "🇿🇦", name: "South Africa" }, { flag: "🇪🇹", name: "Ethiopia" },
  { flag: "🇹🇿", name: "Tanzania" }, { flag: "🇺🇬", name: "Uganda" }, { flag: "🇩🇪", name: "Germany" },
  { flag: "🇫🇷", name: "France" }, { flag: "🇬🇧", name: "UK" }, { flag: "🇮🇹", name: "Italy" },
  { flag: "🇹🇷", name: "Turkey" }, { flag: "🇮🇳", name: "India" }, { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇧🇩", name: "Bangladesh" }, { flag: "🇨🇳", name: "China" }, { flag: "🇺🇸", name: "USA" },
];

const FEES = [
  { label: "Export Fee", value: "5.5%", desc: "On sale price excluding shipping" },
  { label: "Payment Processing", value: "1%", desc: "Standard transaction fee" },
  { label: "Total", value: "~7%", desc: "Combined for cross-border orders" },
];

export default function KemetroExport() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0077B6 0%, #1a3a5c 100%)" }} className="py-20 px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Export Your Products to 30+ Countries</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">Tap into international markets and reach millions of buyers across the globe through Kemetro's built-in export module.</p>
        <Link to="/kemetro/seller/dashboard" className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">Enable Export for My Store</Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">How Export Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map((s, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mx-auto">{s.icon}</div>
                <div className="w-7 h-7 bg-[#0077B6] text-white rounded-full flex items-center justify-center font-black text-sm mx-auto">{i + 1}</div>
                <h3 className="font-black text-gray-900">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRIES */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Countries We Operate In</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {COUNTRIES.map((c) => (
              <div key={c.name} className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:shadow-sm transition-shadow">
                <div className="text-2xl mb-1">{c.flag}</div>
                <p className="text-xs font-semibold text-gray-700">{c.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Export Fee Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEES.map((f) => (
              <div key={f.label} className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-3xl font-black text-[#0077B6]">{f.value}</p>
                <p className="font-black text-gray-900 mt-1">{f.label}</p>
                <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #FF6B00 0%, #e55f00 100%)" }}>
        <div className="max-w-[600px] mx-auto text-center space-y-4">
          <h2 className="text-3xl font-black text-white">Ready to Go Global?</h2>
          <p className="text-orange-100">Enable the export module and start reaching international buyers today.</p>
          <Link to="/kemetro/seller/dashboard" className="inline-block bg-white hover:bg-gray-50 text-orange-600 font-black px-8 py-3 rounded-xl transition-colors">Enable Export for My Store →</Link>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}