import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const AI_TOOLS = [
  {
    icon: '🧠',
    title: 'ThinkDar™ — AI Content Engine',
    description: 'Generate professional property and project descriptions, sales scripts, and marketing copy in seconds — in English and Arabic. AI trained exclusively on real estate data.',
    badge: 'Save Hours',
    badgeColor: 'bg-slate-100 text-slate-700',
    link: '/thinkdar',
    cta: 'Generate Content with AI',
  },
  {
    icon: '📊',
    title: 'Predict™ — Market Price AI',
    description: 'Access AI-powered price forecasts for your project locations. Know current fair market values and 6–36 month price trajectories to set competitive unit prices that maximize revenue.',
    badge: 'Price Optimally',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Market Forecasts',
  },
  {
    icon: '👁️',
    title: 'Vision™ — Render & Photo AI',
    description: 'AI analyzes your project renders and photos, scores quality, and suggests improvements. Virtual staging transforms empty units into fully furnished showcases that sell faster.',
    badge: 'Better Presentation',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemedar/vision/landing',
    cta: 'Analyze Project Media',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Host live and recorded virtual tours for your off-plan projects. Let investors and buyers worldwide explore units remotely — dramatically expanding your international sales reach.',
    badge: 'Global Showroom',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Create Virtual Tour',
  },
  {
    icon: '🔷',
    title: 'KemeFrac™ — Fractional Offering',
    description: 'Tokenize units in your development and sell fractional ownership stakes to thousands of small investors. Raise capital faster, presell units, and create a loyal investor community.',
    badge: 'Raise Capital',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemefrac',
    cta: 'Tokenize My Project',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Auctions',
    description: 'Auction specific units to create urgency and competitive bidding. Drive above-market prices on premium or last-unit inventory through live online competitive auctions.',
    badge: 'Premium Pricing',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'Auction Units',
  },
  {
    icon: '🔐',
    title: 'Verify Pro™',
    description: 'Get your company and project properties officially verified by Kemedar inspectors. Verified projects attract more serious buyers and achieve significantly higher closing rates.',
    badge: 'Build Trust',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/verify/my-property',
    cta: 'Verify My Project',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Strategy',
    description: 'AI generates data-driven negotiation strategies for every unit. Equip your sales team with recommended price ranges, concession limits, and buyer psychology insights.',
    badge: 'Maximize Revenue',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Negotiation Strategy',
  },
  {
    icon: '🏦',
    title: 'Kemedar Escrow™',
    description: 'Offer buyers total payment security through built-in escrow. Funds are held safely until construction milestones or title transfer — dramatically increasing buyer confidence for off-plan.',
    badge: 'Secure Payments',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🌍',
    title: 'Life Score™',
    description: 'Showcase your project location with a verified neighborhood quality score across 7 dimensions. Turn your location advantages into a powerful data-backed sales argument.',
    badge: 'Location Proof',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/kemedar/life-score/landing',
    cta: 'Get Location Score',
  },
  {
    icon: '🧑‍💼',
    title: 'Kemedar Advisor™',
    description: 'AI generates investor and buyer advisory reports featuring your project. When buyers use Advisor, your verified projects appear as top-matched recommendations.',
    badge: 'More Leads',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/advisor',
    cta: 'Feature in Advisor',
  },
  {
    icon: '🏗️',
    title: 'Kemedar Finish™',
    description: 'Connect buyers with verified finishing contractors via Kemework post-purchase. Offering a turnkey finishing solution adds value to your units and accelerates the buying decision.',
    badge: 'Turnkey Value',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/finish/landing',
    cta: 'Offer Finishing',
  },
];

export default function RealEstateDeveloperBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Real Estate Developer</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🏗 FOR REAL ESTATE DEVELOPERS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Successful Marketing Strategies Start Here
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Kemedar offers customized solutions for real estate developers — optimize your marketing strategies and achieve project success with unlimited listings and integrated tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Register as Developer →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  See Developer Plans
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Developer Membership Highlights</h3>
              <div className="space-y-4 mb-8">
                {[
                  'Free registration to start',
                  'Unlimited properties and projects',
                  'Dedicated company website + domain',
                  'Unlimited media per property',
                  'Full ERP with cloud hosting 1 year free',
                  'KEMEDAR® Veri included',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold flex-shrink-0">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors">
                Start as Developer →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Real Estate Developer Membership Advantages</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Free Registration', 'Begin with a free account'],
                  ['Extensive Listings', 'Unlimited properties in all packages'],
                  ['Rich Media Support', '24+ photos, videos, brochures and floor plans per property'],
                  ['Dedicated Company Site', 'Company website with own domain from Kemedar'],
                  ['Project Management', 'Add unlimited projects'],
                  ['Integrated Admin Program', 'ERP with free cloud hosting for 1 year'],
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

      {/* SUBSCRIPTION PACKAGES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Developer Subscription Packages</h2>
            <p className="text-gray-600 text-lg">Special: 3 months free with 1-month subscription!</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Starter $300/mo</th>
                  <th className="px-6 py-4 text-center font-bold">Business $500/mo</th>
                  <th className="px-6 py-4 text-center font-bold">Professional $1,000/mo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ['Properties Limit', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Projects Limit', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['All Media', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['KEMEDAR® Veri Company', '✅', '✅', '✅'],
                  ['KEMEDAR® Veri Properties', '5 Props', '5 Props + 1 Proj', '10 Props + 2 Proj'],
                  ['KEMEDAR® Campaign', '1', '2', '5'],
                  ['KEMEDAR® Up Service', '1 Property', '1 Property', '1 Property + 1 Project'],
                  ['Ad Impressions', '5,000', '10,000', '25,000'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">{row[0]}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row[1]}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{row[2]}</td>
                    <td className="px-6 py-4 text-center text-gray-700 bg-orange-50 font-bold">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PAID SERVICES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Professional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Company Verification</h3>
              <p className="text-gray-600 mb-6">Certified by Kemedar® Agent tag added to your company page after review of legal and financial documents — increases buyer trust significantly</p>
              <button className="text-green-600 font-bold hover:underline">Learn More →</button>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Verification</h3>
              <p className="text-gray-600 mb-6">Verified by Kemedar® Agent tag added to specific property pages, boosting buyer confidence in your listings</p>
              <button className="text-blue-600 font-bold hover:underline">Learn More →</button>
            </div>
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-slate-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMEDAR AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Real Estate Developers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond listings — use Kemedar's AI tools to market smarter, sell faster, raise capital, and deliver a premium buying experience for your projects.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_TOOLS.map((tool, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-slate-400 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${tool.badgeColor}`}>{tool.badge}</span>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{tool.description}</p>
                <Link
                  to={tool.link}
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-bold text-sm group-hover:gap-3 transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Register Your Development on Kemedar
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-slate-900 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Register Developer Account →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}