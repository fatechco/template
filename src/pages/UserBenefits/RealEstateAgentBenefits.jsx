import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const BENEFITS_CARDS = [
  { icon: '🌍', title: 'Global Exposure', description: 'Access millions of international buyers from 30+ countries' },
  { icon: '✅', title: 'Verified Badge', description: 'Certified agent badge builds trust with clients' },
  { icon: '📊', title: 'Agent Dashboard', description: 'Comprehensive control panel to manage all operations' },
  { icon: '👥', title: 'Client CRM', description: 'Full CRM system to track and manage client relationships' },
  { icon: '📅', title: 'Appointments', description: 'Schedule and manage property viewings and meetings' },
  { icon: '📈', title: 'Analytics', description: 'Advanced analytics to track performance and ROI' },
  { icon: '🏢', title: 'Company Website', description: 'Dedicated company site with custom domain' },
  { icon: '🏗', title: 'Project Sites', description: 'Create dedicated sites for each development project' },
  { icon: '💰', title: 'Subscription Plans', description: 'Flexible plans from $20/month to fit any budget' },
  { icon: '📋', title: 'Buy Request Leads', description: 'Get matched with buyers actively seeking properties' },
  { icon: '📢', title: 'Campaign Tools', description: 'Built-in marketing and campaign management tools' },
  { icon: '⚡', title: 'Property Boost', description: 'Highlight listings to increase visibility and inquiries' },
  { icon: '🤝', title: 'Franchise Collaboration', description: 'Join franchise opportunities within your area' },
  { icon: '📱', title: 'Mobile App', description: 'Manage all operations from the Kemedar mobile app' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Register & Create Profile', description: 'Set up your agent account and professional profile' },
  { step: 2, title: 'Get Verified', description: 'Upload credentials and licensing documents' },
  { step: 3, title: 'List Properties', description: 'Add properties up to your plan limit' },
  { step: 4, title: 'Grow Your Business', description: 'Use CRM, analytics and campaigns to grow' },
];

const AI_TOOLS = [
  {
    icon: '🤖',
    title: 'ThinkDar™ — AI Listing Generator',
    description: 'Generate compelling, SEO-optimized property descriptions in seconds. AI writes professional titles, highlights, and full descriptions in both English and Arabic from basic property data.',
    badge: 'Save Hours',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/thinkdar',
    cta: 'Generate Listings with AI',
  },
  {
    icon: '📊',
    title: 'Predict™ — Market Price AI',
    description: 'Access AI-powered price forecasts for any area you operate in. Know the current fair market value and 6–36 month price trajectory to advise clients with real data.',
    badge: 'Price Accurately',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Market Forecasts',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Strategy',
    description: 'AI generates a full negotiation strategy for every property — recommended listing price, optimal concession range, and walk-away points. Arm your clients with data-driven leverage.',
    badge: 'Close More Deals',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Negotiation Strategy',
  },
  {
    icon: '👁️',
    title: 'Vision™ — Photo Quality AI',
    description: 'AI scans your listing photos, scores quality, detects issues, labels rooms, and suggests virtual staging. Ensure every listing looks its best before going live.',
    badge: 'Better Listings',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemedar/vision/landing',
    cta: 'Analyze Listing Photos',
  },
  {
    icon: '🧑‍💼',
    title: 'Kemedar Advisor™',
    description: 'Offer your clients AI-powered buyer advisory reports. Share personalized property match analysis, ROI estimates, and area rankings generated instantly from survey data.',
    badge: 'Impress Clients',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/advisor',
    cta: 'Generate Advisor Report',
  },
  {
    icon: '🌍',
    title: 'Life Score™',
    description: 'Provide clients with a neighborhood quality score on 7 dimensions: walkability, schools, safety, noise, greenery, connectivity, and convenience — instantly for any area.',
    badge: 'Wow Your Clients',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemedar/life-score/landing',
    cta: 'Check Area Life Score',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Host live or recorded virtual tours for your listings. Let international and remote buyers tour properties without physical visits — dramatically expanding your buyer pool.',
    badge: 'More Showings',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Create Virtual Tour',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Auction Listings',
    description: 'List motivated seller properties in live competitive auctions. Create urgency, attract multiple serious buyers, and often achieve above-market sale prices within days.',
    badge: 'Fast Sales',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'List in Auction',
  },
  {
    icon: '🔐',
    title: 'Verify Pro™',
    description: 'Get properties verified with official documentation checks. Verified listings rank higher in search, attract more serious buyers, and dramatically increase your closing rate.',
    badge: 'Build Trust',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/verify/my-property',
    cta: 'Verify a Property',
  },
  {
    icon: '🏦',
    title: 'Kemedar Escrow™',
    description: 'Offer your clients a fully secure transaction via built-in escrow. Funds are held safely until title transfer is complete — giving both buyers and sellers total peace of mind.',
    badge: 'Secure Transactions',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🔄',
    title: 'Kemedar Swap™',
    description: 'Facilitate property exchanges for your clients. AI matches owners who want to swap properties directly — creating unique deal opportunities that other agents can\'t offer.',
    badge: 'Unique Deals',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/dashboard/swap',
    cta: 'Explore Swap Deals',
  },
  {
    icon: '⭐',
    title: 'Kemedar Score™',
    description: 'Build your professional reputation score on the platform. A high Kemedar Score signals reliability to clients, increases profile visibility, and drives more inbound leads.',
    badge: 'Grow Your Reputation',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/score/landing',
    cta: 'View My Score',
  },
];

export default function RealEstateAgentBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Real Estate Agent</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🤝 FOR REAL ESTATE AGENTS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                The Smartest Solutions for the Smartest Real Estate Agents
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Maximize performance, streamline operations and achieve your business goals with minimal investment using Kemedar's comprehensive professional toolkit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-teal-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Register as Agent →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Compare Plans
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Agent Membership Highlights</h3>
              <div className="space-y-4 mb-8">
                {[
                  'Free registration to start',
                  'List up to 1,000 properties',
                  'Dedicated company website + domain',
                  'Up to 20 projects',
                  'Unlimited CRM & ERP systems',
                  'Certified Agent badge',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold flex-shrink-0">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors">
                Start as Agent →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Agent Membership Advantages</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Free Registration', 'Start using basic features at no cost'],
                  ['Extensive Listings', 'Packages allow up to 1,000 properties'],
                  ['Rich Media Support', 'Up to 24 photos, videos, brochures and floor plans per property'],
                  ['Dedicated Company Site', 'Company website with custom domain or sub-domain'],
                  ['Project Management', 'Add up to 20 projects and assign properties'],
                  ['Integrated Management', 'Included ERP and CRM systems to manage your business'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-gray-700">{row[1]}</td>
                  </tr>
                ))}
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
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-teal-300 transition-all">
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
                <div className="bg-white rounded-2xl p-6 border-2 border-teal-200">
                  <div className="text-5xl font-black text-teal-600 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-teal-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PACKAGES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Agent Subscription Packages</h2>
            <p className="text-gray-600 text-lg">Special offer: 4 months for the price of 1 — limited time!</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Free</th>
                  <th className="px-6 py-4 text-center font-bold">Starter $20/mo</th>
                  <th className="px-6 py-4 text-center font-bold">Business $40/mo</th>
                  <th className="px-6 py-4 text-center font-bold">Professional $200/mo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Properties Limit', '3', '30', '100', '1,000'],
                  ['Projects Limit', '0', '1', '5', '20'],
                  ['Images per Ad', '5', '24', '24', 'Unlimited'],
                  ['Video per Ad', '1', '2', '3', 'Unlimited'],
                  ['Dedicated Page', '❌', '✅', '✅', '✅'],
                  ['ERP & CRM Systems', '❌', '90 days', '90 days', '180 days'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row[1]}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row[2]}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row[3]}</td>
                    <td className="px-6 py-4 text-center text-gray-700 bg-orange-50 font-bold">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-teal-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMEDAR AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Real Estate Agents</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond listing — use Kemedar's AI tools to generate better listings, advise clients with real data, close more deals, and build your professional reputation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-teal-400 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{tool.description}</p>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Join Thousands of Successful Agents on Kemedar
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Register as Agent →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}