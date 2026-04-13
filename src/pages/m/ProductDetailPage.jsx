import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Share2, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";

const MOCK_PRODUCT = {
  slug: "product-1",
  name: "Italian Porcelain Floor Tile 60×60cm — Marble Effect",
  store: "TilePro Egypt",
  storeVerified: true,
  storeLogo: "https://ui-avatars.com/api/?name=TP&background=0077B6&color=fff&size=80",
  storeSlug: "tilepro",
  rating: 4.8,
  reviews: 200,
  price: 85,
  originalPrice: 110,
  unit: "per square meter",
  minOrder: 10,
  stock: 500,
  inStock: true,
  images: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e0f73?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1581897764462-3b7765945a97?w=800&q=80",
  ],
  colors: ["#F5F0EB", "#2C2C2C", "#8B7355", "#C8C8C8", "#3D2B1F"],
  sizes: ["60×60", "80×80", "60×120", "30×60"],
  description: "Premium Italian porcelain tile with stunning marble effect finish. Features ultra-low water absorption, high scratch resistance, and an elegant polished surface perfect for luxury flooring projects.\n\nSuitable for both residential and commercial applications. Anti-slip variant available upon request.",
  specs: [
    { label: "Brand", value: "Italgrés" },
    { label: "Origin", value: "Italy" },
    { label: "Material", value: "Porcelain" },
    { label: "Finish", value: "Polished" },
    { label: "Thickness", value: "10mm" },
    { label: "Water Absorption", value: "<0.1%" },
    { label: "Warranty", value: "10 years" },
  ],
  reviews_list: [
    { id: 1, name: "Ahmed K.", avatar: "https://i.pravatar.cc/150?img=3", stars: 5, date: "Feb 2026", text: "Excellent quality tiles. Very close to the photos. Fast delivery and well-packed." },
    { id: 2, name: "Sara M.", avatar: "https://i.pravatar.cc/150?img=5", stars: 5, date: "Jan 2026", text: "Used these for my living room. The marble effect looks stunning. Highly recommend TilePro!" },
    { id: 3, name: "Khaled A.", avatar: "https://i.pravatar.cc/150?img=7", stars: 4, date: "Dec 2025", text: "Great tiles but delivery took a bit longer than expected. Quality is top notch." },
  ],
  moreFromStore: Array.from({ length: 5 }, (_, i) => ({
    id: String(i + 1),
    slug: `product-${i + 2}`,
    name: ["Marble Mosaic Tile", "Wood-Effect Tile", "Outdoor Anti-Slip Tile", "Bathroom Wall Tile", "Terracotta Tile"][i],
    price: [120, 95, 70, 65, 80][i],
    image: `https://images.unsplash.com/photo-${["1524758631624-e2822e304c36","1513694203232-719a280e0f73","1556909114-f6e7ad7d3136","1581897764462-3b7765945a97","1584622650111-993a426fbf0a"][i]}?w=200&q=80`,
  })),
};

const RATING_BREAKDOWN = [
  { stars: 5, pct: 78 }, { stars: 4, pct: 14 }, { stars: 3, pct: 5 }, { stars: 2, pct: 2 }, { stars: 1, pct: 1 },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCT;

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qty, setQty] = useState(product.minOrder);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const touchStart = { x: 0 };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Image gallery */}
      <div className="relative bg-gray-200" style={{ height: 280 }}>
        <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setSaved(s => !s)} className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
            <Heart size={16} color={saved ? "#EF4444" : "white"} fill={saved ? "#EF4444" : "none"} />
          </button>
          <button className="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
            <Share2 size={16} color="white" />
          </button>
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {product.images.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className={`rounded-full transition-all ${i === imgIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`} />
          ))}
        </div>
      </div>
      {/* Thumbnail row */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar bg-white border-b border-gray-100">
        {product.images.map((img, i) => (
          <button key={i} onClick={() => setImgIdx(i)}
            className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 ${i === imgIdx ? "border-orange-600" : "border-transparent"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Card 1 — Header */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <img src={product.storeLogo} className="w-7 h-7 rounded-full" alt={product.store} />
          <span className="text-xs text-blue-600 font-bold">{product.store}</span>
          {product.storeVerified && <span className="text-[10px] text-blue-500">✅</span>}
        </div>
        <p className="font-black text-gray-900 text-[18px] leading-tight">{product.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className={`text-sm ${i <= Math.round(product.rating) ? "text-amber-400" : "text-gray-200"}`}>★</span>)}</div>
          <span className="text-sm font-bold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
        </div>
        {/* Price */}
        <div className="mt-3 bg-orange-50 border-l-4 border-orange-600 rounded-r-xl pl-3 pr-3 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[28px] font-black text-orange-600">EGP {product.price}</span>
            <span className="text-sm text-gray-400 line-through">EGP {product.originalPrice}</span>
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-auto">-{discount}% OFF</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{product.unit}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">Minimum order: {product.minOrder} sqm</p>
        <p className="text-sm font-semibold text-green-600 mt-0.5">🟢 In Stock ({product.stock} sqm available)</p>
      </div>

      {/* Card 2 — Variants */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-3">Color</p>
        <div className="flex gap-2.5 mb-4">
          {product.colors.map((color, i) => (
            <button key={i} onClick={() => setSelectedColor(i)}
              className={`w-8 h-8 rounded-full flex-shrink-0 transition-all ${selectedColor === i ? "ring-2 ring-orange-600 ring-offset-2" : ""}`}
              style={{ background: color, border: "1px solid #E5E7EB" }} />
          ))}
        </div>
        <p className="font-black text-gray-900 text-sm mb-2">Size</p>
        <div className="flex gap-2 flex-wrap">
          {product.sizes.map((size, i) => (
            <button key={i} onClick={() => setSelectedSize(i)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${selectedSize === i ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Card 3 — Quantity & Cart */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setQty(q => Math.max(product.minOrder, q - 1))} className="w-9 h-9 bg-gray-100 rounded-xl text-gray-700 font-black text-xl flex items-center justify-center">−</button>
            <span className="font-black text-gray-900 text-lg w-8 text-center">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 bg-gray-100 rounded-xl text-gray-700 font-black text-xl flex items-center justify-center">+</button>
          </div>
          <p className="text-xs text-gray-400">Min: {product.minOrder} sqm</p>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="font-black text-orange-600 text-lg">EGP {(qty * product.price).toLocaleString()}</span>
        </div>
        <button className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-sm mb-2">
          🛒 Add to Cart
        </button>
        <button onClick={() => setSaved(s => !s)} className="w-full border border-orange-600 text-orange-600 font-bold py-3.5 rounded-2xl text-sm">
          {saved ? "❤️ Saved to Wishlist" : "🤍 Add to Wishlist"}
        </button>
      </div>

      {/* Card 4 — Delivery */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4 space-y-2">
        <p className="font-black text-gray-900 text-sm mb-2">Delivery</p>
        <p className="text-sm text-gray-600">📦 Delivery to: <span className="font-bold text-gray-900">Cairo</span></p>
        <p className="text-sm text-gray-600">🚚 Estimated: <span className="font-bold text-gray-900">3–7 business days</span></p>
        <p className="text-sm text-gray-600">🔄 Returns: <span className="font-bold text-gray-900">14-day return policy</span></p>
      </div>

      {/* Card 5 — Description */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <p className="font-black text-gray-900 text-sm mb-2">Description</p>
        <p className={`text-sm text-gray-600 leading-relaxed whitespace-pre-line ${!expanded ? "line-clamp-4" : ""}`}>{product.description}</p>
        <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 text-orange-600 text-xs font-bold mt-2">
          {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
        </button>
      </div>

      {/* Card 6 — Specs */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 overflow-hidden">
        <p className="font-black text-gray-900 text-sm p-4 border-b border-gray-100">Specifications</p>
        {product.specs.map((spec, i) => (
          <div key={spec.label} className={`flex px-4 py-2.5 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
            <span className="text-xs text-gray-500 w-28 flex-shrink-0">{spec.label}</span>
            <span className="text-xs font-semibold text-gray-800">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* Card 7 — Reviews */}
      <div className="bg-white mx-4 mt-3 rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-gray-900 text-sm">Reviews</p>
          <button className="text-xs text-orange-600 font-bold">See all {product.reviews} →</button>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="text-center">
            <p className="text-4xl font-black text-gray-900">{product.rating}</p>
            <div className="flex gap-0.5 justify-center mt-1">{[1,2,3,4,5].map(i => <span key={i} className="text-orange-400 text-base">★</span>)}</div>
          </div>
          <div className="flex-1 space-y-1">
            {RATING_BREAKDOWN.map(r => (
              <div key={r.stars} className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 w-2">{r.stars}</span>
                <span className="text-orange-400 text-[10px]">★</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {product.reviews_list.map(review => (
          <div key={review.id} className="border-t border-gray-100 pt-3 mt-3">
            <div className="flex items-center gap-2 mb-1.5">
              <img src={review.avatar} className="w-8 h-8 rounded-full" alt={review.name} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{review.name}</span>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= review.stars ? "text-amber-400" : "text-gray-200"}`}>★</span>)}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>

      {/* Card 8 — More from store */}
      <div className="mt-3 mb-3">
        <p className="font-black text-gray-900 text-sm px-4 mb-2.5">More from {product.store}</p>
        <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-1">
          {product.moreFromStore.map(p => (
            <button key={p.id} onClick={() => navigate(`/m/product/${p.slug}`)}
              className="flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ width: 120 }}>
              <img src={p.image} alt={p.name} className="w-full h-20 object-cover" />
              <div className="p-2">
                <p className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight">{p.name}</p>
                <p className="text-xs font-black text-orange-600 mt-1">EGP {p.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3" style={{ paddingBottom: "max(12px,env(safe-area-inset-bottom))" }}>
        <button className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center">
          <Heart size={20} className="text-gray-500" />
        </button>
        <button className="flex-1 bg-orange-600 text-white font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2">
          <ShoppingCart size={16} /> Add to Cart — EGP {(qty * product.price).toLocaleString()}
        </button>
      </div>
    </div>
  );
}