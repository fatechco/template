import { Link } from "react-router-dom";

const CATEGORIES = [
  { id: 1, name: "Construction", slug: "construction", count: 1240, color: "#8B4513", icon: "🏗️" },
  { id: 2, name: "Masonry", slug: "masonry", count: 890, color: "#708090", icon: "🧱" },
  { id: 3, name: "Architectural", slug: "architectural", count: 450, color: "#2F4F4F", icon: "🏛️" },
  { id: 4, name: "Natural Stone", slug: "natural-stone", count: 620, color: "#696969", icon: "🪨" },
  { id: 5, name: "Electrical", slug: "electrical", count: 1100, color: "#FFD700", icon: "⚡" },
  { id: 6, name: "Plumbing", slug: "plumbing", count: 980, color: "#4169E1", icon: "🚿" },
  { id: 7, name: "Mechanical", slug: "mechanical", count: 540, color: "#708090", icon: "⚙️" },
  { id: 8, name: "Appliances", slug: "appliances", count: 650, color: "#1E90FF", icon: "📺" },
  { id: 9, name: "Furniture", slug: "furniture", count: 2100, color: "#8B6914", icon: "🛋️" },
  { id: 10, name: "Landscaping", slug: "landscaping", count: 380, color: "#228B22", icon: "🌿" },
  { id: 11, name: "Decorative", slug: "decorative", count: 1500, color: "#FF69B4", icon: "✨" },
  { id: 12, name: "Security", slug: "security", count: 420, color: "#DC143C", icon: "🔒" },
  { id: 13, name: "Kemedar Services", slug: "services", count: 95, color: "#FF6B00", icon: "🎯" },
];

export default function KemetroCategoryShop() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500">Find everything for your home from construction to decoration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/kemetro/category/${cat.slug}`}
              className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div
                className="aspect-square flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: cat.color + "20" }}
              >
                {cat.icon}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{cat.count} Products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}