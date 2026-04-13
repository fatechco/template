import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const BENEFITS = [
  { icon: "🌍", title: "Largest Dedicated Marketplace", desc: "Join the largest dedicated marketplace for real estate products worldwide. Reach millions of engaged and targeted customers." },
  { icon: "🆓", title: "Free Registration", desc: "Register your store and list products for free. You only pay a small percentage once your sales reach $12,000 — zero upfront costs." },
  { icon: "⚡", title: "Easy Store Setup", desc: "Create your store in less than 20 minutes and add products in under 6 minutes each. Our intuitive platform makes it effortless." },
  { icon: "🤝", title: "Accredited Store Coordinators", desc: "Don't have time? Assign an accredited Store Coordinator to set up and manage your store professionally on your behalf." },
  { icon: "🛒", title: "Retail & Wholesale", desc: "Sell to both retail and wholesale customers through one platform. Expand your reach and grow your business opportunities." },
  { icon: "🌐", title: "Global Export Opportunities", desc: "Export your products to 30+ countries through our built-in export module. Tap into international markets easily." },
  { icon: "📢", title: "Powerful Marketing", desc: "Leverage Kemetro's extensive marketing activities and 2.5M+ customer database to increase your product visibility." },
  { icon: "⭐", title: "Transparent Seller Evaluation", desc: "Our evaluation system builds trust with customers while our support team helps you optimize your store and listings." },
  { icon: "💳", title: "Secure Payment Options", desc: "Accept XeedWallet, PayPal, bank transfers, credit cards, and more. We handle all payment processing securely." },
  { icon: "🛠", title: "Comprehensive Seller Tools", desc: "Full suite of seller tools for store management, promotions, analytics, and logistics partner networking." },
  { icon: "🛡", title: "Seller Protection", desc: "Dedicated seller protection and customer support to help you sell efficiently and resolve issues fast." },
  { icon: "🔒", title: "Zero IT Hassle", desc: "No need to worry about site security or payment processors. We handle all technical infrastructure for you." },
  { icon: "👥", title: "Global Community", desc: "Join 2.5M+ highly engaged prospects in a global dedicated real estate community that keeps growing." },
  { icon: "📱", title: "Seller Mobile App", desc: "Manage your store, products, orders, and finances anytime with the Kemetro Seller mobile app." },
  { icon: "🌐", title: "Multilingual & Multicurrency", desc: "Sell in 15+ languages and 40+ currencies. Reach buyers worldwide without language or currency barriers." },
  { icon: "🎯", title: "Unique Marketplace Features", desc: "Featured Products, Shipping Calculator, Product Variants, Coupon System, Social Sharing — all included." },
  { icon: "🚚", title: "Streamlined Shipping", desc: "Access our network of verified delivery and shipping providers for seamless order fulfillment." },
];

const FEES = [
  { icon: "📋", title: "Listing Fee", amount: "$0", label: "Always Free", desc: "List unlimited products at absolutely no cost." },
  { icon: "💰", title: "Sale Fee", amount: "1.7%", label: "After $12,000 in Sales", desc: "Only on local shipped orders excluding shipping costs." },
  { icon: "🏦", title: "Payment Processing", amount: "1%", label: "Per Transaction", desc: "Standard banking fee applied to all processed payments." },
  { icon: "🌍", title: "Export Fee", amount: "5.5%", label: "For Export Orders", desc: "Total ~7% including payment processing for cross-border sales." },
];

export default function KemetroSellerBenefits() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0077B6 0%, #005f8e 100%)" }} className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">🏪 FOR SELLERS</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
              Grow Your Business with the World's Largest Dedicated Real Estate Products Marketplace
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Join thousands of verified suppliers reaching millions of targeted buyers across 30+ countries.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/kemetro/seller/register" className="bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition-colors">Start Selling Free →</Link>
              <Link to="/kemetro/how-it-works" className="border-2 border-white text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl transition-colors">Learn More</Link>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5 w-full max-w-sm">
              {[
                { icon: "🌍", label: "2.5M+ Prospects" },
                { icon: "🏪", label: "30+ Countries" },
                { icon: "📦", label: "Free to Start" },
                { icon: "💰", label: "Only Pay at $12,000 in Sales" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">{s.icon}</div>
                  <span className="font-black text-gray-900 text-lg">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">17 Reasons to Sell on Kemetro</h2>
            <p className="text-gray-500 mt-2">Everything you need to grow your business online</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-[#F8FAFC] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEES */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 mt-2">No hidden fees. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-4xl font-black text-[#0077B6] mb-1">{f.amount}</div>
                <div className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block mb-3">{f.label}</div>
                <h3 className="font-black text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEMECOIN */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 100%)" }}>
        <div className="max-w-[800px] mx-auto text-center space-y-6">
          <h2 className="text-4xl font-black text-white">💰 Earn Kemecoin Rewards</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            For every $3 you sell on Kemetro, you earn 1 Kemecoin — redeemable for cash or company shares.
          </p>
          <Link to="/kemetro/kemecoin" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-8 py-3 rounded-xl transition-colors">Learn About Kemecoin →</Link>
        </div>
      </section>

      {/* STORE COORDINATOR */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center h-72">
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🤝</div>
              <p className="text-gray-500 font-medium">Store Coordinator at Work</p>
            </div>
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl font-black text-gray-900">Don't Have Time? We'll Do It For You</h2>
            <p className="text-gray-500 font-medium">Meet the Kemetro Store Coordinator Program</p>
            <p className="text-gray-700 leading-relaxed">
              A Store Coordinator is a trained Kemetro partner who sets up and manages your store on your behalf — adding products, handling orders, and growing your sales.
            </p>
            <div className="space-y-2">
              {["Free training provided", "No fees on first $10,000 in sales", "Professional store setup", "Full order management"].map((b) => (
                <div key={b} className="flex items-center gap-2 text-gray-700 font-medium"><span className="text-green-500 font-black">✓</span> {b}</div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/kemetro/store-coordinator" className="border-2 border-[#0077B6] text-[#0077B6] hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">Become a Store Coordinator</Link>
              <Link to="/kemetro/store-coordinator" className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">Assign a Coordinator to My Store</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #FF6B00 0%, #e55f00 100%)" }}>
        <div className="max-w-[600px] mx-auto text-center space-y-5">
          <h2 className="text-4xl font-black text-white">Ready to Start Selling?</h2>
          <p className="text-orange-100 text-lg">Join thousands of suppliers already growing on Kemetro.</p>
          <Link to="/kemetro/seller/register" className="inline-block bg-white hover:bg-gray-50 text-orange-600 font-black px-8 py-3 rounded-xl transition-colors">Open Your Free Store →</Link>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}