// @ts-nocheck
import Link from "next/link";

const CATEGORIES = [
  { icon: "🏠", name: "Home Design & Remodeling", slug: "home-design-remodeling", count: 842 },
  { icon: "📐", name: "Architects & Designers", slug: "architects-building-designers", count: 315 },
  { icon: "🎨", name: "Interior Designers", slug: "interior-designers-decorators", count: 628 },
  { icon: "🔨", name: "General Contractors", slug: "general-contractors-construction", count: 1240 },
  { icon: "⚡", name: "Electrical Services", slug: "electrical-services", count: 934 },
  { icon: "🔧", name: "Plumbing Services", slug: "plumbing-services", count: 756 },
  { icon: "🎭", name: "Painting & Decorating", slug: "painting-decorating", count: 688 },
  { icon: "🪚", name: "Carpentry & Woodwork", slug: "carpentry-woodwork", count: 445 },
  { icon: "🪟", name: "Flooring & Tiling", slug: "flooring-tiling", count: 512 },
  { icon: "🏗", name: "Roofing Services", slug: "roofing-services", count: 287 },
  { icon: "❄️", name: "HVAC & Air Conditioning", slug: "hvac-air-conditioning", count: 823 },
  { icon: "🌿", name: "Landscaping & Gardening", slug: "landscaping-gardening", count: 391 },
  { icon: "🧹", name: "Cleaning Services", slug: "cleaning-services", count: 1102 },
  { icon: "🔐", name: "Security & Smart Home", slug: "security-smart-home", count: 234 },
  { icon: "🐛", name: "Pest Control", slug: "pest-control", count: 178 },
  { icon: "📦", name: "Moving & Packing", slug: "moving-packing", count: 344 },
  { icon: "📸", name: "Photography", slug: "photography-videography", count: 256 },
  { icon: "⚖️", name: "Legal Services", slug: "legal-administrative-services", count: 143 },
  { icon: "🔬", name: "Engineering & Consulting", slug: "engineering-consulting", count: 198 },
  { icon: "➕", name: "Other Services", slug: "other-services", count: 567 },
];

export default function KWCategories() {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Browse by Category</h2>
        <p className="text-gray-500 text-center mb-10">Find the right professional for every home need</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/kemework/category/${cat.slug}`}
              className="group flex flex-col items-center text-center p-4 rounded-2xl border border-gray-100 bg-white hover:border-red-400 hover:shadow-md transition-all cursor-pointer"
            >
              <span className="text-4xl mb-2">{cat.icon}</span>
              <p className="font-bold text-gray-800 text-xs leading-snug mb-1 group-hover:text-red-700">{cat.name}</p>
              <p className="text-gray-400 text-[11px]">{cat.count.toLocaleString()} Professionals</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/kemework/categories"
            className="text-sm font-bold transition-colors"
            style={{ color: "#C41230" }}
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </div>
  );
}