import { useState } from "react";
import { CheckCircle, Send, Zap, Star, Shield, Crown } from "lucide-react";

// ── DATA ─────────────────────────────────────────────────────────────

const KEMEDAR_PLANS = [
  { tag: "FREE",   title: "Starter",  feature: "Add up to 3 properties",               price: "$0",    period: "/month", current: true,  color: "border-gray-200",  accent: "#9CA3AF", features: ["3 property listings", "Basic search visibility", "Standard support"] },
  { tag: "BRONZE", title: "Bronze",   feature: "Add up to 25 properties",              price: "$100",  period: "/month", current: false, color: "border-orange-300", accent: "#FF6B00", features: ["25 property listings", "Priority placement", "Analytics dashboard", "Email support"] },
  { tag: "SILVER", title: "Silver",   feature: "Add up to 100 properties + 1 project", price: "$200",  period: "/month", current: false, color: "border-gray-400",  accent: "#64748B", features: ["100 properties + 1 project", "Featured placement", "Advanced analytics", "Phone support", "1 campaign/mo"], popular: true },
  { tag: "GOLD",   title: "Gold",     feature: "Unlimited properties & projects",       price: "$350",  period: "/month", current: false, color: "border-yellow-400", accent: "#D97706", features: ["Unlimited listings", "Homepage banner slot", "Dedicated account manager", "Weekly campaigns", "Custom reports"], best: true },
];

const KEMEDAR_SERVICES = [
  { emoji: "✅", title: "KEMEDAR VERI",     subtitle: "Property & profile verification — builds trust with buyers",        price: "From $100", color: "#10B981", bg: "bg-green-50" },
  { emoji: "📋", title: "KEMEDAR LIST",     subtitle: "Let our professional team handle your listing photography & copy", price: "$50",       color: "#3B82F6", bg: "bg-blue-50" },
  { emoji: "🚀", title: "KEMEDAR UP",       subtitle: "Boost your listing to the top of search results for 30 days",      price: "$30",       color: "#FF6B00", bg: "bg-orange-50" },
  { emoji: "🔑", title: "KEMEDAR KEY",      subtitle: "Featured placement on homepage carousel for maximum exposure",     price: "$80",       color: "#D97706", bg: "bg-amber-50" },
  { emoji: "📢", title: "KEMEDAR CAMPAIGN", subtitle: "Targeted marketing campaigns across social & email channels",      price: "Custom",    color: "#EF4444", bg: "bg-red-50" },
];

const KEMETRO_PLANS = [
  { tag: "FREE",         title: "Free",         price: "$0",    period: "/month", accent: "#9CA3AF", features: ["5 product listings", "Standard visibility", "Basic support"], current: true },
  { tag: "BASIC",        title: "Basic",        price: "$30",   period: "/month", accent: "#0077B6", features: ["25 product listings", "Priority search placement", "Sales analytics"] },
  { tag: "PROFESSIONAL", title: "Professional", price: "$80",   period: "/month", accent: "#0055A4", features: ["100 product listings", "Featured store badge", "Promotions tools", "Priority support"], popular: true },
  { tag: "ENTERPRISE",   title: "Enterprise",   price: "$150",  period: "/month", accent: "#003F7F", features: ["Unlimited listings", "Homepage feature", "Dedicated manager", "Custom campaigns"], best: true },
];

const KEMETRO_SERVICES = [
  { emoji: "🔍", title: "Product Sourcing",       subtitle: "We source and find products for your specific needs",       price: "Custom", color: "#0077B6", bg: "bg-blue-50" },
  { emoji: "📢", title: "Kemetro Campaign",        subtitle: "Promote your store across the Kemetro platform",           price: "Custom", color: "#0077B6", bg: "bg-blue-50" },
  { emoji: "📋", title: "Kemetro Listing Service", subtitle: "Professional product listing by our in-house team",       price: "$50",    color: "#0077B6", bg: "bg-blue-50" },
];

const KEMEWORK_PLANS = [
  { tag: "FREE",         title: "Free",         price: "$0",   period: "/month", accent: "#9CA3AF", features: ["1 service listing", "Standard visibility", "Community support"], current: true },
  { tag: "STARTER",      title: "Starter",      price: "$20",  period: "/month", accent: "#2D6A4F", features: ["5 service listings", "Priority ranking", "Badge on profile"] },
  { tag: "PROFESSIONAL", title: "Professional", price: "$50",  period: "/month", accent: "#1A5C40", features: ["25 service listings", "Verified Pro badge", "Featured placement", "Analytics"], popular: true },
];

const KEMEWORK_SERVICES = [
  { emoji: "🔧", title: "Assign Task to Our Team",    subtitle: "Let Kemedar manage your task end-to-end with vetted professionals", price: "Custom", color: "#2D6A4F", bg: "bg-emerald-50" },
  { emoji: "🏆", title: "Preferred Professional",     subtitle: "Get the exclusive Preferred Professional accreditation badge",      price: "$99/yr",  color: "#2D6A4F", bg: "bg-emerald-50" },
];

const MODULES = [
  { key: "all",      label: "All Services", icon: "💎" },
  { key: "kemedar",  label: "🏠 Kemedar",   icon: "🏠" },
  { key: "kemetro",  label: "🛒 Kemetro",   icon: "🛒" },
  { key: "kemework", label: "🔧 Kemework",  icon: "🔧" },
];

// ── COMPONENTS ────────────────────────────────────────────────────────

function ModuleHeader({ emoji, title, subtitle, color }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: color + "22" }}>
        {emoji}
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  return (
    <div className={`relative bg-white rounded-2xl border-2 ${plan.color || "border-gray-200"} p-5 flex flex-col hover:shadow-lg transition-all`}>
      {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">⭐ Most Popular</span>}
      {plan.best && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap">🏆 Best Value</span>}
      <span className="text-xs font-black mb-1" style={{ color: plan.accent }}>{plan.tag}</span>
      <p className="font-black text-gray-900 text-lg">{plan.title}</p>
      <div className="flex items-end gap-1 my-2">
        <span className="text-3xl font-black" style={{ color: plan.accent }}>{plan.price}</span>
        <span className="text-gray-400 text-sm mb-1">{plan.period}</span>
      </div>
      <ul className="space-y-1.5 mb-5 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
            <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${plan.current ? "bg-gray-100 text-gray-400 cursor-default" : "text-white hover:opacity-90"}`}
        style={plan.current ? {} : { backgroundColor: plan.accent }}
      >
        {plan.current ? "Current Plan" : "Subscribe →"}
      </button>
    </div>
  );
}

function ServiceCard({ svc }) {
  return (
    <div className={`${svc.bg} rounded-2xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-md transition-all`}>
      <span className="text-3xl flex-shrink-0">{svc.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-900 text-sm">{svc.title}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{svc.subtitle}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-black" style={{ color: svc.color }}>{svc.price}</p>
        <button className="text-xs font-bold mt-2 px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-80" style={{ backgroundColor: svc.color }}>
          Buy →
        </button>
      </div>
    </div>
  );
}

function KemecoinBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 flex items-center gap-4 text-white mt-6">
      <span className="text-4xl">🪙</span>
      <div>
        <p className="font-black text-base">Earn Kemecoin Rewards on Every Purchase</p>
        <p className="text-sm text-white/80 mt-0.5">$3 spent = 1 Kemecoin · Redeem for cash discounts on future orders</p>
      </div>
      <button className="ml-auto flex-shrink-0 bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors">
        Learn More
      </button>
    </div>
  );
}

function KemedarBlock() {
  return (
    <section className="space-y-6">
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
      <ModuleHeader emoji="🏠" title="Kemedar® — Real Estate Platform" subtitle="Subscription plans & paid services for property professionals" color="#FF6B00" />
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Crown size={16} className="text-orange-500" /> Subscription Plans</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KEMEDAR_PLANS.map((p, i) => <PlanCard key={i} plan={p} />)}
        </div>
      </div>
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Zap size={16} className="text-orange-500" /> Paid Services (One-time or Recurring)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEMEDAR_SERVICES.map((s, i) => <ServiceCard key={i} svc={s} />)}
        </div>
      </div>
      <KemecoinBanner />
    </section>
  );
}

function KemetroBlock() {
  return (
    <section className="space-y-6">
      <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
      <ModuleHeader emoji="🛒" title="Kemetro® — Marketplace" subtitle="Plans & services for sellers and buyers on Kemetro" color="#0077B6" />
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Crown size={16} className="text-blue-600" /> Subscription Plans</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KEMETRO_PLANS.map((p, i) => <PlanCard key={i} plan={{ ...p, color: p.color || "border-blue-200" }} />)}
        </div>
      </div>
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Zap size={16} className="text-blue-600" /> Paid Services</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEMETRO_SERVICES.map((s, i) => <ServiceCard key={i} svc={s} />)}
        </div>
      </div>
      <KemecoinBanner />
    </section>
  );
}

function KemeworkBlock() {
  return (
    <section className="space-y-6">
      <div className="h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" />
      <ModuleHeader emoji="🔧" title="Kemework® — Home Services Platform" subtitle="Plans & services for professionals and service companies" color="#2D6A4F" />
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Crown size={16} className="text-emerald-600" /> Subscription Plans</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {KEMEWORK_PLANS.map((p, i) => <PlanCard key={i} plan={{ ...p, color: "border-emerald-200" }} />)}
        </div>
      </div>
      <div>
        <p className="font-black text-gray-700 mb-4 flex items-center gap-2"><Zap size={16} className="text-emerald-600" /> Paid Services</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {KEMEWORK_SERVICES.map((s, i) => <ServiceCard key={i} svc={s} />)}
        </div>
      </div>
      <KemecoinBanner />
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────

export default function PremiumServices() {
  const [activeModule, setActiveModule] = useState("all");

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-black text-yellow-400 uppercase tracking-wider">Premium Services</span>
            </div>
            <h1 className="text-2xl font-black mb-1">Subscriptions & Paid Services</h1>
            <p className="text-gray-300 text-sm max-w-xl">Unlock the full potential of Kemedar, Kemetro & Kemework. Choose a plan or buy a one-time service to grow your business.</p>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-center flex-shrink-0">
            {[["3", "Platforms"], ["14+", "Services"], ["🪙", "Kemecoin"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-2xl font-black text-orange-400">{val}</p>
                <p className="text-xs text-gray-400">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Module filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {MODULES.map(m => (
          <button key={m.key} onClick={() => setActiveModule(m.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
              activeModule === m.key
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {(activeModule === "all" || activeModule === "kemedar")  && <KemedarBlock />}
        {(activeModule === "all" || activeModule === "kemetro")  && <KemetroBlock />}
        {(activeModule === "all" || activeModule === "kemework") && <KemeworkBlock />}
      </div>

      {/* Contact CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-gray-900 text-base mb-1">Need a custom package?</p>
          <p className="text-sm text-gray-500">Our team can create a tailored plan that fits your exact business needs.</p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors">
          <Send size={15} /> Contact Us
        </button>
      </div>
    </div>
  );
}