import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, MapPin, Bed, Bath } from "lucide-react";

const MOCK_FAVORITES = [
  { id: 1, title: "Luxury Penthouse in Zamalek", price: "$850,000", location: "Zamalek, Cairo", purpose: "Sale", beds: 4, baths: 3, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80" },
  { id: 2, title: "Cozy Studio in Maadi", price: "$700/mo", location: "Maadi, Cairo", purpose: "Rent", beds: 1, baths: 1, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
  { id: 3, title: "Family Villa in Sheikh Zayed", price: "$380,000", location: "Sheikh Zayed, Giza", purpose: "Sale", beds: 5, baths: 4, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
  { id: 4, title: "Office Space in New Cairo", price: "$3,200/mo", location: "New Cairo, Cairo", purpose: "Rent", beds: null, baths: 2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
  { id: 5, title: "Townhouse in Katameya", price: "$260,000", location: "Katameya, Cairo", purpose: "Sale", beds: 3, baths: 2, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80" },
  { id: 6, title: "Sea View Apartment - North Coast", price: "$145,000", location: "North Coast, Egypt", purpose: "Sale", beds: 2, baths: 1, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
];

const PURPOSE_COLORS = { Sale: "bg-blue-100 text-blue-700", Rent: "bg-purple-100 text-purple-700" };

export default function Favorites() {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES);

  const remove = (id) => setFavorites(f => f.filter(p => p.id !== id));

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">No favorites yet</h2>
        <p className="text-gray-500 mb-6">Save properties you love to compare them later.</p>
        <Link to="/search-properties" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors">
          Browse Properties →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Favorite Properties</h1>
        <p className="text-gray-500 text-sm mt-0.5">{favorites.length} saved properties</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {favorites.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${PURPOSE_COLORS[p.purpose]}`}>{p.purpose}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{p.title}</h3>
              <p className="text-2xl font-black text-orange-500 mb-2">{p.price}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                <MapPin size={12} /> <span>{p.location}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                {p.beds && <span className="flex items-center gap-1"><Bed size={12} /> {p.beds} beds</span>}
                <span className="flex items-center gap-1"><Bath size={12} /> {p.baths} baths</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => remove(p.id)} className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2 rounded-lg text-sm transition-colors">
                  <Heart size={14} className="fill-red-400" /> Remove
                </button>
                <Link to={`/property/${p.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                  <Eye size={14} /> View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}