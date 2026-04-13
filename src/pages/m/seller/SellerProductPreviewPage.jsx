import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Share2, ExternalLink, Package, Tag, DollarSign, Eye, TrendingUp } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const MOCK_PRODUCT = {
  id: "p1",
  name: "Premium Portland Cement 50kg",
  sku: "CEM-50KG",
  category: "Masonry Materials",
  price: 7.50,
  stock: 4500,
  status: "Active",
  sales: 156,
  views: 1872,
  rating: 4.6,
  reviews: 23,
  description: "High-quality Portland cement for all your construction needs. Suitable for concrete, mortar, and grout applications.",
  images: [
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
  ],
  shipping: { weight: "50kg", dimensions: "60x40x10 cm" },
  created: "2025-01-15",
};

export default function SellerProductPreviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    // Simulate fetching product data
    setTimeout(() => {
      setProduct(MOCK_PRODUCT);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-5xl mb-3">😕</p>
          <p className="font-bold text-gray-700">Product not found</p>
          <button onClick={() => navigate("/m/dashboard/seller-products")}
            className="mt-4 px-6 py-2 bg-[#0077B6] text-white font-bold rounded-xl text-sm">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <MobileTopBar
        title="Product Preview"
        showBack={true}
        rightAction={
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/m/dashboard/seller-products/${product.id}/edit`)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0077B6] text-white rounded-lg font-bold text-xs">
              <Edit size={12} /> Edit
            </button>
          </div>
        }
      />

      <div className="p-4 space-y-4">
        {/* Product Card Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Images */}
          <div className="relative">
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeImage === idx ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
            {product.stock === 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
                OUT OF STOCK
              </span>
            )}
            {product.stock > 0 && product.stock < 10 && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full">
                LOW STOCK
              </span>
            )}
          </div>

          {/* Basic Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs font-bold text-[#0077B6] bg-[#0077B6]/10 px-2 py-1 rounded-full">
                {product.category}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                product.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {product.status}
              </span>
            </div>

            <h1 className="font-black text-gray-900 text-lg mb-1">{product.name}</h1>
            <p className="text-xs text-gray-500 font-mono mb-3">SKU: {product.sku}</p>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-black text-[#0077B6]">${product.price}</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Package size={14} className="text-gray-400" />
                <span className="font-bold">{product.stock.toLocaleString()} in stock</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-bold">{product.rating}</span>
                <span className="text-gray-400">({product.reviews})</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-[#0077B6] to-blue-600 rounded-2xl p-4 text-white">
          <h2 className="font-black text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} /> Performance Stats
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-black">{product.views.toLocaleString()}</p>
              <p className="text-xs opacity-80 mt-0.5">Views</p>
            </div>
            <div>
              <p className="text-2xl font-black">{product.sales}</p>
              <p className="text-xs opacity-80 mt-0.5">Sales</p>
            </div>
            <div>
              <p className="text-2xl font-black">{product.rating}</p>
              <p className="text-xs opacity-80 mt-0.5">Rating</p>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Package size={16} className="text-[#0077B6]" /> Shipping Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Weight</span>
              <span className="font-bold text-gray-900">{product.shipping.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dimensions</span>
              <span className="font-bold text-gray-900">{product.shipping.dimensions}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-black text-sm text-gray-900 mb-3 flex items-center gap-2">
            <Tag size={16} className="text-[#0077B6]" /> Product Information
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-bold text-gray-900">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">SKU</span>
              <span className="font-bold text-gray-900 font-mono">{product.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price</span>
              <span className="font-bold text-gray-900">${product.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Stock</span>
              <span className="font-bold text-gray-900">{product.stock.toLocaleString()} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-bold text-green-600">{product.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="font-bold text-gray-900">{product.created}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate(`/m/dashboard/seller-products/${product.id}/edit`)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077B6] text-white font-bold rounded-xl text-sm hover:bg-[#006699] transition-colors"
          >
            <Edit size={16} /> Edit Product
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}