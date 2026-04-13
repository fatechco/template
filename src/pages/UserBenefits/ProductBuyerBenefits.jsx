import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const KEY_ADVANTAGES = [
  ['Extensive Product Selection', 'Construction, architectural, masonry, plumbing, electrical, furniture, and decorative items'],
  ['One-Stop Shopping', 'Everything for your home in one place from materials to furniture'],
  ['High-Quality Products', 'Highest standards from trusted verified sellers'],
  ['Exclusive Offers', 'Deals, discounts and price comparison tools for best value'],
  ['Time-Saving Comparison', 'Compare from various manufacturers and distributors'],
  ['Customer Satisfaction', 'Dedicated support team for inquiries and concerns'],
  ['Trusted Sellers', 'Reputable sellers meeting rigorous standards'],
  ['Secure Shopping', 'Advanced encryption and user-friendly interface'],
  ['Smart Cart & Checkout', 'Streamlined shopping with efficient checkout'],
  ['Product Comparison', 'Compare features, specs and prices side-by-side'],
  ['Wishlist', 'Save favorites for future reference'],
  ['Flash Deals', 'Exclusive limited-time offers'],
  ['Regular Discounts', 'Ongoing promotions on wide range of products'],
  ['Suggestive Search', 'Intelligent search suggestions'],
  ['Customer Reviews', 'Read ratings from other buyers'],
  ['Product Videos', 'Watch product demonstrations'],
  ['Social Media Login', 'Facebook, Google or Twitter account access'],
  ['Mobile App', 'Seamless shopping on the go'],
  ['Satisfaction Guaranteed', 'Clear refund policy'],
  ['Auction System', 'Bid on select products'],
  ['Global Marketplace', '30+ countries'],
  ['Multiple Languages', '15+ languages'],
  ['20+ Payment Methods', 'Online and offline options'],
  ['Import & Export', 'Products from other countries'],
  ['Transparent Seller Evaluation', 'Distinct evaluation system'],
];

const HOW_TO_SHOP = [
  { step: 1, title: 'Browse 13 Product Categories' },
  { step: 2, title: 'Compare Products Side-by-Side' },
  { step: 3, title: 'Add to Cart & Checkout Securely' },
  { step: 4, title: 'Track Your Delivery' },
];

const AI_TOOLS = [
  {
    icon: '🤖',
    title: 'AI Product Search™',
    description: 'Describe what you need in plain language and let AI find the best matching products instantly. No complex filters — just tell the AI what you want to build or finish.',
    badge: 'Find Faster',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemetro/search',
    cta: 'Try AI Search',
  },
  {
    icon: '🤖',
    title: 'AI Price Match™',
    description: 'AI scans prices across all sellers in real-time and alerts you when you can get the same product cheaper. Never overpay for materials again.',
    badge: 'Best Price',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemetro/search',
    cta: 'Find Best Prices',
  },
  {
    icon: '🎨',
    title: 'KemeKits™ — Design Kits',
    description: 'Browse curated room design kits created by professionals. Each kit includes a full BOQ of materials needed — buy everything for your room in one click.',
    badge: 'Shop by Design',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemetro/kemekits',
    cta: 'Browse Design Kits',
  },
  {
    icon: '🏗️',
    title: 'Kemetro Build™ — BOQ Generator',
    description: 'Enter your room or project dimensions and AI generates a complete Bill of Quantities with exact product quantities and costs. Shop your entire project in one go.',
    badge: 'Smart Shopping',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemetro/build',
    cta: 'Generate My BOQ',
  },
  {
    icon: '✨',
    title: 'Shop the Look™',
    description: 'See a product you love in a property photo? Click any item in listing images to buy it directly. AI identifies furniture, tiles, lights and fixtures in real property photos.',
    badge: 'Buy What You See',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemetro/search',
    cta: 'Shop the Look',
  },
  {
    icon: '⚡',
    title: 'Flash Deals™',
    description: 'AI-curated time-limited flash deals on high-demand products. Get notified when products on your wishlist go on sale — never miss a discount on materials you need.',
    badge: 'Save Money',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/kemetro/flash',
    cta: 'See Flash Deals',
  },
  {
    icon: '♻️',
    title: 'Surplus & Salvage™',
    description: 'Buy quality surplus construction materials and leftover finishes from completed projects at a fraction of the original price. Great for eco-conscious buyers and tight budgets.',
    badge: 'Eco Savings',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/kemetro/surplus',
    cta: 'Browse Surplus',
  },
  {
    icon: '📦',
    title: 'Group Buy™',
    description: 'Join group purchasing pools with other buyers to unlock wholesale prices on bulk materials. The more buyers join, the lower the price drops for everyone.',
    badge: 'Wholesale Prices',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemetro/build',
    cta: 'Join Group Buy',
  },
  {
    icon: '📝',
    title: 'RFQ System™',
    description: 'Post a Request for Quotation for any product or bulk order and receive competitive offers from multiple verified suppliers. Perfect for large construction purchases.',
    badge: 'Get Best Offers',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemetro/buyer/rfqs/create',
    cta: 'Post an RFQ',
  },
  {
    icon: '🔧',
    title: 'Snap & Fix™ — Material Finder',
    description: 'Take a photo of a damaged item or surface and AI identifies exactly what replacement materials or products you need to fix it — then adds them to your cart automatically.',
    badge: 'Fix Anything',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemework/snap',
    cta: 'Try Snap & Fix',
  },
  {
    icon: '🚚',
    title: 'Kemetro Shipping™',
    description: 'Real-time shipping quotes from verified shippers. Track your heavy freight and bulk material deliveries from order to doorstep with full transparency.',
    badge: 'Track Delivery',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemetro/search',
    cta: 'Track My Order',
  },
  {
    icon: '🏆',
    title: 'ESG Impact Tracker™',
    description: 'Track the environmental impact of your purchases. See how much CO₂ you saved by buying surplus materials or eco-certified products and earn green badges.',
    badge: 'Go Green',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    link: '/kemetro/surplus',
    cta: 'Track My Impact',
  },
];

export default function ProductBuyerBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Product Buyer</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🛒 FOR PRODUCT BUYERS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Exceptional Shopping Experience for Home Building and Finishing
              </h1>
              <p className="text-xl text-white/95 mb-8">
                At Kemetro, we provide an outstanding shopping experience for all your home building and finishing needs — from foundation to furniture.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/kemetro')}
                  className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Shopping Free →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Browse Categories
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Why Shop on Kemetro?</h3>
              <div className="space-y-4">
                {[
                  'Completely free to browse and search',
                  '2.5M+ verified sellers',
                  '50K+ products in stock',
                  'Global shipping to 30+ countries',
                  'Multiple payment methods',
                  'Secure & encrypted checkout',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold flex-shrink-0">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Key Advantages for Product Buyers</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {KEY_ADVANTAGES.map((row, i) => (
                  <tr key={i} className="hover:bg-white">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-gray-700 text-sm">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* HOW TO SHOP */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">How to Shop on Kemetro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_TO_SHOP.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 text-center">
                  <div className="text-5xl font-black text-blue-600 mb-4">{item.step}</div>
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                {i < HOW_TO_SHOP.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOPPING FEATURES GRID */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Shopping Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Advanced Search', desc: 'Find exactly what you need with intelligent filters' },
              { icon: '⭐', title: 'Ratings & Reviews', desc: 'See what other buyers think about products' },
              { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options with encryption' },
              { icon: '🚚', title: 'Fast Shipping', desc: 'Track your orders in real-time' },
              { icon: '❤️', title: 'Wishlist', desc: 'Save items for later or share with friends' },
              { icon: '🎁', title: 'Special Deals', desc: 'Flash sales and exclusive promotions' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">13 Product Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              '🏗 Building Materials',
              '⚡ Electrical Supplies',
              '🔧 Hardware & Tools',
              '🚪 Doors & Windows',
              '🪟 Glass & Mirrors',
              '🪨 Tiles & Flooring',
              '🎨 Paints & Coatings',
              '🛁 Bathroom Fixtures',
              '🍳 Kitchen Fixtures',
              '💡 Lighting',
              '🔩 Plumbing Supplies',
              '🧱 Cement & Concrete',
              '🛋 Furniture & Decor',
            ].map((cat, i) => (
              <div key={i} className="bg-blue-50 rounded-lg p-4 text-center font-bold text-gray-900 border border-blue-200">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL REACH */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-8">Global Shopping Experience</h2>
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-black text-blue-600">30+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600">15+</div>
              <div className="text-gray-600">Languages</div>
            </div>
            <div>
              <div className="text-3xl font-black text-blue-600">20+</div>
              <div className="text-gray-600">Payment Methods</div>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Shop with confidence from anywhere in the world with full support and secure transactions.</p>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-cyan-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMETRO AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Product Buyers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond browsing — use Kemetro's AI tools to find the right products, generate smart shopping lists, get the best prices, and build or renovate with total confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-cyan-400 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{tool.description}</p>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Start Shopping on Kemetro Today
          </h2>
          <button
            onClick={() => navigate('/kemetro')}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Products →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}