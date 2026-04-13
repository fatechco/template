import { Link } from "react-router-dom";

const COL1 = [
  { icon: "🏠", label: "Home Design & Remodeling", slug: "home-design-remodeling" },
  { icon: "📐", label: "Architects & Building Designers", slug: "architects-building-designers" },
  { icon: "🎨", label: "Interior Designers & Decorators", slug: "interior-designers-decorators" },
  { icon: "🔨", label: "General Contractors", slug: "general-contractors-construction" },
  { icon: "⚡", label: "Electrical Services", slug: "electrical-services" },
  { icon: "🔧", label: "Plumbing Services", slug: "plumbing-services" },
  { icon: "🎭", label: "Painting & Decorating", slug: "painting-decorating" },
];
const COL2 = [
  { icon: "🪚", label: "Carpentry & Woodwork", slug: "carpentry-woodwork" },
  { icon: "🪟", label: "Flooring & Tiling", slug: "flooring-tiling" },
  { icon: "🏗", label: "Roofing Services", slug: "roofing-services" },
  { icon: "❄️", label: "HVAC & Air Conditioning", slug: "hvac-air-conditioning" },
  { icon: "🌿", label: "Landscaping & Gardening", slug: "landscaping-gardening" },
  { icon: "🧹", label: "Cleaning Services", slug: "cleaning-services" },
  { icon: "🔐", label: "Security & Smart Home", slug: "security-smart-home" },
];
const COL3 = [
  { icon: "🐛", label: "Pest Control", slug: "pest-control" },
  { icon: "📦", label: "Moving & Packing", slug: "moving-packing" },
  { icon: "📸", label: "Photography & Videography", slug: "photography-videography" },
  { icon: "⚖️", label: "Legal Services", slug: "legal-administrative-services" },
  { icon: "🔬", label: "Engineering & Consulting", slug: "engineering-consulting" },
  { icon: "➕", label: "Other Services", slug: "other-services" },
];

function CatLink({ icon, label, slug }) {
  return (
    <Link
      to={`/kemework/category/${slug}`}
      className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm text-gray-700 hover:bg-red-50 hover:text-[#C41230] transition-colors group"
    >
      <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
      <span className="group-hover:font-medium">{label}</span>
    </Link>
  );
}

export default function KemeworkCategoriesMega({ onClose }) {
  return (
    <div
      className="absolute top-full left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-5"
      style={{ width: 740, marginTop: 4 }}
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-3 gap-2">
        <div>
          {COL1.map(c => <CatLink key={c.slug} {...c} />)}
        </div>
        <div>
          {COL2.map(c => <CatLink key={c.slug} {...c} />)}
        </div>
        <div>
          {COL3.map(c => <CatLink key={c.slug} {...c} />)}
          <Link
            to="/kemework/categories"
            className="flex items-center gap-1 mt-2 px-2 text-sm font-bold transition-colors"
            style={{ color: "#C41230" }}
            onClick={onClose}
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </div>
  );
}