import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart, Share2, ShoppingCart, Zap, Truck, RotateCcw, Shield,
  Star, ChevronRight, Minus, Plus, MessageCircle, CheckCircle,
  Package, Clock, Award, Facebook, Copy, ChevronLeft
} from "lucide-react";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import SuperFooter from "@/components/layout/SuperFooter";

const MOCK_PRODUCT = {
  id: "p-001",
  name: "Premium Portland Cement 50kg Bag – High Strength Grade 42.5",
  sku: "CEM-POR-50-425",
  brand: "LafargeHolcim",
  origin: "Egypt",
  rating: 4.8,
  totalReviews: 234,
  totalSold: 1872,
  price: 9.99,
  salePrice: 7.50,
  priceUnit: "per bag",
  minOrderQuantity: 10,
  isInStock: true,
  stockCount: 4500,
  storeId: "buildright-materials",
  storeName: "BuildRight Materials",
  storeRating: 4.9,
  storeVerified: true,
  categoryName: "Cement & Concrete",
  weight: "50",
  weightUnit: "kg",
  dimensions: "60 × 40 × 15 cm",
  material: "Portland Clinker",
  warrantyMonths: 6,
  description: `Premium Grade 42.5 Portland Cement, manufactured to the highest Egyptian and international standards (ES 4756-1). Ideal for all types of construction work including:

• Structural concrete (columns, beams, slabs)
• Reinforced concrete foundations
• Plasterwork and masonry
• Precast concrete products
• General building and civil engineering

This cement achieves high early strength and excellent durability, making it the preferred choice of professional contractors across the region. Each bag is sealed and moisture-resistant to ensure optimal shelf life and consistent performance on site.`,
  thumbnailImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
  imageGallery: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&q=80",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
  ],
};

const RELATED_PRODUCTS = [
  { id: "r1", name: "Steel Rods 10mm", price: 420, salePrice: 390, rating: 4.6, reviewCount: 89, storeName: "Steel Direct", storeId: "steel-direct", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80", priceUnit: "per ton" },
  { id: "r2", name: "Ceramic Floor Tiles 60×60", price: 31.5, salePrice: 28.5, rating: 4.7, reviewCount: 167, storeName: "Tile Experts", storeId: "tile-experts", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80", priceUnit: "per m²" },
  { id: "r3", name: "Wall Paint Matte White 20L", price: 59.5, salePrice: 49.99, rating: 4.9, reviewCount: 234, storeName: "Paint Hub", storeId: "paint-hub", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=300&q=80", priceUnit: "per can" },
  { id: "r4", name: "Sand Bags Fine 25kg", price: 3.5, salePrice: null, rating: 4.5, reviewCount: 56, storeName: "BuildRight Materials", storeId: "buildright-materials", image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&q=80", priceUnit: "per bag" },
];

const REVIEWS = [
  { name: "Ahmed Hassan", rating: 5, date: "2025-02-20", comment: "Excellent quality cement. Used for foundation work and the results were fantastic. Fast delivery too!", verified: true, helpful: 24 },
  { name: "Fatima Mohamed", rating: 4, date: "2025-02-15", comment: "Good product, consistent quality across all bags. Packaging could be slightly more durable for transport.", verified: true, helpful: 18 },
  { name: "Omar Al-Rashid", rating: 5, date: "2025-01-30", comment: "Ordered 500 bags for a large project. Quality is exactly as described — professional grade.", verified: true, helpful: 31 },
];

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

function RelatedProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <div className="flex-shrink-0 w-52 bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-lg">-{discount}%</div>
        )}
        <button onClick={() => setWishlisted(!wishlisted)} className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
          <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3 space-y-1.5">
        <Link to={`/kemetro/store/${product.storeId}`} className="text-xs text-blue-600 font-semibold hover:underline">{product.storeName}</Link>
        <p className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</p>
        <StarRating rating={product.rating} size={11} />
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-gray-900">${product.salePrice || product.price}</span>
          {product.salePrice && <span className="text-xs text-gray-400 line-through">${product.price}</span>}
        </div>
        <button className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition-colors">
          <ShoppingCart size={12} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function KemetroProductDetail() {
  const { slug } = useParams();
  const product = MOCK_PRODUCT;

  const [mainImage, setMainImage] = useState(product.thumbnailImage);
  const [quantity, setQuantity] = useState(product.minOrderQuantity);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const allImages = [product.thumbnailImage, ...product.imageGallery];
  const discount = Math.round(((product.price - product.salePrice) / product.price) * 100);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const SPECS = [
    { label: "SKU", value: product.sku },
    { label: "Brand", value: product.brand },
    { label: "Origin", value: product.origin },
    { label: "Weight", value: `${product.weight} ${product.weightUnit}` },
    { label: "Dimensions", value: product.dimensions },
    { label: "Material", value: product.material },
    { label: "Warranty", value: `${product.warrantyMonths} months` },
    { label: "Grade", value: "42.5 N" },
    { label: "Standard", value: "ES 4756-1 / EN 197-1" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/kemetro" className="hover:text-[#FF6B00] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/kemetro/search" className="hover:text-[#FF6B00] transition-colors">{product.categoryName}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 grid grid-cols-12 gap-10">

          {/* ── Gallery Column ── */}
          <div className="col-span-5 space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-crosshair"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={isZoomed ? { transform: "scale(2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              />
              {/* Discount badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1 rounded-xl">
                -{discount}% OFF
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img ? "border-[#FF6B00] shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, text: "Secure Payment", color: "text-green-600" },
                { icon: RotateCcw, text: "14-Day Returns", color: "text-blue-600" },
                { icon: Award, text: "Verified Seller", color: "text-orange-500" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3 text-center">
                  <Icon size={20} className={color} />
                  <span className="text-xs text-gray-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Info Column ── */}
          <div className="col-span-7 space-y-5">
            {/* Store + badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link to={`/kemetro/store/${product.storeId}`} className="text-sm font-bold text-[#0077B6] hover:underline">
                {product.storeName}
              </Link>
              {product.storeVerified && (
                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  <CheckCircle size={11} /> Verified
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <StarRating rating={product.storeRating} size={11} />
                {product.storeRating}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-black text-gray-900 leading-snug">{product.name}</h1>

            {/* Rating row */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size={16} />
                <span className="font-black text-gray-800">{product.rating}</span>
                <span className="text-gray-500 text-sm">({product.totalReviews} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm"><span className="font-bold text-gray-800">{product.totalSold.toLocaleString()}</span> sold</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                <Package size={12} /> {product.stockCount.toLocaleString()} in stock
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-[#0077B6]">${product.salePrice}</span>
              <span className="text-xl text-gray-400 line-through">${product.price}</span>
              <span className="bg-red-100 text-red-600 text-sm font-black px-3 py-1 rounded-xl">Save {discount}%</span>
            </div>
            <p className="text-sm text-gray-500 -mt-3">{product.priceUnit} · Min. order: <span className="font-bold text-gray-700">{product.minOrderQuantity} bags</span></p>

            {/* Key specs strip */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 text-sm">
              <div><p className="text-gray-400 text-xs">Brand</p><p className="font-bold text-gray-900">{product.brand}</p></div>
              <div><p className="text-gray-400 text-xs">Origin</p><p className="font-bold text-gray-900">{product.origin}</p></div>
              <div><p className="text-gray-400 text-xs">SKU</p><p className="font-bold text-gray-900 text-xs">{product.sku}</p></div>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-green-600 font-bold text-sm">In Stock</span>
              <span className="text-gray-400 text-sm">— Ready to ship within 24 hrs</span>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-700">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center font-black text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Total: <span className="font-black text-gray-900">${(product.salePrice * quantity).toFixed(2)}</span></span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-lg shadow-orange-200">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="flex-1 bg-[#0077B6] hover:bg-blue-700 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-base">
                <Zap size={18} /> Buy Now
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${wishlisted ? "border-red-400 bg-red-50" : "border-gray-300 hover:border-red-400"}`}
              >
                <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"} />
              </button>
              <button className="w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center transition-all">
                <Share2 size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Contact seller */}
            <button className="w-full flex items-center justify-center gap-2 border-2 border-green-400 text-green-700 hover:bg-green-50 font-bold py-3 rounded-xl transition-colors">
              <MessageCircle size={16} /> Chat with Seller on WhatsApp
            </button>

            {/* Delivery info */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-[#0077B6] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Estimated Delivery</p>
                  <p className="font-bold text-gray-900 text-sm">3–7 Business Days · From Cairo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-[#0077B6] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Returns</p>
                  <p className="font-bold text-gray-900 text-sm">Accepted within 14 days · Free for defective items</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#0077B6] flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Seller Response Time</p>
                  <p className="font-bold text-gray-900 text-sm">Usually within 2 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Section ── */}
        <div className="bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: `Reviews (${product.totalReviews})` },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max px-8 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id ? "border-[#FF6B00] text-[#FF6B00]" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-2xl">
                <table className="w-full text-sm">
                  <tbody>
                    {SPECS.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                        <td className="px-4 py-3 font-bold text-gray-700 w-1/3">{spec.label}</td>
                        <td className="px-4 py-3 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Rating summary */}
                <div className="flex gap-12 pb-8 border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-6xl font-black text-gray-900">{product.rating}</div>
                    <StarRating rating={product.rating} size={20} />
                    <p className="text-gray-500 text-sm mt-1">{product.totalReviews} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((s, i) => {
                      const pcts = [68, 22, 6, 2, 2];
                      return (
                        <div key={s} className="flex items-center gap-3 text-sm">
                          <span className="w-8 text-gray-500 text-right">{s}★</span>
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[i]}%` }} />
                          </div>
                          <span className="w-8 text-gray-500">{pcts[i]}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-6">
                  {REVIEWS.map((r, i) => (
                    <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-black text-sm">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{r.name}</p>
                            <div className="flex items-center gap-2">
                              <StarRating rating={r.rating} size={12} />
                              {r.verified && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-2">👍 {r.helpful} people found this helpful</p>
                    </div>
                  ))}
                </div>

                <button className="bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 px-8 rounded-xl transition-colors">
                  Write a Review
                </button>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="grid grid-cols-2 gap-8 max-w-3xl">
                <div>
                  <h3 className="font-black text-gray-900 mb-4">Shipping Zones</h3>
                  <table className="w-full text-sm">
                    <thead><tr className="bg-gray-50">
                      <th className="px-3 py-2 text-left font-bold text-gray-700">Zone</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-700">Cost</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-700">Days</th>
                    </tr></thead>
                    <tbody>
                      {[["Cairo & Giza", "Free (10+ bags)", "2–3"], ["Delta Region", "$10", "3–5"], ["Upper Egypt", "$20", "5–7"], ["International", "On Request", "10–14"]].map(([zone, cost, days], i) => (
                        <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                          <td className="px-3 py-2 text-gray-700">{zone}</td>
                          <td className="px-3 py-2 font-semibold text-gray-900">{cost}</td>
                          <td className="px-3 py-2 text-gray-600">{days} days</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-4">Return Policy</h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p>✅ Returns accepted within <strong>14 days</strong> of delivery.</p>
                    <p>✅ Items must be in <strong>original condition</strong> and packaging.</p>
                    <p>✅ <strong>Free return shipping</strong> for defective or incorrect items.</p>
                    <p>✅ Refund processed within <strong>3–5 business days</strong>.</p>
                    <p>❌ Opened or used bulk orders are not eligible for return.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related Products ── */}
        <div className="mt-8">
          <h2 className="text-2xl font-black text-gray-900 mb-5">Similar Products</h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            {RELATED_PRODUCTS.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}