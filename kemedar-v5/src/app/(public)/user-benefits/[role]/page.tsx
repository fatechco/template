import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const roleBenefits: Record<string, { title: string; subtitle: string; benefits: string[]; cta: { label: string; href: string } }> = {
  "property-seller": {
    title: "Property Sellers",
    subtitle: "Sell your property faster with AI-powered tools",
    benefits: ["Free property listings with photos & video", "AI-powered pricing suggestions", "Kemedar Score for trust", "Access to verified buyers", "Escrow protection for safe deals", "Analytics dashboard"],
    cta: { label: "List a Property", href: "/create-property" },
  },
  "property-buyer": {
    title: "Property Buyers",
    subtitle: "Find your dream home with smart search",
    benefits: ["AI-powered property matching", "Life Score for neighborhoods", "Compare properties side by side", "Escrow protection", "Mortgage calculator", "Buy request broadcasting"],
    cta: { label: "Search Properties", href: "/search/properties" },
  },
  "real-estate-agent": {
    title: "Real Estate Agents",
    subtitle: "Grow your business with Kemedar",
    benefits: ["Professional profile page", "Lead generation tools", "CRM integration", "Commission tracking", "Client management", "Performance analytics"],
    cta: { label: "Join as Agent", href: "/register" },
  },
  "real-estate-developer": {
    title: "Real Estate Developers",
    subtitle: "Showcase your projects to thousands",
    benefits: ["Project listing with units", "Eco Score certification", "Developer profile page", "Lead tracking", "Construction progress updates", "Investor connections"],
    cta: { label: "Add a Project", href: "/create-project" },
  },
  "investor": {
    title: "Investors",
    subtitle: "Smart property investment tools",
    benefits: ["KemeFrac fractional ownership", "ROI calculators", "Market analytics", "Portfolio tracking", "Auction access", "Investment advisory"],
    cta: { label: "Explore KemeFrac", href: "/kemefrac" },
  },
  "handyman": {
    title: "Handymen & Professionals",
    subtitle: "Get hired for home services",
    benefits: ["Professional profile", "Job matching", "Rating system", "Payment protection", "Skill verification", "Snap & Fix leads"],
    cta: { label: "Join Kemework", href: "/kemework" },
  },
  "product-seller": {
    title: "Product Sellers",
    subtitle: "Sell building materials online",
    benefits: ["Online storefront", "Order management", "Shipping integration", "Flash deal promotions", "KemeKit bundles", "Surplus marketplace"],
    cta: { label: "Start Selling", href: "/kemetro/seller" },
  },
  "product-buyer": {
    title: "Product Buyers",
    subtitle: "Shop for building materials",
    benefits: ["Wide product catalog", "Flash deals & discounts", "KemeKit bundles", "Delivery tracking", "Shop the Look inspiration", "Price comparison"],
    cta: { label: "Browse Kemetro", href: "/kemetro" },
  },
  "franchise-owner": {
    title: "Franchise Owners",
    subtitle: "Own a piece of the Kemedar network",
    benefits: ["Exclusive area coverage", "Commission on all transactions", "Local management tools", "User & property oversight", "Wallet & earnings dashboard", "Growth analytics"],
    cta: { label: "Learn More", href: "/contact" },
  },
};

export default async function UserBenefitsPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const data = roleBenefits[role];
  if (!data) notFound();

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Benefits for {data.title}</h1>
        <p className="text-slate-500">{data.subtitle}</p>
      </div>
      <div className="bg-white border rounded-xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-3">
          {data.benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Link href={data.cta.href} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
          {data.cta.label}
        </Link>
      </div>
    </div>
  );
}
