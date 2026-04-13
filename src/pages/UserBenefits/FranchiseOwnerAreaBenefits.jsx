import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const RESPONSIBILITIES = [
  'Pay the required insurance amount',
  'Large wall advertisements in visible areas',
  'Appoint a communication officer/secretary',
  'Display Kemedar branding prominently',
  'Attract subscriptions from brokers & developers',
  'Train customers on adding quality content',
  'Gather information about area properties & stores',
  'Verify information of agents and stores',
  'Execute paid services (photography, VERIFIED signs)',
  'Conduct product training for stores',
  'Perform site visits with customers and agents',
  'Arrange legal papers with Kemedar lawyers',
  'Follow up with workers and handymen',
  'Activate ERP, CRM and control panel software',
  'Accept office design modifications for brand unity',
  'Attend practical training sessions',
  'Send weekly WhatsApp campaigns',
  'Send Facebook campaigns to area clients',
  'Make phone calls using provided scripts',
];

const REVENUE_STREAMS = [
  { icon: '🏠', title: 'Property Listings', description: 'Commission from premium property listings' },
  { icon: '🛒', title: 'Kemetro Sales', description: 'Revenue share from product marketplace' },
  { icon: '🔧', title: 'Kemework Services', description: 'Commission from handyman platform' },
  { icon: '💼', title: 'Subscription Plans', description: 'Profit from seller and agent subscriptions' },
  { icon: '✅', title: 'Verification Services', description: 'Income from KEMEDAR® Veri services' },
  { icon: '📢', title: 'Campaign Services', description: 'Revenue from promotional campaigns' },
  { icon: '🏢', title: 'Website Services', description: 'Income from professional website creation' },
];

const AI_TOOLS = [
  {
    icon: '📊',
    title: 'Predict™ — Area Price Intelligence',
    description: 'Access AI-powered price forecasts for every neighborhood in your territory. Know current market values and 6–36 month trends — become the go-to market expert in your area.',
    badge: 'Territory Expertise',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Area Price Data',
  },
  {
    icon: '🧠',
    title: 'ThinkDar™ — AI Content Engine',
    description: 'Generate professional property descriptions, marketing copy, and sales scripts in seconds for all listings in your territory. Boost content quality across all your clients.',
    badge: 'Save Hours',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/thinkdar',
    cta: 'Generate Content with AI',
  },
  {
    icon: '🔐',
    title: 'Verify Pro™',
    description: 'Conduct official property verifications as a certified Kemedar inspector in your territory. Earn revenue from every verification service and build an unmatched trust reputation in your area.',
    badge: 'Primary Revenue',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/verify/my-property',
    cta: 'Learn About Verification',
  },
  {
    icon: '💰',
    title: 'Kemedar Escrow™',
    description: 'Facilitate secure property transactions in your area using built-in escrow. Funds are held safely until all conditions are met — boosting deal closure rates and buyer confidence.',
    badge: 'Secure Deals',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Area Auctions',
    description: 'Host live property auctions for your territory. Attract serious buyers, create urgency, and earn commissions on every auction — a powerful new service to offer your clients.',
    badge: 'New Revenue Stream',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'Explore Auctions',
  },
  {
    icon: '🔄',
    title: 'Kemedar Swap™',
    description: 'Facilitate property exchanges between owners in your territory. AI finds matches — you facilitate and earn. A unique service that no traditional agency offers.',
    badge: 'Unique Offering',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/dashboard/swap',
    cta: 'Explore Swap Deals',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Offer virtual tours for properties in your territory. Remote buyers and expats can tour properties without physical visits — dramatically expanding your buyer pool beyond the local market.',
    badge: 'Expand Your Market',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Create Virtual Tours',
  },
  {
    icon: '🌍',
    title: 'Life Score™',
    description: 'Provide potential buyers and investors with verified neighborhood quality scores for every area in your territory across 7 dimensions. A powerful tool to attract relocation buyers.',
    badge: 'Attract Buyers',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/life-score/landing',
    cta: 'Score Your Territory',
  },
  {
    icon: '📷',
    title: 'Snap & Fix™',
    description: 'Offer AI-powered property repair diagnosis to handymen and property owners in your territory. Route tasks through Kemework and earn a commission on every job placed.',
    badge: 'Kemework Revenue',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemework/snap',
    cta: 'Learn About Snap & Fix',
  },
  {
    icon: '🔷',
    title: 'KemeFrac™ — Investment Opportunities',
    description: 'Introduce property owners in your territory to KemeFrac tokenization. Help them raise capital through fractional offerings and earn a referral commission on every tokenized property.',
    badge: 'New Capital Stream',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemefrac',
    cta: 'Explore KemeFrac',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Strategy',
    description: 'Equip every buyer and seller in your territory with AI-generated negotiation strategies. Become the most data-driven franchise owner in the network and close more deals.',
    badge: 'Close More Deals',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Negotiation Strategy',
  },
  {
    icon: '⭐',
    title: 'Kemedar Score™',
    description: 'Build your franchise owner credibility score on the platform. A high Kemedar Score increases your territory visibility, attracts more clients, and unlocks premium platform features.',
    badge: 'Build Reputation',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/score/landing',
    cta: 'View My Score',
  },
];

export default function FranchiseOwnerAreaBenefits() {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Franchise Owner</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🗺 FOR AREA FRANCHISE OWNERS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Be a Kemedar Area Franchise Owner — The Eyes and Hands of Kemedar in Your Region
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Share equally in all profits from services and sales within your region as Kemedar's exclusive representative.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Apply to Become Franchise Owner →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Download Franchise Guide
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-orange-600">30+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-orange-600">200+</div>
                  <div className="text-gray-600">Cities</div>
                </div>
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-orange-600">7</div>
                  <div className="text-gray-600">Revenue Streams</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-orange-600">50/50</div>
                  <div className="text-gray-600">Profit Sharing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERSHIP ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Partnership Advantages with Kemedar</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Exclusive Representation', 'Sole Kemedar and Kemetro partner in your designated area'],
                  ['Profit Sharing', 'Share equally in all profits from services and sales in your region'],
                  ['Initial Promotion Campaign', 'Kemedar conducts marketing campaign to introduce you to customers'],
                  ['Comprehensive Training', 'Training on subscriptions, content creation, property review, and marketing'],
                  ['Administrative Programs', 'ERP, CRM and dedicated representative control panel access'],
                  ['Free Listings', 'Add unlimited real estate or products displayed under your representative title'],
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

      {/* FRANCHISE OWNER DUTIES */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Franchise Owner Responsibilities</h2>
            <p className="text-gray-600">Key duties to ensure a successful partnership</p>
          </div>
          <div className="space-y-2">
            {RESPONSIBILITIES.map((responsibility, index) => (
              <button
                key={index}
                onClick={() => toggleExpand(index)}
                className="w-full bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-all text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-orange-600">{index + 1}</span>
                  <span className="font-semibold text-gray-900">{responsibility}</span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform flex-shrink-0 ${expandedItems[index] ? 'rotate-180' : ''}`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE STREAMS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Your 7 Revenue Streams</h2>
            <p className="text-gray-600">Multiple income sources from the Kemedar ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVENUE_STREAMS.map((stream, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{stream.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{stream.title}</h3>
                <p className="text-gray-600 text-sm">{stream.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY CHECK */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-12 border-2 border-orange-200 shadow-lg text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Quick Eligibility Check</h2>
            <div className="space-y-4 mb-8">
              <input
                type="text"
                placeholder="Country"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <input
                type="text"
                placeholder="Background / Industry"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
              Check Availability →
            </button>
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-orange-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMEDAR AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Franchise Owners</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Leverage Kemedar's full AI ecosystem to dominate your territory — verify properties, facilitate deals, expand revenue streams, and become the undisputed local authority.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-orange-400 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{tool.description}</p>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Your Territory is Waiting
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Apply to Be a Franchise Owner →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}