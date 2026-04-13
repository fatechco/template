import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const BENEFITS_CARDS = [
  { icon: '🌍', title: 'Global Reach', description: 'Expose your property to millions of verified buyers and tenants across 30+ countries from a single listing' },
  { icon: '🆓', title: 'Free to Start', description: 'List up to 5 properties for 90 days completely free. No credit card or upfront payment required' },
  { icon: '📸', title: 'Rich Media Support', description: 'Upload up to 24 images, YouTube videos, brochures and floor plans for each property listing' },
  { icon: '⚡', title: 'List in 5 Minutes', description: 'Our intuitive 7-step form guides you through adding every detail of your property in under 5 minutes' },
  { icon: '📊', title: 'Seller Dashboard', description: 'Full dashboard to manage all your properties, track views, contacts and manage buyer inquiries in one place' },
  { icon: '📋', title: 'Seller Kanban Organizer', description: 'Track every potential buyer from first contact to closed deal using our unique visual pipeline board' },
  { icon: '🔍', title: 'Buy Request Matching', description: 'Get matched with buyers actively searching for properties like yours — no advertising needed' },
  { icon: '📱', title: 'QR Code Marketing', description: 'Generate QR codes for your property links to facilitate easy sharing and offline marketing' },
  { icon: '💹', title: 'Market Price Index', description: 'Access the Kemedar Price Index for real-time property valuation based on region and finishing quality' },
  { icon: '🔧', title: 'Handyman Network Access', description: 'Post finishing tasks and receive competitive offers from verified professionals in your area' },
  { icon: '🛒', title: 'Kemetro Marketplace', description: 'Search and purchase building and finishing products from thousands of suppliers on Kemetro' },
  { icon: '📱', title: 'Mobile App (PWA)', description: 'Manage your listings, respond to buyers and track views from the Kemedar mobile app anywhere' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Create Account', description: 'Register free in 2 minutes — no credit card needed' },
  { step: 2, title: 'Add Your Property', description: 'Complete our 7-step guided form in under 5 minutes' },
  { step: 3, title: 'Get Contacted by Buyers', description: 'Buyers contact you directly via phone, WhatsApp or chat' },
  { step: 4, title: 'Close the Deal', description: 'Use our Kanban organizer and tools to track and close deals' },
];

const SERVICES = [
  {
    icon: '📋',
    title: 'KEMEDAR® List Service',
    description: 'A Kemedar representative visits your property, takes professional photos and adds all details to create the best property page with complete professional information.',
    price: '$50',
    buttonText: 'Buy This Service',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
  {
    icon: '🔑',
    title: 'Key with KEMEDAR® Service',
    description: 'A Kemedar representative holds the key to your property and accompanies potential buyers during inspections — saving you time while maximizing showings.',
    price: 'Custom',
    buttonText: 'Request Service',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
  },
  {
    icon: '📢',
    title: 'KEMEDAR® Promo Service',
    description: 'Customized marketing and promotion campaigns leveraging Kemedar\'s extensive buyer database via Email, WhatsApp, SMS and social media channels.',
    price: 'Custom Offer',
    buttonText: 'Request Campaign',
    buttonColor: 'bg-red-600 hover:bg-red-700',
  },
];

const AI_TOOLS = [
  {
    icon: '🔐',
    title: 'Verify Pro™',
    description: 'Get your property officially verified by a Kemedar inspector. Verified properties appear higher in search, attract more serious buyers, and sell faster at better prices.',
    badge: 'Boost Trust',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/verify/my-property',
    cta: 'Verify My Property',
  },
  {
    icon: '👁️',
    title: 'Vision™ — Photo AI',
    description: 'AI analyzes your listing photos and gives you a quality score, detects issues, labels rooms, and suggests virtual staging improvements to attract more buyers.',
    badge: 'Better Listings',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemedar/vision/landing',
    cta: 'Analyze My Photos',
  },
  {
    icon: '📊',
    title: 'Predict™ — Price Forecast',
    description: 'AI-powered price prediction for your area. Know the current market value and 6–36 month price trajectory so you can choose the best time to sell at peak value.',
    badge: 'Price Smarter',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemedar/predict/landing',
    cta: 'Get Price Forecast',
  },
  {
    icon: '🤝',
    title: 'Negotiate™ — Deal Coach',
    description: 'AI generates a data-driven negotiation strategy for your property. Know your recommended asking price, optimal concession range, and the right walk-away point.',
    badge: 'Sell Better',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemedar/negotiate/landing',
    cta: 'Get Negotiation Strategy',
  },
  {
    icon: '🔨',
    title: 'KemedarBid™ — Auction',
    description: 'List your property in a live competitive auction. Set a reserve price and let buyers compete — often resulting in a sale price above market value within days.',
    badge: 'Sell Fast',
    badgeColor: 'bg-red-100 text-red-700',
    link: '/auctions',
    cta: 'Auction My Property',
  },
  {
    icon: '🔄',
    title: 'Kemedar Swap™',
    description: 'Want to upgrade or relocate? AI matches your property with owners who want to swap. Exchange properties directly, with or without a cash top-up, via our secure platform.',
    badge: 'Smart Exchange',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/dashboard/swap',
    cta: 'Explore Swap',
  },
  {
    icon: '🏦',
    title: 'Kemedar Escrow™',
    description: 'Secure your sale with our built-in escrow service. Funds are held safely until all conditions are met and title is transferred — protecting both you and the buyer.',
    badge: 'Secure Deal',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemedar/escrow/landing',
    cta: 'Use Escrow',
  },
  {
    icon: '🏗️',
    title: 'Finish™ — Renovation AI',
    description: 'Thinking of renovating before selling? Get an AI-generated BOQ and renovation plan, find verified contractors, and track progress — all to maximize your sale price.',
    badge: 'Increase Value',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemedar/finish/landing',
    cta: 'Plan Renovation',
  },
  {
    icon: '🎥',
    title: 'Kemedar Twin™ — Virtual Tours',
    description: 'Host live or recorded virtual tours directly from your listing page. Let buyers explore every room remotely and reduce wasted in-person viewings.',
    badge: 'More Showings',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemedar/twin/landing',
    cta: 'Create Virtual Tour',
  },
  {
    icon: '⭐',
    title: 'Kemedar Score™',
    description: 'Build your seller trust score on the platform. A high Kemedar Score signals reliability to buyers and can dramatically increase inquiries and closing rates.',
    badge: 'Build Credibility',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/score/landing',
    cta: 'View My Score',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ahmed Hassan',
    location: 'Cairo, Egypt',
    rating: 5,
    quote: 'Sold my property in just 2 weeks! The Kemedar platform made it so easy and the buyers found me directly.',
  },
  {
    name: 'Fatima Al-Zahra',
    location: 'Dubai, UAE',
    rating: 5,
    quote: 'Best price I got was through a buyer who contacted me on Kemedar. The Kanban organizer saved me hours of work.',
  },
  {
    name: 'Muhammad Ali',
    location: 'Amman, Jordan',
    rating: 5,
    quote: 'Free listing for 90 days was perfect. Got multiple offers and negotiated the best deal for my property.',
  },
];

export default function PropertySellerBenefits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Property Seller</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🏠 FOR PROPERTY OWNERS & SELLERS
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Get the Best Value Price for Your Property
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Kemedar offers property sellers an unparalleled platform to showcase their properties to millions of global visitors. List your property in less than 5 minutes and connect directly with potential buyers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  List Your Property Free →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  See Our Plans
                </button>
              </div>
            </div>

            {/* Right Floating Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Why Owners Choose Kemedar</h3>
              <div className="space-y-4 mb-8">
                {[
                  'List up to 5 properties FREE for 90 days',
                  'Upload 24 photos + videos per listing',
                  'Direct communication with buyers',
                  'QR code marketing tools',
                  'Seller Kanban organizer dashboard',
                  'Access to handymen & technicians',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold flex-shrink-0">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Start Listing Free →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-96 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl flex items-center justify-center text-6xl">
              🏠
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                The Smartest Way to Sell Your Property
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Kemedar is designed for ease of use, allowing you to list your property in less than 5 minutes and connect directly with potential buyers, ensuring you get the best possible price. Beyond selling, you can also access a network of handymen and technicians to finalize any property-related tasks efficiently and cost-effectively.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-orange-600">30+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-orange-600">2.5M+</div>
                  <div className="text-sm text-gray-600">Buyers</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-orange-600">5</div>
                  <div className="text-sm text-gray-600">Free Listings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY ADVANTAGES TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Key Advantages for Property Sellers</h2>
            <p className="text-gray-600">Everything you need to sell faster and at the best price</p>
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
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Global Reach</td>
                  <td className="px-6 py-4 text-gray-700">Expose your property to millions of visitors worldwide</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Direct Communication</td>
                  <td className="px-6 py-4 text-gray-700">Communicate directly with buyers, tenants, and marketers</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Free Listing</td>
                  <td className="px-6 py-4 text-gray-700">List up to 5 properties for 90 days at no cost</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Rich Media Uploads</td>
                  <td className="px-6 py-4 text-gray-700">Upload up to 24 images, videos, brochures, and floor plans per unit</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Professional Presentation</td>
                  <td className="px-6 py-4 text-gray-700">Showcase your property with distinctive design and AI content generation tools</td>
                </tr>
                <tr className="hover:bg-white">
                  <td className="px-6 py-4 font-semibold text-gray-900">Account Management</td>
                  <td className="px-6 py-4 text-gray-700">Comprehensive control panel for managing contacts, communications, and listings</td>
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
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange-300 transition-all">
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
                <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
                  <div className="text-5xl font-black text-orange-600 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-orange-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFESSIONAL SERVICES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Professional Services for Enhanced Selling</h2>
            <p className="text-gray-600">Paid services provided by Kemedar representatives to maximize your property's value</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.description}</p>
                <div className="mb-6">
                  <div className="text-3xl font-black text-orange-600">{service.price}</div>
                </div>
                <button className={`w-full ${service.buttonColor} text-white font-bold py-3 rounded-lg transition-colors`}>
                  {service.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">What Our Sellers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="font-bold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </div>
            ))}
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
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Property Sellers</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond listing — use Kemedar's proprietary AI tools to price smarter, present better, negotiate stronger, and close faster.</p>
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
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Ready to Get the Best Price for Your Property?
          </h2>
          <p className="text-lg mb-8">
            List Your Property Free Today — No Credit Card Needed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              List Your Property Free →
            </button>
            <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              See All Subscription Plans
            </button>
          </div>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}