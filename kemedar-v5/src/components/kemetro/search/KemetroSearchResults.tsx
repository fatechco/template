"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Grid3x3, List, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import KemetroProductCard from "@/components/kemetro/home/KemetroProductCard";

const DEMO_PRODUCTS = [
  { id: "d1", name: "Premium Portland Cement 50kg", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80", price: 7.50, priceUnit: "bag", rating: 4.8, reviewCount: 234, storeName: "BuildRight Materials", storeId: "buildright-materials", slug: "portland-cement-50kg" },
  { id: "d2", name: "Steel Reinforcement Rods 10mm", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80", price: 420, priceUnit: "ton", rating: 4.6, reviewCount: 89, storeName: "Steel Direct", storeId: "steel-direct", slug: "steel-rods-10mm" },
  { id: "d3", name: "Ceramic Floor Tiles 60×60", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", price: 28.50, priceUnit: "m²", rating: 4.7, reviewCount: 167, storeName: "Tile Experts Co.", storeId: "tile-experts", slug: "ceramic-floor-tiles-60x60" },
  { id: "d4", name: "Wall Paint Matte White 20L", image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80", price: 49.99, priceUnit: "can", rating: 4.9, reviewCount: 234, storeName: "Paint Hub", storeId: "paint-hub", slug: "wall-paint-matte-white-20l" },
  { id: "d5", name: "Sand Bags Fine Grade 25kg", image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&q=80", price: 3.50, priceUnit: "bag", rating: 4.5, reviewCount: 56, storeName: "BuildRight Materials", storeId: "buildright-materials", slug: "sand-bags-25kg" },
  { id: "d6", name: "Bricks Standard Red Clay", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80", price: 0.35, priceUnit: "piece", rating: 4.4, reviewCount: 312, storeName: "Masonry World", storeId: "masonry-world", slug: "bricks-red-clay" },
  { id: "d7", name: "Plasterboard 12.5mm 2.4m", image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=400&q=80", price: 12.00, priceUnit: "sheet", rating: 4.6, reviewCount: 78, storeName: "Drywall Pro", storeId: "drywall-pro", slug: "plasterboard-12-5mm" },
  { id: "d8", name: "Waterproofing Membrane 4mm", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&q=80", price: 18.00, priceUnit: "m²", rating: 4.7, reviewCount: 103, storeName: "WaterSeal Co.", storeId: "waterseal", slug: "waterproofing-membrane-4mm" },
  { id: "d9", name: "UPVC Door 210×90cm", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", price: 380, priceUnit: "piece", rating: 4.5, reviewCount: 45, storeName: "DoorWorld", storeId: "doorworld", slug: "upvc-door" },
  { id: "d10", name: "LED Strip Light 5m Warm", image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=400&q=80", price: 14.99, priceUnit: "roll", rating: 4.8, reviewCount: 198, storeName: "LightZone", storeId: "lightzone", slug: "led-strip-light-5m" },
  { id: "d11", name: "PVC Pipe 4 inch 6m", image: "https://images.unsplash.com/photo-1621905251271-48416bd8575a?w=400&q=80", price: 9.80, priceUnit: "piece", rating: 4.3, reviewCount: 67, storeName: "Plumb Direct", storeId: "plumb-direct", slug: "pvc-pipe-4inch" },
  { id: "d12", name: "Granite Tiles Grey 60×60", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80", price: 45.00, priceUnit: "m²", rating: 4.9, reviewCount: 122, storeName: "Stone Gallery", storeId: "stone-gallery", slug: "granite-tiles-grey" },
];

const ITEMS_PER_PAGE = 12;
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low-High" },
  { value: "price-desc", label: "Price: High-Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];

function ProductListItem({ product }) {
  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
      <img src={product.thumbnailImage} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <a href={`/kemetro/product/${product.slug}`} className="text-blue-600 hover:underline font-semibold text-sm line-clamp-2">
              {product.name}
            </a>
            <p className="text-xs text-gray-500 mt-1">{product.brand || "Unknown Brand"}</p>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">{product.description}</p>
            )}
          </div>
          <button className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
            <Heart size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-semibold">{product.rating || 0}</span>
              <span className="text-xs text-gray-500">({product.totalReviews || 0})</span>
            </div>
          </div>

          <div>
            <div className="text-lg font-black text-gray-900">${product.salePrice || product.price}</div>
            {product.salePrice && (
              <div className="text-xs text-gray-500 line-through">${product.price}</div>
            )}
            <div className="text-xs text-gray-500">{product.priceUnit || "per piece"}</div>
          </div>

          <div>
            {product.minOrderQuantity > 1 && (
              <p className="text-xs text-gray-600">Min: {product.minOrderQuantity}</p>
            )}
          </div>

          <button className="bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KemetroSearchResults({ filters, categorySlug, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = { isApproved: true, isActive: true };
        if (categorySlug) query.categoryId = categorySlug;
        if (searchQuery) query.name = { $regex: searchQuery };

        const data = await apiClient.list("/api/v1/kemetroproduct", query);
        // Use demo products if no real data
        const mapped = (data || []).map((p) => ({ ...p, image: p.thumbnailImage || p.image }));
        setProducts(mapped.length > 0 ? mapped : DEMO_PRODUCTS);
        setCurrentPage(1);
      } catch (error) {
        setProducts(DEMO_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, searchQuery]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 border border-gray-100">
        <div className="text-sm font-semibold text-gray-700">
          {products.length} Products found
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <label className="text-xs text-gray-600">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#FF6B00]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-l border-gray-200 pl-4 flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-[#FF6B00] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-[#FF6B00] text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={18} />
            </button>
          </div>

          <button className="text-[#0077B6] hover:underline text-sm font-medium">
            Save Search
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6B00] rounded-full animate-spin mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {paginatedProducts.map((product) => (
            <KemetroProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {paginatedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-2 rounded border border-gray-200 hover:border-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded font-medium transition-colors ${
                currentPage === page
                  ? "bg-[#FF6B00] text-white"
                  : "border border-gray-200 hover:border-[#FF6B00]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 rounded border border-gray-200 hover:border-[#FF6B00] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}