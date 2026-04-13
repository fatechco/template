import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const BENEFITS_CARDS = [
  { icon: '🔍', title: '110+ Search Filters', description: 'Use advanced filters to find properties that perfectly match your specific criteria and budget' },
  { icon: '👥', title: 'Direct Contact with Sellers', description: 'Connect directly with property owners, agents and developers via chat, WhatsApp or phone' },
  { icon: '🏠', title: 'Huge Property Database', description: 'Access one of the largest and most diverse real estate databases globally across 30+ countries' },
  { icon: '📋', title: 'Post Buying Requests', description: 'Submit your property requirements and get tailored offers from motivated sellers and agents' },
  { icon: '✅', title: 'Buyer Kanban Organizer', description: 'Track every property from first interest to purchase using our unique visual pipeline board' },
  { icon: '⭐', title: 'Property Comparison Tool', description: 'Compare multiple properties side-by-side to make the best decision based on your priorities' },
  { icon: '🔔', title: 'Price Alerts & Wishlist', description: 'Save favorite properties and get notified when prices drop or similar properties are added' },
  { icon: '📱', title: 'Book Property Visits', description: 'Schedule property inspections directly with sellers or agents through the platform' },
  { icon: '✔️', title: 'Verified Listings Badge', description: 'Identify verified properties with official documentation checked by KEMEDAR® experts' },
  { icon: '💹', title: 'Market Insights', description: 'Access property values and market trends to make informed purchasing decisions' },
  { icon: '🛒', title: 'Kemetro Marketplace', description: 'Browse and purchase finishing products to renovate or upgrade your property' },
  { icon: '📱', title: 'Mobile App (PWA)', description: 'Browse, search and manage your property search on the go from any device' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Search Carefully', description: 'Explore properties using 110+ filters and create a shortlist of favorites' },
  { step: 2, title: 'Communicate Directly', description: 'Engage with advertisers through chat, WhatsApp or phone calls' },
  { step: 3, title: 'Verify Information', description: 'Ensure accuracy using legal advisors or Kemedar\'s verification services' },
  { step: 4, title: 'Secure Purchase', description: 'Finalize with professional legal assistance and binding contracts' },
];

const WHY_LOVE = [
  'Completely Free',
  'Huge Database',
  'Easy Browsing',
  'Global Platform',
  'Transparent Communication',
  'Exclusive Discounts',
  'Comprehensive Ecosystem',
  'Property Comparison',
  'Unique Services',
  'End-to-End Support',
];

const AI_TOOLS = [
  {
    icon: '🤖',
    title: 'AI Property Search™',
    description: 'Describe your dream property in plain language and let AI find your best matches instantly. No complex filters — just tell the AI what you want.',
    badge: 'Find Faster',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/ai-search',
    cta: 'Try AI Search',
  },
  {
    icon: '🧬',
    title: 'Kemedar DNA™',
    description: 'Your personal property DNA profile — built from your browsing, searches, and preferences. AI learns what you love and surfaces perfect matches automatically.',
    badge: 'Personalized',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemedar/dna/landing',
    cta: 'Build My DNA Profile',
  },
  {
    icon: '💘',
    title: 'Kemedar Match™',
    description: 'Swipe-based property matching powered by AI. Like your favorites, pass on the rest, and let the system find your ideal match from thousands of listings.',
    badge: 'Swipe to Match',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/match/landing',
    cta: 'Start Matching',
  },
  {
    icon: '📊',
    title: 'Predict™ — Price Forecast',
    description: 'Know if a property is priced fairly today and where prices are heading. AI forecasts 6–36 month price trajectories to help you buy at the right time.',
    badge: 'Buy Smart',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Price Forecast',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Coach',
    description: 'AI analyzes the property and market data to give you a recommended opening offer, concession strategy, and walk-away price — so you always negotiate from a position of strength.',
    badge: 'Buy at Best Price',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Negotiation Strategy',
  },
  {
    icon: '👁️',
    title: 'Vision™ — Property Photo AI',
    description: 'AI scans listing photos to detect real finishing quality, identify potential issues, and give you an honest assessment — before you even visit.',
    badge: 'No Surprises',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemedar/vision/landing',
    cta: 'Analyze Listing Photos',
  },
  {
    icon: '🌍',
    title: 'Life Score™',
    description: 'Rate every neighborhood on 7 dimensions: walkability, schools, safety, noise, greenery, connectivity, and convenience — so you know exactly what living there feels like.',
    badge: 'Know the Area',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemedar/life-score/landing',
    cta: 'Check Neighborhood Score',
  },
  {
    icon: '🏦',
    title: 'Kemedar Escrow™',
    description: 'Pay safely. Funds are held in escrow until all conditions are met and title is fully transferred to you — protecting your money throughout the entire transaction.',
    badge: 'Secure Payment',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Tour any property remotely via live or pre-recorded virtual tours. Shortlist properties you\'ve never physically visited — saving you hours of travel time.',
    badge: 'Tour Remotely',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Browse Virtual Tours',
  },
  {
    icon: '🧑‍💼',
    title: 'Kemedar Advisor™',
    description: 'Complete a quick survey and get a full AI-generated buyer advisory report — with top property matches, area analysis, ROI estimates, and personalized recommendations.',
    badge: 'Expert Guidance',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/advisor',
    cta: 'Get Advisor Report',
  },
  {
    icon: '🏗️',
    title: 'Finish™ — Renovation Planner',
    description: 'Just bought a property that needs work? Get an AI-powered renovation BOQ, cost estimate, and connect with verified contractors through Kemework.',
    badge: 'Plan Renovation',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/finish/landing',
    cta: 'Plan My Renovation',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Auctions',
    description: 'Find properties priced below market value through live competitive auctions. Register as a bidder and win your next property at an unbeatable price.',
    badge: 'Below Market',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'Browse Auctions',
  },
];

export default function PropertyBuyerBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Property Buyer</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🔍 FOR PROPERTY BUYERS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Find Your Ideal Property That Suits You Perfectly
              </h1>
              <p className="text-xl text-white/95 mb-8">
                With over 110 search criteria, filter through hundreds of thousands of properties and connect directly with owners, agents and developers worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Searching Free →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Post a Buy Request
                </button>
              </div>
            </div>

            {/* Right Floating Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Why Buyers Love Kemedar</h3>
              <div className="space-y-4 mb-8">
                {[
                  'Completely Free to use',
                  'Huge database of verified properties',
                  '110+ search filters',
                  'Direct contact with sellers',
                  'Post buy requests & get offers',
                  'End-to-end support through purchase',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold flex-shrink-0">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Searching Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Key Advantages for Property Buyers</h2>
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
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Advanced Search Tools</td>
                  <td className="px-6 py-4 text-gray-700">Over 110 precise criteria to find your ideal property</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Free Communication</td>
                  <td className="px-6 py-4 text-gray-700">Contact owners, agents and developers via chat or phone</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Extensive Database</td>
                  <td className="px-6 py-4 text-gray-700">One of the largest and most diverse real estate databases globally</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Post Buying Request</td>
                  <td className="px-6 py-4 text-gray-700">Submit your requirements and receive tailored offers from sellers</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">KEMEDAR® Veri</td>
                  <td className="px-6 py-4 text-gray-700">Professional verification of property info and legal documents</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Market Insights</td>
                  <td className="px-6 py-4 text-gray-700">Property values and market trends to make informed decisions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS_CARDS.map((card, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
                  <div className="text-5xl font-black text-blue-600 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-blue-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY BUYERS LOVE */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Why Buyers Love Kemedar</h2>
          <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {WHY_LOVE.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <span className="text-lg font-semibold text-gray-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-blue-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMEDAR AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Property Buyers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Don't just browse — use Kemedar's AI tools to search smarter, evaluate deeper, negotiate better, and buy with total confidence.</p>
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
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Start Your Property Search Today
          </h2>
          <p className="text-lg mb-8">
            Register Now to Find Your Perfect Property
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Register Now to Find Your Property →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}