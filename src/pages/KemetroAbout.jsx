import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const STATS = [
  { value: "12,000+", label: "Active Sellers" },
  { value: "500K+", label: "Products Listed" },
  { value: "30+", label: "Countries" },
  { value: "2.5M+", label: "Buyers & Prospects" },
];

const ECOSYSTEM = [
  { name: "Kemedar", desc: "Real Estate Portal", color: "bg-blue-50 border-blue-200 text-blue-700", href: "/" },
  { name: "Kemetro", desc: "Products Marketplace", color: "bg-orange-50 border-orange-200 text-orange-700", href: "/kemetro" },
  { name: "XeedWallet", desc: "Digital Payments", color: "bg-green-50 border-green-200 text-green-700", href: "#" },
  { name: "Kemecoin", desc: "Loyalty Rewards", color: "bg-yellow-50 border-yellow-200 text-yellow-700", href: "/kemetro/kemecoin" },
];

export default function KemetroAbout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0077B6 0%, #005f8e 100%)" }} className="py-20 px-4 text-center">
        <h1 className="text-5xl font-black text-white mb-4">About Kemetro®</h1>
        <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
          The world's largest dedicated multi-seller marketplace for home building and finishing products.
        </p>
      </section>

      {/* STATS */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-black text-[#0077B6]">{s.value}</p>
              <p className="text-gray-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="py-14 px-4 bg-[#F8FAFC]">
        <div className="max-w-[800px] mx-auto space-y-5">
          <h2 className="text-3xl font-black text-gray-900">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Kemetro was founded with a single mission: to connect building material and home finishing suppliers with buyers worldwide through a trusted, transparent, and technology-driven marketplace. We believe every manufacturer, trader, and supplier deserves a global platform — regardless of size.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            By eliminating the barriers of geography, language, and currency, Kemetro empowers sellers to reach buyers in 30+ countries while giving buyers access to thousands of verified, quality-rated products in one place.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-[800px] mx-auto space-y-5">
          <h2 className="text-3xl font-black text-gray-900">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Kemetro was born as part of the Kemedar ecosystem — a comprehensive platform built around the real estate industry. Recognizing that property professionals and developers constantly needed reliable access to building materials, finishings, and home products, Kemedar launched Kemetro as a dedicated vertical marketplace specifically for this industry.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Today, Kemetro serves thousands of sellers and millions of buyers across the Middle East, Africa, and beyond — with a growing presence in Europe and Asia. Our unique Store Coordinator program, export module, and Kemecoin loyalty system set us apart from general marketplaces and make Kemetro the go-to destination for real estate product procurement.
          </p>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-14 px-4 bg-[#F8FAFC]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Part of the Kemedar Ecosystem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ECOSYSTEM.map((e) => (
              <Link key={e.name} to={e.href} className={`rounded-xl border-2 p-5 text-center hover:shadow-md transition-shadow ${e.color}`}>
                <p className="font-black text-lg">{e.name}</p>
                <p className="text-sm mt-1 opacity-80">{e.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #0077B6 0%, #005f8e 100%)" }}>
        <div className="max-w-[600px] mx-auto text-center space-y-5">
          <h2 className="text-3xl font-black text-white">Get in Touch</h2>
          <p className="text-blue-100">Have questions about Kemetro? We'd love to hear from you.</p>
          <Link to="/kemetro/contact" className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">Contact Us →</Link>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}