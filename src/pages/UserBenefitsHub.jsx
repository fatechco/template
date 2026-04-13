import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SiteHeader from '@/components/header/SiteHeader';
import SiteFooter from '@/components/home/SiteFooter';

const ROLES = [
  { value: '', label: 'Select your role' },
  { value: 'property-seller', label: 'Property Owner / Seller' },
  { value: 'property-buyer', label: 'Property Buyer' },
  { value: 'real-estate-agent', label: 'Real Estate Agent' },
  { value: 'real-estate-developer', label: 'Real Estate Developer' },
  { value: 'investor', label: 'Real Estate Investor' },
  { value: 'franchise-owner-area', label: 'Area Franchise Owner' },
  { value: 'product-seller', label: 'Product Seller (Store)' },
  { value: 'product-buyer', label: 'Product Buyer' },
  { value: 'handyman-or-technician', label: 'Professional / Handyman' },
];

const STATS = [
  { label: '30+ Countries', icon: '🌍' },
  { label: '2.5M+ Users', icon: '👥' },
  { label: '1M+ Properties', icon: '🏠' },
  { label: '50K+ Products', icon: '🛒' },
];

const KEMEDAR_ROLES = [
  {
    id: 'property-seller',
    icon: '🏠',
    badge: 'FREE TO START',
    title: 'Property Owner / Seller',
    tagline: 'Get the Best Value for Your Property',
    description: 'Expose your property to millions of global visitors. List up to 5 properties free for 90 days and connect directly with verified buyers.',
    stats: ['5 Free Listings', '90 Days Free', '30+ Countries'],
    features: [
      'Upload 24 photos + videos per listing',
      'Direct buyer communication',
      'QR code marketing tools',
      'Seller Kanban organizer',
    ],
    gradient: 'from-orange-500 to-orange-600',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    path: '/user-benefits/property-seller',
  },
  {
    id: 'property-buyer',
    icon: '🔍',
    badge: 'COMPLETELY FREE',
    title: 'Property Buyer',
    tagline: 'Find Your Ideal Property That Suits You Perfectly',
    description: 'Search with over 110 precise criteria through hundreds of thousands of properties. Post buying requests and get tailored offers from sellers.',
    stats: ['110+ Filters', 'Free Access', '1M+ Properties'],
    features: [
      'Advanced 110+ search filters',
      'Post buying requests',
      'Buyer Kanban organizer',
      'Property comparison tool',
    ],
    gradient: 'from-blue-500 to-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    path: '/user-benefits/property-buyer',
  },
  {
    id: 'real-estate-agent',
    icon: '🤝',
    badge: 'FROM $20/MONTH',
    title: 'Real Estate Agent',
    tagline: 'The Smartest Solutions for the Smartest Agents',
    description: 'Maximize performance with comprehensive tools — list up to 1,000 properties, manage clients with CRM, and get a dedicated company site.',
    stats: ['1,000 Listings', 'CRM + ERP', 'Verified Badge'],
    features: [
      'Up to 1,000 property listings',
      'Dedicated company website',
      'Integrated CRM & ERP',
      'Project management tools',
    ],
    gradient: 'from-teal-600 to-teal-700',
    buttonColor: 'bg-teal-600 hover:bg-teal-700',
    path: '/user-benefits/real-estate-agent',
  },
  {
    id: 'real-estate-developer',
    icon: '🏗',
    badge: 'FROM $300/MONTH',
    title: 'Real Estate Developer',
    tagline: 'Successful Marketing Strategies Start Here',
    description: 'Unlimited properties and projects, dedicated project sites, verification services, campaign tools and international investor reach.',
    stats: ['Unlimited Listings', 'Project Sites', 'Campaign Tools'],
    features: [
      'Unlimited properties & projects',
      'Dedicated company + project sites',
      'KEMEDAR VERI for company included',
      'Ad impressions included',
    ],
    gradient: 'from-slate-800 to-slate-900',
    buttonColor: 'bg-slate-800 hover:bg-slate-900',
    path: '/user-benefits/real-estate-developer',
  },
  {
    id: 'investor',
    icon: '💰',
    badge: 'HIGH RETURNS',
    title: 'Real Estate Investor',
    tagline: 'Invest with Kemedar: Unlock Wealth in Global Real Estate',
    description: 'Access over $15 billion in transactions across 120+ countries. AI-driven insights, fractional ownership, REITs and expert support.',
    stats: ['12% Returns', '120+ Countries', 'AI-Powered'],
    features: [
      'AI-driven market analysis',
      'Fractional ownership options',
      'Portfolio management dashboard',
      '24/7 expert support',
    ],
    gradient: 'from-amber-600 to-amber-700',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    path: '/user-benefits/investor',
  },
  {
    id: 'franchise-owner-area',
    icon: '🗺',
    badge: 'EXCLUSIVE TERRITORY',
    title: 'Area Franchise Owner',
    tagline: 'Be the Eyes and Hands of Kemedar in Your Region',
    description: 'Become the exclusive Kemedar and Kemetro partner in your area. Share equally in all profits from services and sales within your region.',
    stats: ['Exclusive Area', 'Profit Sharing', '7 Revenue Streams'],
    features: [
      'Exclusive area representation',
      'Equal profit sharing',
      'Free unlimited listings',
      'Full admin tools + CRM + ERP',
    ],
    gradient: 'from-orange-500 to-orange-700',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    path: '/user-benefits/franchise-owner-area',
  },
];

const KEMETRO_ROLES = [
  {
    id: 'product-seller',
    icon: '🏪',
    badge: 'FREE TO START',
    title: 'Product Seller (Store)',
    tagline: 'Multiply Your Sales and Expand Your Business',
    description: 'Create your digital store in minutes and reach thousands of daily visitors. Only pay a small fee after your first $12,000 in sales.',
    stats: ['$0 to Start', '2.5M+ Buyers', '30+ Countries'],
    features: [
      'Free registration and listings',
      'Secure payment processing',
      'Shipping management',
      'Kemecoin loyalty rewards',
    ],
    gradient: 'from-blue-500 to-blue-600',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    path: '/user-benefits/product-seller',
  },
  {
    id: 'product-buyer',
    icon: '🛒',
    badge: 'FREE ACCESS',
    title: 'Product Buyer',
    tagline: 'Exceptional Shopping Experience for Home Products',
    description: 'Discover a vast array of construction, finishing and decorative products from trusted sellers across 30+ countries.',
    stats: ['50K+ Products', '20+ Payment Methods', '15+ Languages'],
    features: [
      'Compare products side-by-side',
      'Flash deals & daily offers',
      'RFQ system for bulk orders',
      'Wishlist & price alerts',
    ],
    gradient: 'from-cyan-500 to-cyan-600',
    buttonColor: 'bg-cyan-600 hover:bg-cyan-700',
    path: '/user-benefits/product-buyer',
  },
];

const KEMEWORK_ROLE = {
  id: 'handyman-or-technician',
  icon: '🔧',
  badge: 'FREE REGISTRATION',
  title: 'Professional / Handyman / Technician',
  tagline: 'Register Handyman Account',
  description: 'Join Kemework and connect with clients seeking your skills. Electricians, plumbers, painters, carpenters, interior designers and more are all welcome.',
  stats: ['Free Profile', 'Direct Clients', 'Certified Status'],
  features: [
    'Dedicated digital profile page',
    'Bid on jobs near you',
    'Become Kemedar Certified',
    'Direct financial transactions',
  ],
  gradient: 'from-teal-600 to-teal-700',
  buttonColor: 'bg-teal-600 hover:bg-teal-700',
  path: '/user-benefits/handyman-or-technician',
};

function RoleCard({ role, isKemetro = false, isKemework = false }) {
  const navigate = useNavigate();
  const gradientClass = `bg-gradient-to-r ${role.gradient}`;

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Top Gradient */}
      <div className={`h-2 ${gradientClass}`} />
      
      {/* Content */}
      <div className="p-6">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-5xl">{role.icon}</span>
          <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black rounded-full">
            {role.badge}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-black text-gray-900 mb-1">{role.title}</h3>
        <p className="text-sm text-orange-600 font-bold mb-3">{role.tagline}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{role.description}</p>

        {/* Stats Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {role.stats.map((stat, i) => (
            <span key={i} className="px-3 py-1.5 border border-orange-300 text-orange-600 text-xs font-bold rounded-full">
              {stat}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {role.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(role.path)}
          className={`w-full ${role.buttonColor} text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          See All Benefits <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default function UserBenefitsHub() {
  const [selectedRole, setSelectedRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = () => {
    if (selectedRole) {
      navigate(`/user-benefits/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M20 80 Q 50 50 80 80" stroke="white" fill="none" stroke-width="2"/%3E%3C/svg%3E")',
            backgroundSize: '100px 100px',
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 rounded-full mb-6 font-bold text-sm">
            🌟 JOIN MILLIONS OF USERS
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Choose Your Role in the Kemedar Ecosystem
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, investing, or providing services — Kemedar has a role built for you with exclusive tools and benefits designed for your success
          </p>

          {/* Role Selector */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-4">
              <span className="text-2xl">🔍</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="flex-1 py-3 focus:outline-none text-gray-700 font-semibold"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRoleSelect}
              disabled={!selectedRole}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-bold px-6 rounded-xl transition-colors"
            >
              Show My Benefits →
            </button>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="font-black text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEMEDAR SECTION */}
      <section className="py-16 bg-slate-50 border-l-8 border-orange-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              🏠 Kemedar® — Real Estate Platform
            </h2>
            <p className="text-gray-600 text-lg">
              The world's most advanced real estate super app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEMEDAR_ROLES.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* KEMETRO SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              🛒 Kemetro® — Building Materials Marketplace
            </h2>
            <p className="text-gray-600 text-lg">
              The world's only dedicated marketplace for home building and finishing products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {KEMETRO_ROLES.map((role) => (
              <RoleCard key={role.id} role={role} isKemetro />
            ))}
          </div>
        </div>
      </section>

      {/* KEMEWORK SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">
              🔧 Kemework® — Home Services Platform
            </h2>
            <p className="text-gray-600 text-lg">
              Connect professionals with homeowners who need their skills
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <RoleCard role={KEMEWORK_ROLE} isKemework />
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-2">What Each Role Gets</h2>
            <p className="text-gray-600">Compare features across all roles</p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-orange-600 text-white">
                  <th className="px-4 py-3 text-left font-bold">Feature</th>
                  <th className="px-4 py-3 text-center font-bold">Seller</th>
                  <th className="px-4 py-3 text-center font-bold">Buyer</th>
                  <th className="px-4 py-3 text-center font-bold">Agent</th>
                  <th className="px-4 py-3 text-center font-bold">Dev</th>
                  <th className="px-4 py-3 text-center font-bold">FO</th>
                  <th className="px-4 py-3 text-center font-bold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">Free Registration</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">List Properties</td>
                  <td className="px-4 py-3 text-center">✅ (5F)</td>
                  <td className="px-4 py-3 text-center">❌</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">❌</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">CRM Tools</td>
                  <td className="px-4 py-3 text-center">❌</td>
                  <td className="px-4 py-3 text-center">❌</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">❌</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">Verified Badge</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">❌</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">Mobile App</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                  <td className="px-4 py-3 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-black mb-4">
            Not Sure Which Role Is Right for You?
          </h2>
          <p className="text-lg mb-8">
            Our team can help you choose the perfect plan for your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
              Explore All Pages
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}