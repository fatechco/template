import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const WISHLIST_ITEMS = [
  { id: 1, emoji: "🪑", name: "Ergonomic Office Chair", price: "$180", rating: 4.6, reviews: 234 },
  { id: 2, emoji: "💡", name: "Smart LED Desk Lamp", price: "$65", rating: 4.8, reviews: 512 },
  { id: 3, emoji: "🛏️", name: "Memory Foam Mattress", price: "$450", rating: 4.5, reviews: 189 },
  { id: 4, emoji: "🪞", name: "Wall Mirror with Frame", price: "$75", rating: 4.4, reviews: 98 },
  { id: 5, emoji: "🌿", name: "Indoor Plant Stand", price: "$45", rating: 4.7, reviews: 267 },
  { id: 6, emoji: "📚", name: "Wooden Bookshelf", price: "$160", rating: 4.5, reviews: 145 },
];

export default function KemetroWishlistPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50 pb-24 max-w-[480px] mx-auto">
      <MobileTopBar title="My Wishlist" showBack />

      {/* Products Grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {WISHLIST_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/m/product/${item.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl">{item.emoji}</div>

            {/* Content */}
            <div className="p-3">
              <p className="text-xs font-bold text-gray-900 line-clamp-2 min-h-8">{item.name}</p>
              <p className="text-sm font-black text-gray-900 mt-2">{item.price}</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs text-yellow-600">⭐ {item.rating}</span>
                <span className="text-xs text-gray-400">({item.reviews})</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove from wishlist
                  }}
                  className="flex-1 text-xs font-bold text-red-600 py-2 hover:bg-red-50 rounded transition-colors"
                >
                  Remove ❤️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to cart
                  }}
                  className="flex-1 text-xs font-bold text-white bg-orange-600 py-2 rounded hover:bg-orange-700 transition-colors"
                >
                  🛒 Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {WISHLIST_ITEMS.length === 0 && (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">❤️</p>
          <p className="text-gray-600 font-medium">Your wishlist is empty</p>
          <p className="text-sm text-gray-500 mt-1">Save items you love to find them later</p>
          <button
            onClick={() => navigate("/m/find/product")}
            className="mt-4 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
}