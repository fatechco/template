import { useState } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import SubscriptionPlans from "@/components/home/SubscriptionPlans";
import PaidServicesStrip from "@/components/home/PaidServicesStrip";
import { Mail, BarChart3, Star, Send, CheckCircle } from "lucide-react";

const AD_SERVICES = [
  {
    icon: "🖼️",
    title: "Banner Ads",
    desc: "Premium banner placements across Kemedar's property search, homepage, and category pages. Reach high-intent buyers and renters at scale.",
    features: ["Homepage Hero Banner", "Search Results Top Bar", "Property Detail Sidebar", "Mobile App Banners"],
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: "⭐",
    title: "Featured Listings",
    desc: "Boost your properties to the top of search results with featured placement — guaranteed top visibility and more leads.",
    features: ["Top of Search Results", "Homepage Carousel", "Category Page Priority", "Email Newsletter Feature"],
    color: "from-[#FF6B00] to-orange-600",
  },
  {
    icon: "📧",
    title: "Email Campaigns",
    desc: "Target Kemedar's verified base of buyers, investors, and real estate professionals with curated email campaigns.",
    features: ["250,000+ Subscribers", "Targeted by Location", "Targeted by Budget", "Full Campaign Report"],
    color: "from-purple-500 to-purple-700",
  },
];

const PLANS = [
  { name: "Free", price: "$0", period: "forever", color: "border-gray-200", badge: null, features: ["1 Property Listing", "Basic Search Visibility", "Community Forum Access"] },
  { name: "Bronze", price: "$29", period: "/ month", color: "border-orange-300", badge: null, features: ["10 Property Listings", "Priority Search Placement", "Analytics Dashboard", "Email Support"] },
  { name: "Silver", price: "$79", period: "/ month", color: "border-gray-400", badge: "Most Popular", features: ["50 Property Listings", "Featured Placement", "Advanced Analytics", "Phone Support", "1 Email Campaign/mo"] },
  { name: "Gold", price: "$199", period: "/ month", color: "border-yellow-400", badge: "Best Value", features: ["Unlimited Listings", "Homepage Banner Slot", "Dedicated Account Manager", "Weekly Campaigns", "Custom Reports"] },
];

export default function Advertise() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="relative bg-[#1a1a2e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-black px-4 py-1.5 rounded-full mb-4 tracking-wider">ADVERTISE WITH KEMEDAR</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Reach Millions of<br /><span className="text-[#FF6B00]">Real Estate Buyers</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Connect your brand with over 2 million monthly active property seekers, investors, and real estate professionals across the region.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-white">
            {[["2M+", "Monthly Visitors"], ["500K+", "Property Seekers"], ["50K+", "Listings"], ["15+", "Countries"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-[#FF6B00]">{num}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SubscriptionPlans />
      <PaidServicesStrip />

      <div className="max-w-[1200px] mx-auto px-4 py-16 w-full flex-1 flex flex-col gap-20">

        {/* Ad Services */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Advertising Solutions</h2>
            <p className="text-gray-500">Choose the format that fits your marketing goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AD_SERVICES.map(s => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                <div className={`h-2 bg-gradient-to-r ${s.color}`} />
                <div className="p-6">
                  <span className="text-4xl mb-3 block">{s.icon}</span>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-2">
                    {s.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={13} className="text-[#FF6B00] flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-5 w-full py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${s.color} hover:opacity-90 transition-opacity`}>
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Subscription Plans</h2>
            <p className="text-gray-500">Flexible plans for every business size</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map(p => (
              <div key={p.name} className={`bg-white rounded-2xl border-2 ${p.color} p-5 relative hover:shadow-lg transition-all`}>
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF6B00] text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">{p.badge}</span>
                )}
                <h3 className="font-black text-gray-900 text-base mb-1">{p.name}</h3>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-3xl font-black text-[#FF6B00]">{p.price}</span>
                  <span className="text-gray-400 text-sm mb-1">{p.period}</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 rounded-xl bg-[#1a1a2e] hover:bg-[#FF6B00] text-white font-bold text-sm transition-colors">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto w-full">
          <h2 className="text-2xl font-black text-gray-900 mb-1">Get in Touch</h2>
          <p className="text-gray-500 text-sm mb-6">Tell us about your advertising needs and we'll create a custom package for you.</p>
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
              <h3 className="font-black text-gray-900 text-lg mb-1">Message Sent!</h3>
              <p className="text-gray-500 text-sm">Our advertising team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"], ["company", "Company Name", "text"]].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="text-sm font-bold text-gray-700 mb-1 block">{label}</label>
                    <input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Message</label>
                <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your goals, budget, and timeline..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-md">
                <Send size={15} /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}