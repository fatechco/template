import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, MapPin, Bed, Bath, ChevronLeft } from "lucide-react";

const MOCK_FAVORITES = [
  { id: 1, title: "Luxury Penthouse in Zamalek", price: "$850,000", location: "Zamalek, Cairo", purpose: "Sale", beds: 4, baths: 3, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
  { id: 2, title: "Cozy Studio in Maadi", price: "$700/mo", location: "Maadi, Cairo", purpose: "Rent", beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 3, title: "Family Villa in Sheikh Zayed", price: "$380,000", location: "Sheikh Zayed, Giza", purpose: "Sale", beds: 5, baths: 4, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
  { id: 4, title: "Office Space in New Cairo", price: "$3,200/mo", location: "New Cairo, Cairo", purpose: "Rent", beds: null, baths: 2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
];

const PURPOSE_COLORS = { Sale: "bg-blue-100 text-blue-700", Rent: "bg-purple-100 text-purple-700" };

export default function DeveloperFavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const remove = (id) => setFavorites(f => f.filter(p => p.id !== id));

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-24 px-4 text-center max-w-[480px] mx-auto">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No favorites yet</h2>
        <p className="text-gray-500 mb-6">Save properties you love to compare them later.</p>
        <button
          onClick={() => navigate("/m/find/filters")}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
        >
          Browse Properties →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-gray-900">My Favorites</h1>
          <p className="text-xs text-gray-500">{favorites.length} saved properties</p>
        </div>
      </div>

      {/* Favorites List */}
      <div className="px-4 py-4 space-y-4">
        {favorites.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${PURPOSE_COLORS[p.purpose]}`}>
                {p.purpose}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{p.title}</h3>
                <p className="text-xl font-black text-orange-600">{p.price}</p>
              </div>

              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <MapPin size={14} className="flex-shrink-0" />
                <span>{p.location}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                {p.beds && <span className="flex items-center gap-1"><Bed size={14} /> {p.beds} beds</span>}
                <span className="flex items-center gap-1"><Bath size={14} /> {p.baths} baths</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => remove(p.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 rounded-lg text-sm transition-colors"
                >
                  <Heart size={16} className="fill-red-400" /> Remove
                </button>
                <button
                  onClick={() => navigate(`/m/property/${p.id}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}