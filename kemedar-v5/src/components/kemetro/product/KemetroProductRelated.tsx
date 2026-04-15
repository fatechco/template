// @ts-nocheck
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KemetroProductCard from "@/components/kemetro/home/KemetroProductCard";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Premium Cement Bag 50kg",
    thumbnailImage: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80",
    price: 12.99,
    salePrice: 9.99,
    rating: 4.8,
    totalReviews: 234,
    storeId: "store-1",
  },
  {
    id: 2,
    name: "Steel Rods 10mm",
    thumbnailImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    price: 520,
    salePrice: 450,
    rating: 4.6,
    totalReviews: 145,
    storeId: "store-2",
  },
  {
    id: 3,
    name: "Floor Tiles 60x60",
    thumbnailImage: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300&q=80",
    price: 45,
    salePrice: 38,
    rating: 4.9,
    totalReviews: 189,
    storeId: "store-3",
  },
];

function RelatedCarousel({ title, products }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF6B00] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-[#FF6B00] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0">
            <KemetroProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KemetroProductRelated({ product }) {
  return (
    <div className="mt-16">
      {/* More from this Store */}
      <RelatedCarousel
        title="More from this Store"
        products={MOCK_PRODUCTS}
      />

      {/* Similar Products */}
      <RelatedCarousel
        title="Similar Products"
        products={MOCK_PRODUCTS}
      />

      {/* Frequently Bought Together */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Frequently Bought Together</h2>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {MOCK_PRODUCTS.slice(0, 3).map((prod) => (
              <div key={prod.id} className="text-center">
                <img
                  src={prod.thumbnailImage}
                  alt={prod.name}
                  className="w-full aspect-square object-cover rounded-lg mb-3"
                />
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{prod.name}</p>
                <p className="text-lg font-black text-gray-900 mt-2">${prod.salePrice}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">Total Bundle Price</p>
              <p className="text-3xl font-black text-gray-900">
                ${MOCK_PRODUCTS.slice(0, 3).reduce((sum, p) => sum + (p.salePrice || p.price), 0)}
              </p>
            </div>
            <button className="bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
              Add All to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Customers Also Viewed */}
      <RelatedCarousel
        title="Customers Also Viewed"
        products={MOCK_PRODUCTS}
      />
    </div>
  );
}