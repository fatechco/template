import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import SectionHeaderCard from "@/components/mobile/buy/SectionHeaderCard";
import PlanCard from "@/components/mobile/buy/PlanCard";
import ServiceCard from "@/components/mobile/buy/ServiceCard";

const KEMEDAR_PLANS = [
  {
    tag: "FREE",
    tagColor: "#9CA3AF",
    title: "Starter",
    feature: "Add up to 3 properties",
    price: "$0 / month",
    buttonText: "Current Plan",
    buttonColor: "#9CA3AF",
  },
  {
    tag: "BRONZE",
    tagColor: "#92400E",
    title: "Bronze",
    feature: "Add up to 25 properties",
    price: "$100 / month",
    buttonText: "Subscribe",
    buttonColor: "#FF6B00",
  },
  {
    tag: "SILVER",
    tagColor: "#64748B",
    title: "Silver",
    feature: "Add up to 100 properties + 1 project",
    price: "$200 / month",
    buttonText: "Subscribe",
    buttonColor: "#FF6B00",
  },
  {
    tag: "GOLD",
    tagColor: "#D97706",
    title: "Gold",
    feature: "Unlimited properties & projects",
    price: "$350 / month",
    buttonText: "Subscribe",
    buttonColor: "#B45309",
  },
];

const KEMEDAR_SERVICES = [
  {
    emoji: "✅",
    title: "KEMEDAR VERI Service",
    subtitle: "Property & profile verification",
    price: "From $100",
    buttonText: "Buy →",
    buttonColor: "#10B981",
  },
  {
    emoji: "📋",
    title: "KEMEDAR LIST Service",
    subtitle: "Professional listing by our team",
    price: "$50",
    buttonText: "Buy →",
    buttonColor: "#3B82F6",
  },
  {
    emoji: "📢",
    title: "KEMEDAR CAMPAIGN Service",
    subtitle: "Targeted marketing campaigns",
    price: "Custom",
    buttonText: "Request →",
    buttonColor: "#EF4444",
  },
];

const KEMETRO_PLANS = [
  {
    tag: "FREE",
    tagColor: "#0077B6",
    title: "Free",
    feature: "Add up to 5 products",
    price: "$0 / month",
    buttonText: "Current Plan",
    buttonColor: "#9CA3AF",
  },
  {
    tag: "BASIC",
    tagColor: "#0077B6",
    title: "Basic",
    feature: "Add up to 25 products",
    price: "$30 / month",
    buttonText: "Subscribe",
    buttonColor: "#0077B6",
  },
  {
    tag: "PROFESSIONAL",
    tagColor: "#0077B6",
    title: "Professional",
    feature: "Add up to 100 products",
    price: "$80 / month",
    buttonText: "Subscribe",
    buttonColor: "#0077B6",
  },
  {
    tag: "ENTERPRISE",
    tagColor: "#0077B6",
    title: "Enterprise",
    feature: "Unlimited products",
    price: "$150 / month",
    buttonText: "Subscribe",
    buttonColor: "#0077B6",
  },
];

const KEMETRO_SERVICES = [
  {
    emoji: "🔍",
    title: "Buy Sourcing Service",
    subtitle: "We source products for you",
    price: "Custom",
    buttonText: "Buy →",
    buttonColor: "#0077B6",
  },
  {
    emoji: "📢",
    title: "Buy Kemetro Campaign",
    subtitle: "Promote your products",
    price: "Custom",
    buttonText: "Buy →",
    buttonColor: "#0077B6",
  },
  {
    emoji: "📋",
    title: "Buy Kemetro Listing Service",
    subtitle: "Professional product listing",
    price: "$50",
    buttonText: "Buy →",
    buttonColor: "#0077B6",
  },
];

const KEMEWORK_PLANS = [
  {
    tag: "FREE",
    tagColor: "#2D6A4F",
    title: "Free",
    feature: "Add 1 Service",
    price: "$0",
    buttonText: "Get Started",
    buttonColor: "#9CA3AF",
    subtext: "Perfect to start",
  },
  {
    tag: "STARTER",
    tagColor: "#2D6A4F",
    title: "Starter",
    feature: "Add up to 5 Services",
    price: "$20 / month",
    buttonText: "Subscribe",
    buttonColor: "#2D6A4F",
  },
  {
    tag: "PROFESSIONAL",
    tagColor: "#2D6A4F",
    title: "Professional",
    feature: "Add up to 25 Services",
    price: "$50 / month",
    buttonText: "Subscribe",
    buttonColor: "#2D6A4F",
  },
];

function SectionTitle({ title, subtitle }) {
  return (
    <div className="px-4 mb-3">
      <p className="text-base font-black text-[#1F2937]">{title}</p>
      {subtitle && <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>}
    </div>
  );
}

function HorizontalPlanScroll({ plans }) {
  return (
    <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
      {plans.map((plan, i) => (
        <PlanCard
          key={i}
          {...plan}
          buttonAction={() => console.log(`Subscribe to ${plan.title}`)}
        />
      ))}
    </div>
  );
}

export default function MobileBuy() {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      {/* Top app bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3">
        <p className="text-lg font-black text-[#1F2937]">Buy & Subscribe</p>
      </div>

      {/* Content */}
      <div className="pt-4 pb-24 space-y-6">
        {/* ===== KEMEDAR SECTION ===== */}
        <div className="space-y-4">
          <SectionHeaderCard
            emoji="🏠"
            title="Kemedar®"
            subtitle="Real estate platform services"
            bgColor="#FF6B00"
          />

          <SectionTitle title="Kemedar Subscriptions" subtitle="Choose your listing plan" />
          <HorizontalPlanScroll plans={KEMEDAR_PLANS} />

          <SectionTitle title="Kemedar Services" />
          <div className="space-y-3">
            {KEMEDAR_SERVICES.map((svc, i) => (
              <ServiceCard
                key={i}
                {...svc}
                buttonAction={() => console.log(`Buy ${svc.title}`)}
              />
            ))}
          </div>
        </div>

        {/* ===== KEMETRO SECTION ===== */}
        <div className="space-y-4">
          <SectionHeaderCard
            emoji="🛒"
            title="Kemetro®"
            subtitle="Marketplace services"
            bgColor="#0077B6"
          />

          <SectionTitle title="Kemetro Subscriptions" />
          <HorizontalPlanScroll plans={KEMETRO_PLANS} />

          <SectionTitle title="Kemetro Services" />
          <div className="space-y-3">
            {KEMETRO_SERVICES.map((svc, i) => (
              <ServiceCard
                key={i}
                {...svc}
                buttonAction={() => console.log(`Buy ${svc.title}`)}
              />
            ))}
          </div>
        </div>

        {/* ===== KEMEWORK SECTION ===== */}
        <div className="space-y-4">
          <SectionHeaderCard
            emoji="🔧"
            title="Kemework®"
            subtitle="Home services platform"
            bgColor="#2D6A4F"
          />

          <SectionTitle title="Kemework Subscriptions" subtitle="For service providers" />
          <HorizontalPlanScroll plans={KEMEWORK_PLANS} />

          <SectionTitle title="Kemework Services" />
          <div className="mx-4 bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#2D6A4F]/20 flex items-center justify-center flex-shrink-0 text-xl">
                🔧
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1F2937]">Assign Us for Your Task</p>
                <p className="text-xs text-[#6B7280] mt-1 leading-tight">
                  Let Kemedar handle your task end-to-end with our vetted professionals
                </p>
                <p className="text-xs font-bold text-[#1F2937] mt-2">Custom based on task</p>
              </div>
            </div>
            <button
              onClick={() => console.log("Request service")}
              className="w-full text-white font-bold py-2.5 rounded-lg text-sm transition-opacity active:opacity-80"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              Request Service →
            </button>
          </div>
        </div>

        {/* ===== KEMECOIN CTA ===== */}
        <div className="mx-4 bg-white rounded-2xl border-2 border-[#FF6B00] p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-0.5">🪙</div>
            <div className="flex-1">
              <p className="text-sm font-black text-[#1F2937]">
                Earn Kemecoin rewards on every purchase
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                $3 spent = 1 Kemecoin | Redeem for cash
              </p>
              <button className="text-xs font-bold text-[#FF6B00] mt-2">
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}