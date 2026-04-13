import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const KEMEDAR_PLANS = [
  { tag: "FREE",   tagColor: "#9CA3AF", title: "Starter",  feature: "Add up to 3 properties",               price: "$0 / month",   buttonText: "Current Plan", buttonColor: "#9CA3AF" },
  { tag: "BRONZE", tagColor: "#92400E", title: "Bronze",   feature: "Add up to 25 properties",              price: "$100 / month", buttonText: "Subscribe",    buttonColor: "#FF6B00" },
  { tag: "SILVER", tagColor: "#64748B", title: "Silver",   feature: "Add up to 100 properties + 1 project", price: "$200 / month", buttonText: "Subscribe",    buttonColor: "#FF6B00" },
  { tag: "GOLD",   tagColor: "#D97706", title: "Gold",     feature: "Unlimited properties & projects",       price: "$350 / month", buttonText: "Subscribe",    buttonColor: "#B45309" },
];

const KEMEDAR_SERVICES = [
  { emoji: "✅", title: "KEMEDAR VERI Service",     subtitle: "Property & profile verification",  price: "From $100", buttonText: "Buy →",     buttonColor: "#10B981" },
  { emoji: "📋", title: "KEMEDAR LIST Service",     subtitle: "Professional listing by our team", price: "$50",       buttonText: "Buy →",     buttonColor: "#3B82F6" },
  { emoji: "📢", title: "KEMEDAR CAMPAIGN Service", subtitle: "Targeted marketing campaigns",      price: "Custom",    buttonText: "Request →", buttonColor: "#EF4444" },
];

const KEMEWORK_PLANS = [
  { tag: "FREE",         tagColor: "#2D6A4F", title: "Free",         feature: "Add 1 Service",         price: "$0",          buttonText: "Get Started", buttonColor: "#9CA3AF" },
  { tag: "STARTER",      tagColor: "#2D6A4F", title: "Starter",      feature: "Add up to 5 Services",  price: "$20 / month", buttonText: "Subscribe",   buttonColor: "#2D6A4F" },
  { tag: "PROFESSIONAL", tagColor: "#2D6A4F", title: "Professional", feature: "Add up to 25 Services", price: "$50 / month", buttonText: "Subscribe",   buttonColor: "#2D6A4F" },
];

const KEMETRO_PLANS = [
  { tag: "FREE",         tagColor: "#0077B6", title: "Free",         feature: "Add up to 5 products",   price: "$0 / month",   buttonText: "Current Plan", buttonColor: "#9CA3AF" },
  { tag: "BASIC",        tagColor: "#0077B6", title: "Basic",        feature: "Add up to 25 products",  price: "$30 / month",  buttonText: "Subscribe",    buttonColor: "#0077B6" },
  { tag: "PROFESSIONAL", tagColor: "#0077B6", title: "Professional", feature: "Add up to 100 products", price: "$80 / month",  buttonText: "Subscribe",    buttonColor: "#0077B6" },
  { tag: "ENTERPRISE",   tagColor: "#0077B6", title: "Enterprise",   feature: "Unlimited products",     price: "$150 / month", buttonText: "Subscribe",    buttonColor: "#0077B6" },
];

const KEMETRO_SERVICES = [
  { emoji: "🔍", title: "Buy Sourcing Service",        subtitle: "We source products for you",  price: "Custom", buttonText: "Buy →", buttonColor: "#0077B6" },
  { emoji: "📢", title: "Buy Kemetro Campaign",        subtitle: "Promote your products",        price: "Custom", buttonText: "Buy →", buttonColor: "#0077B6" },
  { emoji: "📋", title: "Buy Kemetro Listing Service", subtitle: "Professional product listing", price: "$50",    buttonText: "Buy →", buttonColor: "#0077B6" },
];

function SectionHeader({ emoji, title, subtitle, bgColor }) {
  return (
    <div className="mx-4 rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: bgColor }}>
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="font-black text-white text-base">{title}</p>
        {subtitle && <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="px-4 mb-3">
      <p className="text-base font-black text-gray-900">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function PlanScroll({ plans }) {
  return (
    <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
      {plans.map((plan, i) => (
        <div key={i} className="flex-shrink-0 w-44 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <span className="text-xs font-black" style={{ color: plan.tagColor }}>{plan.tag}</span>
          <p className="font-black text-gray-900 text-base mt-1">{plan.price}</p>
          <p className="text-xs text-gray-500 mt-1 leading-tight">{plan.feature}</p>
          <button
            className="w-full mt-3 text-white text-xs font-bold py-2 rounded-lg transition-opacity active:opacity-80"
            style={{ backgroundColor: plan.buttonColor }}
          >
            {plan.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}

function ServiceList({ services }) {
  return (
    <div className="px-4 space-y-3">
      {services.map((svc, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">{svc.emoji}</span>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-sm">{svc.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{svc.subtitle}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-bold text-gray-900">{svc.price}</p>
            <button className="text-xs font-bold mt-1" style={{ color: svc.buttonColor }}>{svc.buttonText}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function KemecoinBanner() {
  return (
    <div className="mx-4 bg-white rounded-2xl border-2 border-orange-500 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-sm font-black text-gray-900">Earn Kemecoin rewards on every purchase</p>
          <p className="text-xs text-gray-500 mt-1">$3 spent = 1 Kemecoin | Redeem for cash</p>
          <button className="text-xs font-bold text-orange-600 mt-2">Learn More →</button>
        </div>
      </div>
    </div>
  );
}

function KemedarSection() {
  return (
    <div className="space-y-4">
      <SectionHeader emoji="🏠" title="Kemedar®" subtitle="Real estate platform services" bgColor="#FF6B00" />
      <SectionTitle title="Kemedar Subscriptions" subtitle="Choose your listing plan" />
      <PlanScroll plans={KEMEDAR_PLANS} />
      <SectionTitle title="Kemedar Services" />
      <ServiceList services={KEMEDAR_SERVICES} />
      <KemecoinBanner />
    </div>
  );
}

function KemeworkSection() {
  return (
    <div className="space-y-4">
      <SectionHeader emoji="🔧" title="Kemework®" subtitle="Home services platform" bgColor="#2D6A4F" />
      <SectionTitle title="Kemework Subscriptions" subtitle="For service providers" />
      <PlanScroll plans={KEMEWORK_PLANS} />
      <SectionTitle title="Kemework Services" />
      <div className="mx-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl" style={{ backgroundColor: "#2D6A4F22" }}>🔧</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Assign Us for Your Task</p>
            <p className="text-xs text-gray-500 mt-1 leading-tight">Let Kemedar handle your task end-to-end with our vetted professionals</p>
            <p className="text-xs font-bold text-gray-900 mt-2">Custom based on task</p>
          </div>
        </div>
        <button className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-opacity active:opacity-80" style={{ backgroundColor: "#2D6A4F" }}>
          Request Service →
        </button>
      </div>
      <KemecoinBanner />
    </div>
  );
}

function KemetroSection() {
  return (
    <div className="space-y-4">
      <SectionHeader emoji="🛒" title="Kemetro®" subtitle="Marketplace services" bgColor="#0077B6" />
      <SectionTitle title="Kemetro Subscriptions" />
      <PlanScroll plans={KEMETRO_PLANS} />
      <SectionTitle title="Kemetro Services" />
      <ServiceList services={KEMETRO_SERVICES} />
      <KemecoinBanner />
    </div>
  );
}

const TABS = [
  { id: "kemedar",  label: "🏠 Kemedar",  activeBg: "bg-orange-500" },
  { id: "kemework", label: "🔧 Kemework", activeBg: "bg-teal-600" },
  { id: "kemetro",  label: "📦 Kemetro",  activeBg: "bg-blue-600" },
];

export default function MobileBuyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("kemedar");

  return (
    <div className="min-h-full bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 flex items-center justify-between" style={{ minHeight: 56 }}>
        <h1 className="font-black text-gray-900 text-base">Buy & Subscribe</h1>
        <button onClick={() => navigate("/m")} className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <X size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-3">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-t-xl text-sm font-black transition-all ${
                activeTab === tab.id
                  ? `${tab.activeBg} text-white shadow-sm`
                  : `text-gray-500 hover:text-gray-700`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 pb-8 space-y-6">
        {activeTab === "kemedar"  && <KemedarSection />}
        {activeTab === "kemework" && <KemeworkSection />}
        {activeTab === "kemetro"  && <KemetroSection />}
      </div>
    </div>
  );
}