import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const BENEFITS = [
  { icon: "🛒", title: "Smart Cart & Checkout", desc: "Streamlined cart system and one-click checkout for a seamless purchase experience." },
  { icon: "⚖️", title: "Compare Products", desc: "Compare products side by side by features, specs, and prices before making a decision." },
  { icon: "❤️", title: "Wishlist", desc: "Save products you love to your wishlist and come back to purchase when ready." },
  { icon: "⚡", title: "Flash Deals", desc: "Daily deals and flash sales on top products — limited time offers at unbeatable prices." },
  { icon: "🏷", title: "Discounts & Coupons", desc: "Exclusive discount codes and coupon offers available across thousands of products." },
  { icon: "🔍", title: "Suggestive Search", desc: "Smart search suggestions help you find the right product quickly and accurately." },
  { icon: "⭐", title: "Customer Reviews", desc: "Verified buyer reviews and ratings help you choose the best products confidently." },
  { icon: "🎬", title: "Product Videos", desc: "Watch in-depth product videos and demonstrations before making your purchase." },
  { icon: "🔐", title: "Social Media Login", desc: "Sign in with Google, Facebook, or your Kemedar account using single sign-on (SSO)." },
  { icon: "📱", title: "Mobile App", desc: "Browse, order, and track your purchases anytime with the Kemetro mobile app." },
  { icon: "✅", title: "Satisfaction Guarantee", desc: "Guaranteed satisfaction on all purchases with a clear and easy refund policy." },
  { icon: "🔨", title: "Auction System", desc: "Bid on products through our live auction system and win items at special prices." },
  { icon: "🌍", title: "International Marketplace", desc: "Shop from thousands of sellers across 30+ countries competing to offer the best prices." },
  { icon: "🌐", title: "15+ Languages", desc: "Browse and shop in your preferred language from our 15+ supported languages." },
  { icon: "💳", title: "20+ Payment Methods", desc: "Pay your way — credit card, wallet, bank transfer, or cash on delivery." },
  { icon: "📦", title: "Import & Export", desc: "Buy from international sellers or export products to other countries through our platform." },
  { icon: "🏪", title: "Seller Evaluation", desc: "Our comprehensive seller rating system ensures you buy from reliable, quality suppliers only." },
  { icon: "🖥", title: "User-Friendly Dashboard", desc: "One control panel for all your orders, tracking, returns, and account management." },
  { icon: "🕐", title: "24/7 Support", desc: "Round-the-clock support through Kemetro agents and franchise owners in your region." },
];

export default function KemetroBuyerBenefits() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #FF6B00 0%, #f59e0b 100%)" }} className="py-20 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full">🛒 FOR BUYERS</span>
            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
              The Smarter Way to Buy Building & Home Products
            </h1>
            <p className="text-orange-100 text-lg leading-relaxed">
              Compare thousands of products from verified sellers across 30+ countries — all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/kemetro" className="bg-white hover:bg-gray-50 text-orange-600 font-black px-6 py-3 rounded-xl transition-colors">Shop Now</Link>
              <Link to="/kemetro/search" className="border-2 border-white text-white hover:bg-white/10 font-bold px-6 py-3 rounded-xl transition-colors">Browse Categories</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            {[
              { name: "Premium Cement 50kg", price: "$7.50", img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80" },
              { name: "Ceramic Floor Tile 60x60", price: "$28.50/m²", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
              { name: "Wall Paint White 20L", price: "$49.99", img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&q=80" },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-xl shadow-lg flex items-center gap-3 p-3">
                <img src={p.img} alt={p.name} className="w-14 h-14 object-cover rounded-lg" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                  <p className="text-orange-600 font-black text-sm">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900">19 Reasons to Shop on Kemetro</h2>
            <p className="text-gray-500 mt-2">Everything that makes your shopping experience better</p>
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

      {/* FINAL CTA */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, #FF6B00 0%, #e55f00 100%)" }}>
        <div className="max-w-[600px] mx-auto text-center space-y-5">
          <h2 className="text-4xl font-black text-white">Start Shopping on Kemetro Today</h2>
          <p className="text-orange-100 text-lg">Thousands of products. Verified sellers. Unbeatable prices.</p>
          <Link to="/kemetro" className="inline-block bg-white hover:bg-gray-50 text-orange-600 font-black px-8 py-3 rounded-xl transition-colors">Shop Now →</Link>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}