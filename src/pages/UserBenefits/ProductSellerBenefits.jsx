import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const ADVANTAGES_FEATURES = [
  ['Distinctive E-Store Interface', 'Create digital store in minutes with attractive design'],
  ['Access to Specialized Audience', 'Thousands of daily visits with precise customer targeting'],
  ['Fast and Secure Shipping', 'Diverse logistics partners with live shipment tracking'],
  ['Secure Payment Methods', 'All modern payment methods with full data encryption'],
  ['Detailed Control Panel', 'Monitor sales, orders, inventory and product performance'],
  ['Technical & Marketing Support', '24/7 specialized support with marketing tips and campaigns'],
];

const ADDITIONAL_ADVANTAGES = [
  'Seasonal Offers & Discounts tools',
  'Loyalty Programs for customers',
  'Ratings & Reviews System',
  'Responsive Design (mobile + desktop)',
  'Regional Sales & Delivery',
  'Marketing & Advertising Integration',
  'High Security & Privacy',
  'Quality Certificates & Badges',
];

const HOW_TO_STEPS = [
  { step: 1, title: 'Create Seller Account', description: 'Register and specify product category' },
  { step: 2, title: 'Add Your Products', description: 'Upload images, descriptions, prices and quantities' },
  { step: 3, title: 'Market Your Store', description: 'Use promotional tools and free marketing tips' },
  { step: 4, title: 'Receive Orders', description: 'Monitor from dashboard and communicate professionally' },
  { step: 5, title: 'Deliver Products', description: 'Choose shipping via partners or own method' },
  { step: 6, title: 'Receive Your Profits', description: 'Fast, secure payment to bank or e-wallet' },
];

const PLANS = [
  { name: 'Free', products: '5 products', price: '$0' },
  { name: 'Basic', products: '25 products', price: '$30/month' },
  { name: 'Professional', products: '100 products', price: '$80/month' },
  { name: 'Enterprise', products: 'Unlimited', price: '$150/month' },
];

const AI_TOOLS = [
  {
    icon: '🤖',
    title: 'AI Product Listing Generator™',
    description: 'Generate professional product titles, descriptions, and SEO tags in seconds using AI. Trained on thousands of home materials listings — your products will rank higher and convert better.',
    badge: 'Better Listings',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/thinkdar',
    cta: 'Generate with AI',
  },
  {
    icon: '🤖',
    title: 'AI Price Intelligence™',
    description: 'AI continuously scans competitor pricing across Kemetro and external sources. Get real-time alerts when you can reprice to win more buyers without sacrificing margin.',
    badge: 'Competitive Pricing',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemetro/search',
    cta: 'Optimize My Prices',
  },
  {
    icon: '⚡',
    title: 'Flash Deals™ — Seller Tools',
    description: 'Create time-limited flash deals that appear prominently on the Kemetro homepage and deal pages. AI identifies your best-performing products to feature for maximum impact.',
    badge: 'Boost Sales',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/kemetro/flash',
    cta: 'Create a Flash Deal',
  },
  {
    icon: '✨',
    title: 'Shop the Look™ Integration',
    description: 'Get your products featured as hotspot tags inside real property photos on Kemedar listings. When buyers tap a tile or light fixture in a property photo, your product appears for purchase.',
    badge: 'Passive Discovery',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemetro/search',
    cta: 'Feature My Products',
  },
  {
    icon: '📦',
    title: 'Group Buy™ — Bulk Orders',
    description: 'List products in group buying pools to attract bulk purchasers. When enough buyers join, the deal activates — giving you a large guaranteed order at a slightly lower unit price.',
    badge: 'Big Orders',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemetro/build',
    cta: 'List in Group Buy',
  },
  {
    icon: '🏗️',
    title: 'Kemetro Build™ BOQ Integration',
    description: 'Get your products recommended inside AI-generated Bills of Quantities. When buyers enter project dimensions, your matching products appear automatically in their BOQ shopping list.',
    badge: 'Auto Recommendations',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemetro/build',
    cta: 'Join BOQ System',
  },
  {
    icon: '🎨',
    title: 'KemeKits™ — Design Integration',
    description: 'Get your products included in professional designer kits. When homeowners buy a design kit, they purchase all included products — your items sell automatically as part of a curated bundle.',
    badge: 'Bundle Sales',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemetro/kemekits',
    cta: 'Join KemeKits',
  },
  {
    icon: '📝',
    title: 'RFQ System™',
    description: 'Receive Request for Quotation leads from contractors, developers and bulk buyers. Respond to verified RFQs and win large-volume orders that never appear on standard marketplaces.',
    badge: 'B2B Orders',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemetro/buyer/rfqs/create',
    cta: 'Browse RFQs',
  },
  {
    icon: '♻️',
    title: 'Surplus & Salvage Marketplace™',
    description: 'List surplus, overstock, or end-of-line inventory on the Kemetro Surplus marketplace. Reach eco-conscious buyers and budget shoppers — clear stock fast while earning ESG badges.',
    badge: 'Clear Stock',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/kemetro/surplus',
    cta: 'List Surplus Items',
  },
  {
    icon: '🚚',
    title: 'Kemetro Shipping Network™',
    description: 'Access a verified network of shippers for heavy freight and bulk material delivery. Get competitive shipping quotes and offer buyers real-time tracking — all without managing logistics yourself.',
    badge: 'Hassle-Free Shipping',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemetro/shipper/register',
    cta: 'Set Up Shipping',
  },
  {
    icon: '📊',
    title: 'Seller Analytics Dashboard™',
    description: 'Track sales performance, conversion rates, top products, and buyer behavior from a single intelligent dashboard. AI surfaces actionable insights to help you grow faster.',
    badge: 'Data-Driven Growth',
    badgeColor: 'bg-slate-100 text-slate-700',
    link: '/kemetro/seller/register',
    cta: 'View My Analytics',
  },
  {
    icon: '🪙',
    title: 'Kemecoin Loyalty Program™',
    description: 'Earn 1 Kemecoin for every $3 sold. Redeem Kemecoins for cash payouts, advertising credits, or convert them into Kemedar equity shares — turning sales into long-term wealth.',
    badge: 'Earn Rewards',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemetro/seller/register',
    cta: 'Learn About Kemecoin',
  },
];

export default function ProductSellerBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Product Seller</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🏪 FOR PRODUCT SELLERS (STORES)
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Multiply Your Sales and Expand Your Business on the Largest Platform for Home Products
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Kemetro provides product sellers with an ideal platform to market products to a vast audience. Enjoy a comprehensive digital selling experience with technical support and professional display interfaces.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Register Your Store Free →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  See Seller Plans
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Why Choose Kemetro?</h3>
              <div className="space-y-4">
                {[
                  'Free registration',
                  'Only pay after $12,000 in sales',
                  'Create store in under 20 minutes',
                  '2.5M+ targeted buyers',
                  'Export to 30+ countries',
                  'Kemecoin loyalty rewards',
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
            <h2 className="text-4xl font-black text-gray-900 mb-2">Why Choose Kemetro to Sell?</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ADVANTAGES_FEATURES.map((row, i) => (
                  <tr key={i} className="hover:bg-white">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-gray-700">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Additional Advantages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ADDITIONAL_ADVANTAGES.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO START SELLING */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">How to Start Selling</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOW_TO_STEPS.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-5xl font-black text-blue-600 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Simple, Transparent Pricing</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Item</th>
                  <th className="px-6 py-4 text-right font-bold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Listing Fee', '$0 — Always Free'],
                  ['Sale Fee', '1.7% — After $12,000 in sales'],
                  ['Payment Processing', '1% per transaction'],
                  ['Export Fee', '5.5% — Cross-border orders'],
                  ['Total Export', '~7% — All fees combined'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-right text-gray-700">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SELLER PLANS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Seller Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-all">
                <p className="text-xl font-black text-gray-900 mb-2">{plan.name}</p>
                <p className="text-sm text-gray-600 mb-6">{plan.products}</p>
                <p className="text-3xl font-black text-blue-600 mb-6">{plan.price}</p>
                <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEMECOIN REWARDS */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-blue-600 text-white rounded-2xl p-8">
            <div className="text-3xl mb-4">🪙</div>
            <p className="text-lg leading-relaxed">
              Earn <span className="font-black">1 Kemecoin for every $3 sold</span>. Redeem for cash or company shares.
            </p>
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-blue-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMETRO AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Product Sellers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond listing — use Kemetro's AI tools to generate better listings, win bulk orders, feature in design kits, and grow your store with data-driven insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{tool.description}</p>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Register Your Store for Free on Kemetro
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Open Your Store Now →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}