import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LOOKS = [
  {
    id: 1,
    title: "Scandinavian Living Room",
    designer: "Modern Interiors Cairo",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=70",
    items: 8,
    totalPrice: 8500,
    tags: ["Minimalist", "Light Wood", "Cozy"],
  },
  {
    id: 2,
    title: "Contemporary Bedroom",
    designer: "Urban Design Studio",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=500&q=70",
    items: 6,
    totalPrice: 5200,
    tags: ["Modern", "Neutral", "Relaxing"],
  },
  {
    id: 3,
    title: "Industrial Kitchen",
    designer: "Space Reimagined",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=70",
    items: 11,
    totalPrice: 12400,
    tags: ["Industrial", "Open Plan", "Functional"],
  },
  {
    id: 4,
    title: "Bohemian Living Space",
    designer: "Creative Homes",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=70",
    items: 9,
    totalPrice: 7100,
    tags: ["Eclectic", "Colorful", "Artistic"],
  },
  {
    id: 5,
    title: "Luxury Master Suite",
    designer: "Opulent Interiors",
    image: "https://images.unsplash.com/photo-1631049307038-da5ec5d79645?w=500&q=70",
    items: 14,
    totalPrice: 18900,
    tags: ["Luxe", "Gold Accents", "Elegant"],
  },
  {
    id: 6,
    title: "Family Dining",
    designer: "Home & Heart",
    image: "https://images.unsplash.com/photo-1577496322241-8f45a1a5fef3?w=500&q=70",
    items: 7,
    totalPrice: 6300,
    tags: ["Warm", "Functional", "Welcoming"],
  },
];

export default function ShopTheLookBrowse() {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState(null);

  const filtered = selectedTag
    ? LOOKS.filter(l => l.tags.includes(selectedTag))
    : LOOKS;

  const allTags = [...new Set(LOOKS.flatMap(l => l.tags))];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">Shop the Look</p>
        <div className="w-6" />
      </div>

      {/* Filter Tags */}
      <div className="sticky top-[56px] z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setSelectedTag(null)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              !selectedTag ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
            }`}>
            All ({LOOKS.length})
          </button>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTag(tag)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                selectedTag === tag ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700"
              }`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((look, idx) => (
            <div key={idx} onClick={() => navigate(`/m/kemetro/shop-the-look/${idx + 1}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative h-56 overflow-hidden">
                <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white font-black text-base">{look.title}</p>
                  <p className="text-white/70 text-xs">{look.designer}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-black text-purple-600">{look.items} Shoppable Items</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total: EGP {look.totalPrice.toLocaleString()}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {look.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🎨</div>
            <p className="font-black text-gray-700 mb-1">No looks found</p>
            <p className="text-gray-500 text-xs">Try a different tag</p>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}