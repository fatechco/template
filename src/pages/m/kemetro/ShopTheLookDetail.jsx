import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const LOOK_DETAILS = {
  1: {
    title: "Scandinavian Living Room",
    designer: "Modern Interiors Cairo",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70",
    items: [
      { id: 1, name: "Minimalist Sofa", price: 3500, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70" },
      { id: 2, name: "Light Wood Coffee Table", price: 1200, image: "https://images.unsplash.com/photo-1565641741215-5a9b3b8e4c2c?w=200&q=70" },
      { id: 3, name: "Soft Area Rug", price: 850, image: "https://images.unsplash.com/photo-1572410239101-4f47b2e84cff?w=200&q=70" },
      { id: 4, name: "Pendant Light", price: 480, image: "https://images.unsplash.com/photo-1524634126288-917f3f61b719?w=200&q=70" },
      { id: 5, name: "Wall Shelf Set", price: 650, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70" },
      { id: 6, name: "Throw Pillows", price: 340, image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=200&q=70" },
      { id: 7, name: "Plant Pot Set", price: 290, image: "https://images.unsplash.com/photo-1485955900519-e21cc028cb29?w=200&q=70" },
      { id: 8, name: "Wall Art", price: 320, image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=200&q=70" },
    ],
  },
};

export default function ShopTheLookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const look = LOOK_DETAILS[id] || LOOK_DETAILS[1];
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm truncate">{look.title}</p>
        <div className="w-6" />
      </div>

      {/* Cover */}
      <div className="h-56 overflow-hidden">
        <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <p className="font-black text-lg text-gray-900">{look.title}</p>
        <p className="text-sm text-gray-500 mt-1">By {look.designer}</p>
        <p className="text-xs text-gray-400 mt-2">{look.items.length} shoppable items</p>
      </div>

      {/* Items Grid */}
      <div className="px-4 py-6 space-y-3">
        <h2 className="font-black text-gray-900 text-base">Shop All Items</h2>
        <div className="grid grid-cols-2 gap-3">
          {look.items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-32 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{item.name}</p>
                <p className="text-sm font-black text-purple-600 mt-2">EGP {item.price.toLocaleString()}</p>
                <button onClick={() => addToCart(item)}
                  className="w-full flex items-center justify-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-lg mt-2 transition-colors">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sticky */}
      {cart.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-black text-gray-900">{cart.length} Items Added</p>
              <p className="text-sm font-bold text-purple-600">Total: EGP {totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={() => navigate("/m/kemetro/cart")}
              className="flex-shrink-0 bg-purple-600 text-white font-black px-6 py-2.5 rounded-lg text-sm">
              🛒 Cart
            </button>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}