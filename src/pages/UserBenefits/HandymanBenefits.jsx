import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SiteHeader from '@/components/header/SiteHeader';
import SuperFooter from '@/components/layout/SuperFooter';

const SPECIALTIES = [
  { icon: '⚡', name: 'Electrician' },
  { icon: '🔩', name: 'Plumber' },
  { icon: '🎨', name: 'Painter' },
  { icon: '🪟', name: 'Tile Worker' },
  { icon: '🏠', name: 'Interior Designer' },
  { icon: '⚖️', name: 'Lawyer' },
  { icon: '🏗', name: 'Roof Worker' },
  { icon: '🪚', name: 'Carpenter' },
];

const KEMEDAR_CERTIFIED_BENEFITS = [
  { icon: '🏅', title: 'Official Accreditation', description: 'Be officially accredited by Kemedar and gain industry recognition' },
  { icon: '📦', title: 'Volume Work', description: 'Receive direct task assignments from Kemedar — never run out of work' },
  { icon: '🪪', title: 'ID Card', description: 'Obtain a Kemedar Handyman of Choice ID card for professional credibility' },
  { icon: '📚', title: 'Training Opportunities', description: 'Access training from Kemedar seniors and certified engineers' },
  { icon: '🤝', title: 'Co-operative Network', description: 'Join a supportive network of certified handymen for collaboration' },
  { icon: '💰', title: 'Training Income', description: 'Earn additional income by providing training to other professionals' },
];

const SUBSCRIPTION_PLANS = [
  { name: 'Free', services: '1 service', price: '$0' },
  { name: 'Starter', services: 'Up to 5 services', price: '$20/month' },
  { name: 'Professional', services: 'Up to 25 services', price: '$50/month' },
];

const AI_TOOLS = [
  {
    icon: '📷',
    title: 'Snap & Fix™ — AI Diagnosis',
    description: 'Receive pre-diagnosed repair jobs from clients who used Snap & Fix. Get a full AI-generated repair brief, materials list, and cost estimate before you even visit the site.',
    badge: 'More Leads',
    badgeColor: 'bg-teal-100 text-teal-700',
    link: '/kemework/snap',
    cta: 'Learn About Snap & Fix',
  },
  {
    icon: '🏅',
    title: 'Kemework Preferred Pro™',
    description: 'Get officially accredited as a Kemedar Preferred Professional. Earn a verified badge, priority task matching, and direct assignments from Kemedar — never search for clients again.',
    badge: 'Top Tier Status',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    link: '/kemework/preferred-professional-program',
    cta: 'Apply for Preferred Pro',
  },
  {
    icon: '🤖',
    title: 'AI Task Matching™',
    description: 'AI matches you to tasks that fit your exact skills, location, and availability in real time. No more browsing irrelevant jobs — only the right tasks land in your feed.',
    badge: 'Right Jobs Only',
    badgeColor: 'bg-blue-100 text-blue-700',
    link: '/kemework/find-professionals',
    cta: 'See How Matching Works',
  },
  {
    icon: '🛒',
    title: 'Kemetro Materials Access™',
    description: 'Order all materials needed for your jobs directly from Kemetro marketplace at professional pricing. Get same-day or next-day delivery to your job site.',
    badge: 'Pro Pricing',
    badgeColor: 'bg-orange-100 text-orange-700',
    link: '/kemetro',
    cta: 'Browse Materials',
  },
  {
    icon: '🎨',
    title: 'KemeKits™ — Installation Work',
    description: 'Get hired to install KemeKits design packages for homeowners. Design kit installations are pre-planned with exact BOQs — making your job faster and more profitable.',
    badge: 'Steady Work',
    badgeColor: 'bg-purple-100 text-purple-700',
    link: '/kemetro/kemekits',
    cta: 'Explore KemeKits Jobs',
  },
  {
    icon: '🏗️',
    title: 'Kemedar Finish™ — Project Work',
    description: 'Get matched to full property finishing and renovation projects through Kemedar Finish. Work on structured projects with clear milestones, guaranteed payments, and engineer supervision.',
    badge: 'Big Projects',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    link: '/kemedar/finish/landing',
    cta: 'Find Finishing Projects',
  },
  {
    icon: '⭐',
    title: 'Kemedar Score™',
    description: 'Build your professional reputation score through completed jobs and client reviews. A high Kemedar Score unlocks premium task access, higher rates, and featured placement in search.',
    badge: 'Earn More',
    badgeColor: 'bg-amber-100 text-amber-700',
    link: '/kemedar/score/landing',
    cta: 'Build My Score',
  },
  {
    icon: '🏠',
    title: 'Move-In Concierge™',
    description: 'Get assigned to move-in concierge tasks for new property owners — cleaning, minor repairs, assembly, and setup. Recurring high-frequency work from verified new tenants and buyers.',
    badge: 'Recurring Income',
    badgeColor: 'bg-lime-100 text-lime-700',
    link: '/dashboard/concierge',
    cta: 'See Concierge Tasks',
  },
  {
    icon: '🛡️',
    title: 'Kemework Guarantee™',
    description: 'Offer clients the Kemework Guarantee on your work. Guaranteed jobs pay better, rank higher, and build faster client trust — growing your reputation on the platform.',
    badge: 'Build Trust',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    link: '/kemework/find-professionals',
    cta: 'Learn About Guarantee',
  },
  {
    icon: '♻️',
    title: 'Surplus & Salvage Jobs™',
    description: 'Get hired to handle surplus material pickup, delivery, and installation from the Kemetro Surplus marketplace. A growing category of eco-friendly jobs with strong demand.',
    badge: 'New Job Type',
    badgeColor: 'bg-green-100 text-green-700',
    link: '/kemetro/surplus',
    cta: 'See Surplus Jobs',
  },
  {
    icon: '📊',
    title: 'Earnings Dashboard™',
    description: 'Track all your income, completed jobs, pending payments, and client reviews from a single dashboard. Understand your busiest periods and grow your business with data.',
    badge: 'Track Income',
    badgeColor: 'bg-slate-100 text-slate-700',
    link: '/cp/pro',
    cta: 'View My Dashboard',
  },
  {
    icon: '📚',
    title: 'Kemedar Academy™',
    description: 'Access professional training videos, certification programs, and skills upgrades through Kemedar Academy. Improve your skills, get certified, and charge higher rates.',
    badge: 'Level Up',
    badgeColor: 'bg-pink-100 text-pink-700',
    link: '/kemework/find-professionals',
    cta: 'Browse Training',
  },
];

export default function HandymanBenefits() {
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-teal-700 to-teal-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white text-sm mb-8 opacity-90">
            Home &gt; User Benefits &gt; <span className="font-bold">Professional / Handyman</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-6 font-bold text-sm">
                🔧 FOR PROFESSIONALS & HANDYMEN
              </div>
              <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                Register Handyman Account — Connect with Clients Who Need You
              </h1>
              <p className="text-xl text-white/95 mb-8">
                Kemedar through Kemework® offers an integrated system for handymen and technicians to connect with clients and manage tasks efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-teal-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Register Handyman Account →
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                  See How It Works
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Welcomed Specialities & Professions</h3>
              <div className="grid grid-cols-2 gap-4">
                {SPECIALTIES.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{spec.icon}</span>
                    <span className="text-sm font-bold text-gray-900">{spec.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4 text-center">And many more professions welcome →</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE BENEFITS TABLE */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Core Benefits of Your Kemework Account</h2>
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
                  ['Dedicated Profile Page', 'Personalized page with short address serving as digital business card'],
                  ['Showcase Portfolio', 'Display services, completed tasks and client reviews in one place'],
                  ['Direct Client Contact', 'Communicate directly with thousands of clients seeking your services'],
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

      {/* TASK CYCLE SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Two Ways to Work on Kemework</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Standard Task Cycle */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Task Cycle</h3>
              <p className="text-sm text-gray-600 font-bold mb-6">Customer → Task → Handyman</p>
              <ol className="space-y-4">
                {[
                  'Customer Lists Task',
                  'Task Categorization',
                  'Handyman Offers',
                  'Direct Communication',
                  'Task Assignment',
                  'Task Completion',
                  'Client Review',
                  'Direct Payment',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-black text-teal-600">{i + 1}.</span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Certified Handyman Cycle */}
            <div className="bg-teal-700 text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2">Certified Handyman Cycle</h3>
              <p className="text-sm font-bold mb-6 opacity-90">Customer → Task → Kemedar → Handyman</p>
              <ol className="space-y-4">
                {[
                  'Customer Assigns Task to Kemedar',
                  'Kemedar Executes Task',
                  'Kemedar Supervises via Engineers',
                  'Payments via Kemedar Contract',
                  'Receipt & Delivery per Contract',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-black">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* KEMEDAR CERTIFIED HANDYMAN */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-2">Become a Kemedar Certified Handyman</h2>
            <p className="text-gray-600">Get officially accredited through a personal interview at Kemedar headquarters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEMEDAR_CERTIFIED_BENEFITS.map((benefit, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAID SERVICES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Professional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Company Verification</h3>
              <p className="text-gray-600 mb-6">Verified by Kemedar® tag added after review of legal papers, financial status and business precedents</p>
              <button className="text-green-600 font-bold hover:underline">Learn More →</button>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-5xl mb-4">🪪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Specialist Verification</h3>
              <p className="text-gray-600 mb-6">Individual verification — identity, criminal records, drug tests and previous work history checked</p>
              <button className="text-blue-600 font-bold hover:underline">Learn More →</button>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PLANS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-12 text-center">Kemework Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 text-center hover:shadow-lg transition-all">
                <p className="text-xl font-black text-gray-900 mb-2">{plan.name}</p>
                <p className="text-sm text-gray-600 mb-4">{plan.services}</p>
                <p className="text-3xl font-black text-teal-600 mb-6">{plan.price}</p>
                <button className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI INNOVATION TOOLS */}
      <section className="py-20 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-2 bg-white/10 text-teal-300 rounded-full mb-4 font-bold text-sm tracking-wider">
              🤖 KEMEWORK AI INNOVATION SUITE
            </div>
            <h2 className="text-4xl font-black text-white mb-3">AI-Powered Tools Built for Handymen & Technicians</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Go beyond listings — use Kemedar's AI tools to get matched to the right jobs, access materials, build your reputation, and grow your professional income.</p>
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
            Start Getting More Jobs Today
          </h2>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-teal-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Register Your Handyman Account →
          </button>
        </div>
      </section>

      <SuperFooter />
    </div>
  );
}