import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const OPPORTUNITIES = [
  { icon: '🏠', title: 'Residential Properties', description: 'Apartments, villas, and townhouses in high-demand markets with strong rental yields (e.g., 8% annually)' },
  { icon: '🏢', title: 'Commercial Real Estate', description: 'Office spaces, retail centers, or warehouses with stable cash flows (e.g., 10% ROI)' },
  { icon: '🏨', title: 'Hospitality Investments', description: 'Hotels, resorts, or vacation rentals in tourist destinations (e.g., 12% returns)' },
  { icon: '🔀', title: 'Fractional Ownership', description: 'Invest in premium properties with smaller capital through shared ownership (e.g., co-own Dubai penthouse for $50K)' },
  { icon: '📊', title: 'REITs & Funds', description: 'Join Kemedar\'s investment trusts for diversified, hands-off investing (e.g., 9% annual dividends)' },
];

const HOW_TO_INVEST = [
  { step: 1, title: 'Create Your Account' },
  { step: 2, title: 'Explore Opportunities' },
  { step: 3, title: 'Analyze Investments' },
  { step: 4, title: 'Make Your Investment' },
  { step: 5, title: 'Track Performance' },
  { step: 6, title: 'Optimize Your Portfolio' },
  { step: 7, title: 'Engage with Experts' },
  { step: 8, title: 'Scale Your Investments' },
  { step: 9, title: 'Enjoy Returns' },
  { step: 10, title: 'Become a Kemedar Leader' },
];

const TECH_FEATURES = [
  { icon: '🤖', title: 'AI Market Analysis' },
  { icon: '📊', title: 'Portfolio Management' },
  { icon: '👥', title: 'Investor CRM' },
  { icon: '✅', title: 'KEMEDAR® Veri' },
  { icon: '🎥', title: 'Virtual Tours' },
];

const AI_TOOLS = [
  {
    icon: '🔷',
    title: 'KemeFrac™ — Fractional Investing',
    description: 'Buy fractional ownership tokens in verified Egyptian and MENA properties from as little as 500 EGP. Earn monthly or quarterly rental yield without owning 100% of a unit.',
    badge: 'Start Small',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemefrac',
    cta: 'Browse Fractional Offerings',
  },
  {
    icon: '📊',
    title: 'Predict™ — Price Forecast AI',
    description: 'AI-powered price forecasts for any area, neighborhood, or property type. Know 6–36 month price trajectories to time your investments for maximum capital appreciation.',
    badge: 'Buy at the Right Time',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Price Forecasts',
  },
  {
    icon: '🧩',
    title: 'Kemedar DNA™ — Investor Profile',
    description: 'AI builds your personal investment profile from your preferences, risk tolerance, and goals. Get a curated pipeline of investment-grade properties matched to your strategy.',
    badge: 'Personalized Pipeline',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemedar/dna/landing',
    cta: 'Build My Investor Profile',
  },
  {
    icon: '🧑‍💼',
    title: 'Kemedar Advisor™',
    description: 'Complete a quick survey and receive a full AI-generated investor advisory report — with top property matches, ROI estimates, area risk ratings, and cash flow projections.',
    badge: 'Expert AI Analysis',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemedar/advisor',
    cta: 'Get Investor Report',
  },
  {
    icon: '🔐',
    title: 'Verify Pro™',
    description: 'Only invest in properties that have passed Kemedar\'s official verification. Verified properties have had title deeds, legal documents, and physical conditions checked and certified.',
    badge: 'Invest Safely',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/verify/my-property',
    cta: 'See Verified Properties',
  },
  {
    icon: '🏦',
    title: 'Kemedar Escrow™',
    description: 'Your funds are held securely in escrow until all conditions are met and title is transferred. No risk of losing capital to fraud or incomplete transactions.',
    badge: 'Zero Risk Payments',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Auctions',
    description: 'Acquire properties below market value through live competitive auctions. Register as a bidder and win distressed or motivated-seller properties at unbeatable prices.',
    badge: 'Below Market Value',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'Browse Auctions',
  },
  {
    icon: '🔄',
    title: 'Kemedar Swap™',
    description: 'Upgrade or restructure your portfolio by swapping properties directly with other owners — with or without a cash top-up. AI finds the best matched swap partners for you.',
    badge: 'Portfolio Restructuring',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/dashboard/swap',
    cta: 'Explore Swap',
  },
  {
    icon: '🌍',
    title: 'Life Score™',
    description: 'Evaluate investment locations with AI-scored neighborhood quality data across 7 dimensions. Know which areas have the highest demand drivers before committing capital.',
    badge: 'Location Intelligence',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemedar/life-score/landing',
    cta: 'Score Any Neighborhood',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Tour any investment property remotely via live or pre-recorded virtual tours. Evaluate opportunities globally without travel costs — perfect for international investors.',
    badge: 'Invest Remotely',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Browse Virtual Tours',
  },
  {
    icon: '⭐',
    title: 'Kemedar Score™',
    description: 'Build your investor credibility score on the platform. A high Kemedar Score gives you priority access to exclusive off-market deals, KemeFrac offerings, and developer direct deals.',
    badge: 'Priority Access',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/score/landing',
    cta: 'Build My Score',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Coach',
    description: 'AI generates a data-driven negotiation strategy for any property you\u2019re considering. Know the fair market value, optimal offer, and walk-away point before entering any negotiation.',
    badge: 'Buy at Best Price',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Deal Strategy',
  },
];

export default function InvestorBenefits() {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Real Estate Investor</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                💰 FOR REAL ESTATE INVESTORS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Invest with Kemedar: Unlock Wealth in Global Real Estate
              </h1>
              <p className="text-xl text-white/95 mb-8">
                The world's premier real estate investment platform with over $15 billion in transactions, 2 million properties and a network exceeding 100,000 investors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-amber-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Start Investing Now →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  Explore Opportunities
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Platform Stats</h3>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-amber-600">$15B+</div>
                  <div className="text-gray-600">In Transactions</div>
                </div>
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-amber-600">120+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-amber-600">100K+</div>
                  <div className="text-gray-600">Investors</div>
                </div>
                <div className="border-b pb-4">
                  <div className="text-3xl font-black text-amber-600">2M+</div>
                  <div className="text-gray-600">Properties</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-amber-600">12%</div>
                  <div className="text-gray-600">Annual Returns</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY INVEST TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Why Invest with Kemedar?</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-600 text-white">
                  <th className="px-6 py-4 text-left font-bold">Benefit</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['High Returns', 'Up to 12% annual returns on curated investment opportunities'],
                  ['Risk Mitigation', 'AI due diligence and KEMEDAR® Veri ensure secure investments'],
                  ['AI-Powered Insights', 'Advanced analytics to identify high-potential markets'],
                  ['Global Portfolio', 'Diversify across international markets from NYC to Dubai'],
                  ['Flexible Options', 'Direct purchases, REITs, or fractional ownership'],
                  ['Expert Support', '24/7 real estate and financial experts'],
                  ['Investor Education', 'Webinars, market reports, Kemedar Academy courses'],
                  ['Exclusive Incentives', 'Premium analytics and priority access to high-demand properties'],
                  ['Transparent Performance', 'Real-time dashboards and performance metrics'],
                  ['Trusted Network', 'Verified developers, agents and investors in secure ecosystem'],
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

      {/* INVESTMENT OPPORTUNITIES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Explore Investment Opportunities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-amber-300 transition-all">
                <div className="text-5xl mb-4">{opp.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{opp.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO INVEST ACCORDION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">How to Invest</h2>
          <div className="space-y-3">
            {HOW_TO_INVEST.map((item) => (
              <button
                key={item.step}
                onClick={() => setExpandedStep(expandedStep === item.step ? null : item.step)}
                className="w-full bg-white rounded-lg p-6 border border-gray-200 hover:border-amber-300 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-amber-600 flex-shrink-0">{item.step}</div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${expandedStep === item.step ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SUITE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Kemedar's Technology Suite for Investors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {TECH_FEATURES.map((tech, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="text-lg font-bold text-gray-900">{tech.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET INSIGHTS BANNER */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900 text-white rounded-3xl p-12">
            <p className="text-lg leading-relaxed mb-8">
              The global real estate market, valued at <span className="font-black text-amber-400">$350 trillion</span>, is a cornerstone of wealth creation. With Kemedar, you can access the best opportunities globally.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-black text-amber-400">8-15%</div>
                <div className="text-sm text-gray-300">Returns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-amber-400">Global</div>
                <div className="text-sm text-gray-300">Diversification</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-amber-400">Stable</div>
                <div className="text-sm text-gray-300">Asset Class</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Start Your Real Estate Investment Journey
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-amber-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Investing Now →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}