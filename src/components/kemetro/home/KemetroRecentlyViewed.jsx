import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import KemetroProductCard from "./KemetroProductCard";

export default function KemetroRecentlyViewed() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // In a real implementation, this would fetch from the user's viewing history
        // For now, we'll fetch some recent products
        const recentProducts = await base44.entities.KemetroProduct.list("-updated_date", 5);
        setProducts(recentProducts || []);
      } catch (error) {
        console.error("Error fetching recently viewed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F8FAFC] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Recently Viewed</h2>
        </div>

        {/* Products carousel */}
        <div className="relative">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {products.map((product) => (
              <div key={product.id} className="snap-start">
                <KemetroProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}